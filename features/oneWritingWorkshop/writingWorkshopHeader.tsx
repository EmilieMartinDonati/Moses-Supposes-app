import { Colors } from "@/constants/theme"
import { StyleSheet, Text, View } from "react-native"

export default function WritingWorkshopHeader({ title, type = "Cadavre Exquis", presencesCount, participantsCount }: { title: string, type: string, presencesCount?: number, participantsCount?: number }) {
    return (
        <View style={styles.writingWorkshopHeaderContainer}>
            <View style={styles.writingWorkshopHeaderTextContent}>
                <Text style={styles.writingWorkshopType}>{type}</Text>
                <Text style={styles.writingWorkshopName}>{title}</Text>
            </View>
            <View></View>
        </View>
    )
}

const styles = StyleSheet.create({
    writingWorkshopHeaderContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        height: 80,
        paddingHorizontal: 16,
        borderBottomColor: Colors.light.elevatedBeige,
        borderBottomWidth: 1,
        backgroundColor: "white"
    },
    writingWorkshopHeaderTextContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
        color: "#ffffff"
    },
    writingWorkshopType: {
        textTransform: "uppercase",
        color: Colors.light.mainBlue
    },
    writingWorkshopName: {
        fontWeight: "600",
        fontSize: 16,
        textTransform: "uppercase",
        color: Colors.light.chocolate
    }
})