import { supabase } from "./client"

export const signUpUser = async ({ email, password, emailOptin }: { email: string, password: string, emailOptin: boolean }) => {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                email_optin: !!emailOptin
            }
        }
    })
}

export const signInUser = async ({ email, password }: { email: string, password: string }) => {
    return await supabase.auth.signInWithPassword({
        email,
        password
    })
}

export const logOut = async () => {
    return await supabase.auth.signOut()
}