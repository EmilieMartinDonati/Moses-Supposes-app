import { supabase } from "@/services/supabase/client";
import { createTestExquisiteCorpseParticipant, createTestWorkshop, deleteTestWorkshop } from "@/tests/helpers/seed";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

describe("test assign next turn", () => {
    // ----- SEED ------- //
    let workshopId: string
    beforeAll(async () => {
        const workshop = await createTestWorkshop({
            type: "exquisite_corpse",
            visibility: "public"
        })
        if (!workshop) {
            return
        }
        workshopId = workshop.id
        for (let i = 0; i < 50; i++) {
            const guestId = crypto.randomUUID()
            const exquisiteCorpseParticipant = await createTestExquisiteCorpseParticipant({
                workshopId,
                guestId,
                state: "waiting"
            })
            if (!exquisiteCorpseParticipant) {
                return
            }
        }
        // --------- CONCURRENCY STORM --------- //
        const promises = []
        for (let i = 0; i < 50; i++) {
            promises.push(supabase.rpc("assign_next_turn", {
                p_workshop_id: workshopId
            }))
        }
        await Promise.all(promises)
    })
    // ----- CLEAN UP SEED ------- //
    afterAll(async () => {
        await deleteTestWorkshop({ workshopId }) // will also delete associated rows on tables exquisite_corpse_config, exquisite_corpse_participants, contributions
    })
    // ------ RUN TESTS ------- //
    test("has promoted one and exactly one to active", async () => {

        const { count } = await supabase.from("exquisite_corpse_participants")
            .select("*", { count: "exact", head: true })
            .eq("workshop_id", workshopId)
            .eq("state", "active")
        expect(count).toBe(1)
    })

    test("active ticket has correct fields", async () => {
        const { data: activeTicket } = await supabase.from("exquisite_corpse_participants")
            .select("*")
            .eq("workshop_id", workshopId)
            .eq("state", "active")
            .maybeSingle()


        expect(activeTicket).not.toBeNull()
        expect(activeTicket!.turn_started_at).not.toBeNull()
        expect(activeTicket!.turn_deadline).not.toBeNull()

    })

    test("fifo respect for exquisite corpse tickets", async () => {

        const { data: activeTicket } = await supabase.from("exquisite_corpse_participants")
            .select("state, joined_at")
            .eq("workshop_id", workshopId)
            .eq("state", "active")
            .single()

        if (!activeTicket) {
            expect(activeTicket).toBeDefined()
            return
        }

        const { data: waitingTickets } = await supabase.from("exquisite_corpse_participants")
            .select("state, joined_at")
            .eq("workshop_id", workshopId)
            .eq("state", "waiting")

        expect(waitingTickets?.length).toBeGreaterThan(0)

        const foundAnteriorInWaitings = waitingTickets!.some(t => t.joined_at < activeTicket.joined_at)

        expect(foundAnteriorInWaitings).toBe(false)

    })
})