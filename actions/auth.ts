
import { createProfile } from "@/services/supabase/profiles"
import { signInUser, signUpUser } from "@/services/supabase/users"
import { getAuthErrorMessage } from "../utils/authentification"

export const signUpAndLoginUser = async ({ email, password, emailOptin }: {
    email: string,
    password: string,
    emailOptin: boolean
}) => {
    const result: { error: string | undefined, errorCode: string | undefined , data: any } = {
        error: undefined,
        errorCode: undefined,
        data: undefined
    }
    try {
        const { error: signupError, data: { user } } = await signUpUser({ email, password })

        if (signupError) {
            result.errorCode = signupError.code
            result.error = getAuthErrorMessage(signupError.code)
            return result
        }
        if (!user) {
            result.error = "Nous n'avons pas pu créer votre profil. Veuillez contacter votre service client"
            return result
        }

        const { error: profileError } = await createProfile({
            id: user.id,
            emailOptin
        })

        if (profileError) {
            result.errorCode = "profile_creation"
            result.error = "Nous n'avons pas pu créer votre profil"
            return result
        }

        const { error: signInError, data: signInData } = await signInUser({
            email, password
        })

        if (signInError) {
            result.errorCode = signInError.code
            result.error = getAuthErrorMessage(signInError.code)
            return result
        }
        result.data = signInData?.user
        return result
    } catch (e) {
        console.error("Unexpected error during sign up and login", e)
        result.errorCode = "unexpected_failure"
        result.error = "Il y a eu une erreur. Veuillez contacter le service client"
    } finally {
        return result
    }
}