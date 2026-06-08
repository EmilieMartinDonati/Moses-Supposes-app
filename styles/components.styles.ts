import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const buttonStyles = StyleSheet.create({
    button: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    button_md: {
        width: 180
    },
    disabled: {
        opacity: 0.4
    },
    buttonText: {
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    secondaryButton_neutral: {
        borderWidth: 1,
        borderColor: Colors.light.chocolate
    },
    secondaryButtonText_neutral: {
        color: Colors.light.chocolate
    },
    button_neutral: {
        backgroundColor: Colors.light.chocolate
    },
    buttonText_neutral: {
        color: Colors.light.mainBeige
    },
    secondaryButton_green: {
        borderWidth: 1,
        borderColor: Colors.light.forestGreen
    },
    secondaryButtonText_green: {
        color: Colors.light.forestGreen
    },
    button_green: {
        backgroundColor: Colors.light.forestGreen
    },
    buttonText_green: {
        color: Colors.light.waterGreen
    }
})