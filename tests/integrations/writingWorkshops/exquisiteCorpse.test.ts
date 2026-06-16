import { submitContribution } from "@/actions/contributions";
import { getExquisiteCorpseTicket } from "@/actions/exquisiteCorpses";
import { useAppStore } from "@/store/useAppStore";
import { createTestWorkshop, deleteTestWorkshop } from "@/tests/helpers/seed";
import { supabase } from "@/tests/helpers/supabaseTestClient";
import { ExquisiteCorpseParticipantType } from "@/types/exquisite_corpse_participants";
import { delay } from "@/utils/utils";
import { afterAll, beforeAll, describe, expect, test } from "vitest";

const fetchParticipants = async ({ workshopId }: { workshopId: string }): Promise<ExquisiteCorpseParticipantType[]> => {
    const { data: participants } = await
        supabase.from("exquisite_corpse_participants")
            .select("*")
            .eq("workshop_id", workshopId)

    return participants ?? []
}

const findActiveParticipant = async (workshopId: string): Promise<ExquisiteCorpseParticipantType> => {
    const { data: activeParticipant } = await supabase
        .from("exquisite_corpse_participants")
        .select("*")
        .eq("workshop_id", workshopId)
        .eq("state", "active")
        .maybeSingle()

    return activeParticipant
}

describe("exquisite corpse full flow", () => {
    let workshopId: string
    let participantsIds: string[]

    beforeAll(async () => {
        let participants: ExquisiteCorpseParticipantType[] = []
        const workshop = await createTestWorkshop({
            type: "exquisite_corpse",
            visibility: "public"
        })
        if (!workshop) {
            return
        }
        workshopId = workshop.id
        // ---- spawn players ---- //
        for (let i = 0; i < 5; i++) {
            const guestId = crypto.randomUUID()
            await getExquisiteCorpseTicket({
                workshopId, guestId, userId: null
            })
        }
        // ---- fetch participants ---- //
        participants = await fetchParticipants({ workshopId }) // mutated through game (participants are refreshed with new status)
        participantsIds = participants.map(p => p.id) // not mutated, for test assertions
        // ---- game on ! ------- //
        let doneCount = 0
        let retryCount = 0
        const maxRetries = 10
        while (doneCount < participants.length) {
            const activeParticipant = await findActiveParticipant(workshopId)
            if (!activeParticipant && retryCount < maxRetries) {
                await delay(500)
                retryCount += 1
                continue
            }
            if (!activeParticipant) {
                throw new Error('no active participant found after max retries')
            }
            retryCount = 0
            useAppStore.setState({ guestId: activeParticipant.guest_id })
            await submitContribution({
                type: "exquisite_corpse",
                content: `Contrib vitest ${activeParticipant.id.substring(0, 5)}`,
                workshopId,
                participantId: activeParticipant.id
            })
            doneCount += 1
        }
    })

    afterAll(async () => {
        await deleteTestWorkshop({ workshopId })
    })

    test("every participant has status done", async () => {
        const { data: participants } = await supabase
            .from("exquisite_corpse_participants")
            .select("state")
            .eq("workshop_id", workshopId)
            .in("id", participantsIds)

        expect(participants?.every(p => p.state === "done")).toBe(true)
    })

    test("every participant has a contrib", async () => {
        const { data: contributions } = await supabase
            .from("contributions")
            .select("*")
            .eq("workshop_id", workshopId)

        const uniqueParticipantIds = new Set(contributions!.map(c => c.participant_id))
        expect(uniqueParticipantIds.size).toEqual(participantsIds.length)
    })

})