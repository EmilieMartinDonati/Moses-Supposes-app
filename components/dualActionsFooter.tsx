import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function DualActionsFooter({
    leftAction,
    rightAction,
}: {
    leftAction: { label: string; onPress: () => void };
    rightAction: { label: string; onPress: () => void };
}) {
    return (
        <View style={styles.dualActionsContainer}>
            <TouchableOpacity
                style={[styles.button, styles.leftButton]}
                onPress={leftAction.onPress}
            >
                <Text style={[styles.buttonText, styles.leftButtonText]}>
                    {leftAction.label}
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.rightButton]}
                onPress={rightAction.onPress}
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
        gap: 12
    },
    button: {
        flex: 1,
        borderRadius: 8,
        paddingVertical: 12,
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