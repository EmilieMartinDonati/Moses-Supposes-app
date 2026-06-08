
import { supabase } from "./client"

export const createProfile = async ({ id, emailOptin }: { id: string, emailOptin: boolean }) => {
       return await supabase.from("profiles").insert({
            id,
            email_optin: emailOptin
        }).select("*").single()
}