import { supabase } from "./client"

export const getExquisiteCorpseConfig = async ({
    workshopId,
    select
}: {
    workshopId: string,
    select?: string
}) => {
    return await supabase
        .from("exquisite_corpse_config")
        .select(select)
        .eq("workshop_id", workshopId)
        .single()
}

export const insertExquisiteCorpseConfig = async ({
    payload
}: { 
    payload: any
 }) => {
    return await supabase.from("exquisite_corpse_config").insert(payload).select("*").single()
}