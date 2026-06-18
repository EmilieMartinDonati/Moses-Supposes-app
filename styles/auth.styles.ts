import { Colors } from "@/constants/theme"
import { StyleSheet } from "react-native"


export const authStyles = StyleSheet.create({
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