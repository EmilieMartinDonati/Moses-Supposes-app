import { supabase } from "./client"

export const getGuestSingleContribution = async ({
    guestId,
    select = "*",
    ascending = false
}: { guestId: string, select?: string, ascending?: boolean}) => {

   return await supabase.from("contributions")
        .select(select)
        .eq("guest_id", guestId)
        .order("_created_at", { ascending: ascending })
        .single()
}