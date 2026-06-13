import { getExquisiteCorpseTicket } from "@/actions/exquisiteCorpses";
import { supabase } from "@/services/supabase/client";
import { createTestWorkshop, deleteTestWorkshop } from "@/tests/helpers/seed";
import { afterEach, beforeEach, describe, expect, test } from "vitest";

describe("join exquisite corpse as guest", () => {
    let workshopId: string
    const guestId = crypto.randomUUID()
    // ----------- SEED --------------//
    beforeEach(async () => {
        const workshop = await createTestWorkshop({
            type: "exquisite_corpse",
            visibility: "public"
        })
        workshopId = workshop?.id
        if (!workshopId) {
            return
        }
        await getExquisiteCorpseTicket({
            workshopId, guestId, userId: null
        })
    })
    afterEach(async () => {
        await deleteTestWorkshop({ workshopId })
    })
    // ----------- TEST ------------//
    test("creates exactly one participant", async () => {
        const { count } = await supabase
            .from("exquisite_corpse_participants")
            .select("*", { count: "exact", head: true })
            .eq("workshop_id", workshopId);
        expect(count).toBe(1);
    });

    test("participant has guest identity and cycle 0", async () => {
        const { data } = await supabase
            .from("exquisite_corpse_participants")
            .select("guest_id, user_id, cycle")
            .eq("workshop_id", workshopId).single();
        expect(data).toMatchObject({ guest_id: guestId, user_id: null, cycle: 0 });
    });

    test("assign_next_turn promotes the participant to active", async () => {
        const { data } = await supabase
            .from("exquisite_corpse_participants")
            .select("state, turn_started_at")
            .eq("workshop_id", workshopId).single();
        expect(data?.state).toBe("active");
        expect(data?.turn_started_at).not.toBeNull();
    });

})