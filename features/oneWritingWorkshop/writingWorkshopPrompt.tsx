import { Colors } from "@/constants/theme"
import { StyleSheet, Text, View } from "react-native"

export default function WritingWorkshopPrompt({ prompt }: { prompt: string }) {
    return (
        <View style={styles.promptContainer}>
            <Text style={styles.promptLabel}>Prompt</Text>
            <Text style={styles.prompt}>{prompt}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    promptContainer: {
        display: "flex",
        gap: 8,
        padding: 16,
        backgroundColor: Colors.light.faintWarmWhite
    },
    promptLabel: {
        fontSize: 10,
        color: Colors.light.chocolate
    },
    prompt: {
        fontStyle: "italic",
        color: Colors.light.chocolate
    }

})