import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// WIP (should have variants in theme) + loader

type Action = {
    label: string,
    onPress: (() => void) | (() => Promise<void>)
    submitting?: boolean
}

export default function DualActionsFooter({
    leftAction,
    rightAction,
    colorVariant = "neutral",
    showLoaderOnSubmitting = false
}: {
    leftAction: Action;
    rightAction: Action;
    colorVariant?: "neutral" | "green" | "blue" | "dark",
    showLoaderOnSubmitting?: boolean
}) {
    return (
        <View style={styles.dualActionsContainer}>
            <TouchableOpacity
                style={[styles.button, styles.leftButton]}
                onPress={leftAction.onPress}
                disabled={leftAction.submitting}
            >
                <Text style={[styles.buttonText, styles.leftButtonText]}>
                    {leftAction.label}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.rightButton]}
                onPress={rightAction.onPress}
                disabled={rightAction.submitting}
            >
                <Text style={[styles.buttonText, styles.rightButtonText]}>
                    {rightAction.label}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    dualActionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 16
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 4,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    leftButton: {
        borderWidth: 1,
        borderColor: Colors.light.chocolate
    },
    leftButtonText: {
        color: Colors.light.chocolate
    },
    rightButton: {
        backgroundColor: Colors.light.chocolate
    },
    rightButtonText: {
        color: Colors.light.mainBeige
    }
})