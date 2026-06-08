
import { supabase } from "./client"

export type Profile = {
    id: string
    email_optin: boolean | null
}

export const getProfile = async ({ id }: { id: string }): Promise<Profile | null> => {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", id).maybeSingle()
    if (error) {
        console.error("Error fetching profile", error)
        return null
    }
    return data
}