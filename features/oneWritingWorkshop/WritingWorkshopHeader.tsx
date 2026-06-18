import { OnlineParticipant } from "@/app/workshops/[id]"
import GroupedAvatars from "@/components/GroupedAvatars"
import { Colors } from "@/constants/theme"
import { StyleSheet, Text, View } from "react-native"
import { formatAvatar } from "./formatAvatar"
import { ReactNode } from "react"

export default function WritingWorkshopHeader({
    title, 
    type = "Cadavre Exquis",
    onlineParticipants = [],
    renderRightAction = null
}: {
    title?: string,
    type: string,
    onlineParticipants?: OnlineParticipant[],
    renderRightAction?: (() => ReactNode) | null
}) {

    console.log("renderRightAction", renderRightAction)

    return (
        <View style={styles.writingWorkshopHeaderContainer}>
            <View style={styles.writingWorkshopHeaderTextContent}>
                <Text style={styles.writingWorkshopType}>{type}</Text>
                <Text style={styles.writingWorkshopName}>{title}</Text>
            </View>
            {onlineParticipants?.length > 0 && (
                <View>
                    <GroupedAvatars
                        avatars={onlineParticipants.map(formatAvatar)}
                        avatarWidth={40} />
                </View>)
            }
            {!!renderRightAction && renderRightAction()}
        </View>
    )
}

const styles = StyleSheet.create({
    writingWorkshopHeaderContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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