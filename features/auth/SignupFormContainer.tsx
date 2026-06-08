import { Colors } from "@/constants/theme"
import { Link } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"
import SignupForm from "./SignupForm"


export default function SignupFormContainer() {

    return (
        <View style={styles.signupContainer}>
            <View style={styles.signupMethodsContainer}>
                <SignupForm />
                <View style={styles.dividerContainer}>
                    <View style={styles.divider}></View>
                    <Text style={styles.dividerText}>OU</Text>
                    <View style={styles.divider}></View>
                </View>
                <View><Pressable><Text>Se connecter avec Google</Text></Pressable></View>
            </View>
            <View><Text>
                Déjà un compte ?{" "}
                <Link href="/auth/login">
                    Se connecter
                </Link></Text></View>
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
    }
})