import { clickWritingWorkshop } from "@/actions/writingWorkshops"
import { Colors } from "@/constants/theme"
import { WorkshopType } from "@/types/workshops"
import { Pressable, StyleSheet, Text, View } from "react-native"
import WritingWorkshopCardSkeletonContent from "./WritingWorkshopCardSkeletonContent"

type WritingWorkshopCardProps = {
    writingWorkshopId: string,
    title: string,
    prompt: string,
    participantsCount: number,
    startTime: string,
    endTime: string,
    visibility: "live" | "upcoming" | "finished",
    loading: boolean,
    type: WorkshopType
}

export default function WritingWorkshopCard({ writingWorkshopId, title, prompt, type = "exquisite_corpse", participantsCount, endTime, startTime, visibility, loading }: WritingWorkshopCardProps) {

    const _onPress = async () => {
       await clickWritingWorkshop({ type, workshopId: writingWorkshopId, visibility });
    }

    if (loading) {
        return (
            <WritingWorkshopCardSkeletonContent />
        )
    }

    return (
        <View style={styles.workshopCard}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.prompt}>{prompt}</Text>
            <View style={{ flex: 1 }} />
            <View style={styles.separatorContainer}>
                <View style={styles.separator} />
            </View>
            <Pressable
                onPress={_onPress}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed
                ]}
            >
                <Text style={styles.text}>{visibility === "live" ? "Rejoindre".toUpperCase() : "Consulter".toUpperCase()}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    workshopCard: {
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column",
        width: 200,
        height: 280,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb" // gray-200
    },
    title: {
        fontWeight: "bold",
        fontSize: 16
    },
    prompt: {
        fontStyle: "italic",
        color: "#6b7280" // gray-500
    },
    separatorContainer: {
        backgroundColor: '#d1d5db',
        height: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    separator: {
        backgroundColor: '#a5a8ae',
        width: 40,
        height: 2
    },
    button: {
        borderRadius: 2,
        alignItems: "center",
        padding: 10,
        alignSelf: "flex-end",
        backgroundColor: Colors.light.chocolate
    },

    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97 }],
    },

    text: {
        color: "white",
        fontSize: 12
    },
})