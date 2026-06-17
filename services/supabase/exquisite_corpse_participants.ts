import { ExquisiteCorpseParticipantType, StateType } from '@/types/exquisite_corpse_participants';
import { supabase } from "./client";

export const getExquisiteCorseParticipantById = async ({
    id
}: { id: string }) => {
    return await supabase.from("exquisite_corpse_participant").select("*").eq("id", id).single()
}

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
        .eq("state", "done")
        .or(orFilters)
        .order("joined_at", { ascending: ascending })
        .limit(1)
        .maybeSingle()
}

export const getExquisiteCorpseCurrentParticipationFromUser = async ({
    guestId, userId, workshopId, select = "*", ascending = false
}: { guestId: string | null, userId: string | null, workshopId: string, select?: string, ascending?: boolean }) => {

    let query = supabase
        .from("exquisite_corpse_participants")
        .select(select)
        .eq("workshop_id", workshopId)
        .in("state", ["waiting", "active"])
        .order("joined_at", { ascending: ascending })
        .limit(1)

    if (userId && guestId) {
        query.or(`user_id.eq.${userId},guest_id.eq.${guestId}`)
    } else if (userId) {
        query.eq("user_id", userId)
    } else if (guestId) {
        query.eq("guest_id", guestId)
    }
    return await query.maybeSingle()
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


export const deleteExquisiteCorpseParticipantsByWorkshop = async ({ workshopId }: { workshopId: string }) => {
    return await supabase.from("exquisite_corpse_participants").delete().eq("workshop_id", workshopId)
}

export const countExquisiteCorpseParticipantsByState = async ({ workshopId, state = "waiting" }: { workshopId: string, state?: StateType }) => {
    return await supabase.from("exquisite_corpse_participants").select("*", { count: "exact", head: true }).eq("workshop_id", workshopId).eq("state", state)
}
