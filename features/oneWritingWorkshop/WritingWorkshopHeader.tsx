import { OnlineParticipant } from "@/types/workshops"
import GroupedAvatars from "@/components/GroupedAvatars"
import { Colors } from "@/constants/theme"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { formatAvatar } from "./formatAvatar"
import { ReactNode } from "react"
import { Feather } from "@expo/vector-icons"
import { NavigationActions } from "@/actions/navigation"

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

    return (
        <View style={styles.writingWorkshopHeaderContainer}>
            <View>
                <Pressable onPress={NavigationActions.goHome}>
                    <Feather name="chevron-left" size={24} color={Colors.light.chocolate}/>
                    </Pressable>
            </View>
            <View style={styles.writingWorkshopHeaderMainContent}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    writingWorkshopHeaderContainer: {
        height: 80,
        paddingHorizontal: 16,
        borderBottomColor: Colors.light.elevatedBeige,
        borderBottomWidth: 1,
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 16
    },
    writingWorkshopHeaderMainContent: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1
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