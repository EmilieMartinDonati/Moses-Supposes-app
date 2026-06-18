import { NavigationActions } from "@/actions/navigation"
import { authStyles } from "@/styles/auth.styles"
import { Link } from "expo-router"
import { Pressable, Text, View } from "react-native"
import LoginForm from "./LoginForm"

export default function LoginFormContainer() {

    const _handleRedirect = (timeoutMs: number) => {
        setTimeout(() => {
            NavigationActions.goHome()
        }, timeoutMs);
    }

    return (
        <View style={authStyles.signupContainer}>
            <View style={authStyles.signupMethodsContainer}>
                <LoginForm
                    handleRedirect={(timeout) => _handleRedirect(timeout)}
                />
                <View style={authStyles.dividerContainer}>
                    <View style={authStyles.divider}></View>
                    <Text style={authStyles.dividerText}>OU</Text>
                    <View style={authStyles.divider}></View>
                </View>
                <View><Pressable><Text>Se connecter avec Google</Text></Pressable></View>
            </View>
            <View style={authStyles.foundAccount}><Text>
                Vous n'avez pas de compte ?{" "}
                <Link style={authStyles.link} href="/auth/signup">
                    S'inscrire
                </Link></Text>
                </View>
        </View>
    )

}