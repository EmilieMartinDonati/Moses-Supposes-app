import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const formStyles = StyleSheet.create({
    formContainer: {
        gap: 24,
    },
    fieldGroup: {
        gap: 8,
    },
    fieldGroupLg: {
      gap: 16
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: Colors.light.chocolate,
        opacity: 0.6,
    },
    textInput: {
        backgroundColor: Colors.light.faintWarmWhite,
        color: Colors.light.chocolate,
        fontSize: 15,
        padding: 12,
        borderRadius: 8,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 1,
    },
    textInputError: {
       borderColor: Colors.light.redError
    },
    textInputMultiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    errorText: {
        fontSize: 12,
        color: Colors.light.redError
    }
})