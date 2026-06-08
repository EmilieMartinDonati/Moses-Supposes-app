import * as Crypto from 'expo-crypto';
import { supabase } from "./client";

type StateType = "waiting" | "active" | "timed_out" | "done"

type ExquisiteCorpseParticipantType = {
    workshop_id: string,
    user_id?: string,
    guest_id?: string,
    participant_id: string,
    state: StateType,
    cycle: number
}

export const createExquisiteCorpseParticipant = async ({ workshopId, userId, guestId }: { workshopId: string, userId?: string, guestId?: string }) => {
    try {
        const payload: ExquisiteCorpseParticipantType = {
            workshop_id: workshopId,
            state: "waiting",
            cycle: 0,
            participant_id: Crypto.randomUUID()
        }
        if (userId) payload.user_id = userId
        if (guestId) payload.guest_id = guestId

        const { data, error } = await supabase.from("exquisite_corpse_participants").insert(payload).select("*").single()

        if (error) {
            throw error
        }
        return data
    }
    catch (error) {
        console.error(`Unexpected error creating participant for workshop id ${workshopId} and user id ${userId}`, error)
    }
}


/**
 * 
 * @param param0 
 * @returns 
BEGIN;

SELECT next participant FOR UPDATE SKIP LOCKED
ORDER BY joined_at ASC
LIMIT 1;

UPDATE that row → active + timestamps;

COMMIT;
 */
export const changeExquisiteCorpseParticipantState = async ({
    participantId,
    workshopId,
    newState,
}: {
    participantId: string
    newState: StateType,
    workshopId: string
}) => {
    try {
        const updatePayload: Record<string, any> = {
            state: newState,
        }

        if (newState === "active") {
            updatePayload.turned_started_at = new Date().toISOString()
            const { error, data: workshopConfig } = await supabase.from("exquisite_corpse_config")
                .select("writing_delay")
                .eq("workshop_id", workshopId)
                .single()

            if (error) {
                throw error
            }

            const writingDelay = workshopConfig.writing_delay || 120
            updatePayload.turn_deadline = new Date(Date.now() + writingDelay * 1000).toISOString()
        }

        const { data, error } = await supabase
            .from("exquisite_corpse_participants")
            .update(updatePayload)
            .eq("participant_id", participantId)
            .select("*")
            .single()

        if (error) throw error

        return data
    } catch (error) {
        console.error(
            `Unexpected error changing state for participant id ${participantId} to state ${newState}`,
            error
        )
    }
}

export const deleteExquisiteCorpseParticipantsByWorkshop = async ({ workshopId }: { workshopId: string }) => {
    try {
        const { error } = await supabase.from("exquisite_corpse_participants").delete().eq("workshop_id", workshopId)
        if (error) {
            throw error
        }
    }
    catch (error) {
        console.error(`Error deleting exquisite_corpse_participants for workshop ${workshopId}`, error)
    }
}

export const countExquisiteCorpseWaitingParticipants = async ({ workshopId }: { workshopId: string }) => {
    try {
        const { error, count } = await supabase.from("exquisite_corpse_participants").select("*", { count: "exact", head: true }).eq("workshop_id", workshopId).eq("state", "waiting")
        if (error) {
            throw error
        }
        return count
    }
    catch (e) {
       console.error("")
    }
}
