import { ExquisiteCorpseParticipantType, StateType } from '@/types/exquisite_corpse_participants';
import { supabase } from "./client";

export const getLastExquisiteCorpseParticipationFromUser = async ({
    guestId, userId, workshopId, select = "*", ascending = false
}: { guestId: string | null, userId: string | null, workshopId: string, select?: string, ascending?: boolean }) => {
    const orFilters = [
        userId && `user_id.eq.${userId}`,
        guestId && `guest_id.eq.${guestId}`,
    ].filter(Boolean).join(",")

    return await supabase
        .from("exquisite_corpse_participants")
        .select(select)
        .eq("workshop_id", workshopId)
        .or(orFilters)
        .order("joined_at", { ascending: ascending })
        .limit(1)
        .maybeSingle()
}

export const insertExquisiteCorpseParticipant = async ({
    payload,
    select = "*"
}: {
    payload: ExquisiteCorpseParticipantType
    select?: string
}) => {
    return await supabase.from("exquisite_corpse_participants").insert(payload).select(select).single()
}


/**
 * 
 * @param param0 
 * @returns 
BEGIN;

// moved to transaction assign_next_turn (in migrations folder)
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
     return await supabase.from("exquisite_corpse_participants").delete().eq("workshop_id", workshopId)
}

export const countExquisiteCorpseParticipantsByState = async ({ workshopId, state = "waiting" }: { workshopId: string, state?: StateType }) => {
    return await supabase.from("exquisite_corpse_participants").select("*", { count: "exact", head: true }).eq("workshop_id", workshopId).eq("state", state)
}
