import { submitContribution } from "@/actions/contributions";
import { supabase } from "@/services/supabase/client";
import { useAppStore } from "@/store/useAppStore";
import { createTestExquisiteCorpseParticipant, createTestWorkshop, deleteTestWorkshop } from "@/tests/helpers/seed";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

const seedContributionContext = async ({ guestId }: { guestId: string }) => {
    const result: {
        workshopId: string | null;
        exquisiteCorpseParticipantId: string | null
    }
        = {
        workshopId: null,
        exquisiteCorpseParticipantId: null
    }
    const workshop = await createTestWorkshop({
        type: "exquisite_corpse",
        visibility: "public"
    })
    if (!workshop) {
        return result
    }
    result.workshopId = workshop.id
    const exquisiteCorpseParticipant = await createTestExquisiteCorpseParticipant({
        guestId, workshopId: workshop.id, state: "active"
    })
    if (!exquisiteCorpseParticipant) {
        return result
    }
    result.exquisiteCorpseParticipantId = exquisiteCorpseParticipant.id

    return result
}

describe("submit contribution exquisite corpse as guest", () => {
    const guestId = crypto.randomUUID()
    let workshopId: string
    let exquisiteCorpseParticipantId: string
    // ------- SEED -------- //
    beforeEach(async () => {
        // submitContribution reads identity from the store, not from params
        useAppStore.setState({ guestId, user: null, profile: null })
        const seed = await seedContributionContext({
            guestId
        })
        if (!seed.exquisiteCorpseParticipantId || !seed.workshopId) {
            return
        }
        workshopId = seed.workshopId
        exquisiteCorpseParticipantId = seed.exquisiteCorpseParticipantId
        // -------  RUN FUNCTION TO TEST -------- //
        await submitContribution({
            type: "exquisite_corpse",
            content: "This is a vitest test for contributions",
            workshopId,
            participantId: exquisiteCorpseParticipantId
        })
    })
    // ------- CLEAN UP -------- //
    afterEach(async () => {
        await deleteTestWorkshop({ workshopId }) // will also delete associated rows on tables exquisite_corpse_config, exquisite_corpse_participants, contributions
        useAppStore.setState({ guestId: null, user: null, profile: null })
    })

    // ------- TESTS -------- //
    test("test that contribution has correct fields", async () => {
        const { data: contribution } = await supabase.from("contributions")
            .select("*")
            .eq("workshop_id", workshopId)
            .eq("guest_id", guestId)
            .eq("participant_id", exquisiteCorpseParticipantId)
            .single()

        expect(contribution).toMatchObject({
            workshop_id: workshopId,
            guest_id: guestId,
            user_id: null,
            participant_id: exquisiteCorpseParticipantId,
            state: "submitted",
            display_name: null
        })

        expect(contribution.avatar_seed).not.toBe(null)
        expect(contribution.content).not.toBe(null)
        expect(contribution.created_at).not.toBe(null)
        expect(contribution.updated_at).toEqual(contribution.created_at)
    })
    test("participant is state done after contrib submission", async () => {
        const { data: participant } = await supabase.from("exquisite_corpse_participants")
            .select("*")
            .eq("id", exquisiteCorpseParticipantId)
            .single()

        expect(participant.state).toBe("done")

    })
})

describe("double fire submit contribution", () => {
    const guestId = crypto.randomUUID()
    let workshopId: string
    let exquisiteCorpseParticipantId: string
    // ------- SEED -------- //
    beforeEach(async () => {
        // submitContribution reads identity from the store, not from params
        useAppStore.setState({ guestId, user: null, profile: null })
        const seed = await seedContributionContext({
            guestId
        })
        if (!seed.exquisiteCorpseParticipantId || !seed.workshopId) {
            return
        }
        workshopId = seed.workshopId
        exquisiteCorpseParticipantId = seed.exquisiteCorpseParticipantId
        // -------  RUN FUNCTION TO TEST -------- //
        // todo test if it it called several times in a row (ex user clicks submit several times)
        const promises = []
        for (let i = 0; i < 2; i++) {
            promises.push(
                submitContribution({
                    type: "exquisite_corpse",
                    content: "This is a vitest test for contributions",
                    workshopId,
                    participantId: exquisiteCorpseParticipantId
                }))
        }
        await Promise.all(promises)

    })
    // ------- CLEAN UP -------- //
    afterEach(async () => {
        await deleteTestWorkshop({ workshopId }) // will also delete associated rows on tables exquisite_corpse_config, exquisite_corpse_participants, contributions
        useAppStore.setState({ guestId: null, user: null, profile: null })
    })
    // ------- TESTS -------- //
    test("test that contribution is unique", async () => {
        const { count } = await supabase.from("contributions")
            .select("*", { count: "exact", head: true })
            .eq("workshop_id", workshopId)
            .eq("guest_id", guestId)
            .eq("participant_id", exquisiteCorpseParticipantId)
        expect(count).toBe(1)
    })
})