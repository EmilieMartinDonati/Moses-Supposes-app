import { supabase } from "./client"

export const signUpUser = async ({ email, password, emailOptin }: { email: string, password: string, emailOptin: boolean }) => {
    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                email_optin: !!emailOptin
            }
        }
    })
    return { error, data }
}

export const signInUser = async ({ email, password }: { email: string, password: string }) => {
    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { error, data }
}

export const logOut = async ({ email, password }: { email: string, password: string }) => {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            throw error
        }
    }
    catch (e) {
        console.error("An error has occurred during logout", e)
    }
}