import { Colors } from "@/constants/theme"
import { Link, router } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import EmailOptinField from "./EmailOptinField"
import SignupForm from "./SignupForm"

export default function SignupFormContainer() {

    const _handleRedirect = (timeoutMs: number) => {
        setTimeout(() => {
            if (router.canGoBack()) router.back();
            else router.replace("/");
        }, timeoutMs);
    }

    return (
        <View style={styles.signupContainer}>
            <View style={styles.signupMethodsContainer}>
                <SignupForm
                    handleRedirect={(timeout) => _handleRedirect(timeout)}
                />
                <View style={styles.dividerContainer}>
                    <View style={styles.divider}></View>
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.divider}></View>
                </View>
                <View><Pressable><Text>Se connecter avec Google</Text></Pressable></View>
                <EmailOptinField />
            </View>
            <View style={styles.foundAccount}><Text>
                Vous avez déjà un compte ?{" "}
                <Link style={styles.link} href="/auth/login">
                    Se connecter
                </Link></Text>
                </View>
        </View>
    )

}

const styles = StyleSheet.create({
    signupContainer: {
        display: "flex",
        flex: 1,
        gap: 32,
        padding: 32
    },
    signupMethodsContainer: {
        display: "flex",
        gap: 16
    },
    dividerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    divider: {
        flex: 1,
        backgroundColor: Colors.light.chocolate,
        height: 1
    },
    dividerText: {
        color: Colors.light.chocolate
    },
    foundAccount: {
        marginTop: 24
    },
    link: {
        color: Colors.light.mainBlue,
        fontWeight: "600"
    }
})