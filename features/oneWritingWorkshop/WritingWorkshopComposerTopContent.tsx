import { OnlineParticipant } from "@/app/workshops/[id]"
import Avatar from "@/components/Avatar"
import { Colors } from "@/constants/theme"
import { StateType } from "@/types/exquisite_corpse_participants"
import { useMemo } from "react"
import { StyleSheet, Text, View } from "react-native"
import { formatAvatar } from "./formatAvatar"

export default function WritingWorkshopComposerTopContent({
    onlineParticipant,
    participantState = "waiting",
}: {
    onlineParticipant?: OnlineParticipant,
    participantState?: StateType
}) {

    const userText = useMemo(() => {
        const messages: Record<StateType, string> = {
            waiting: "Bientôt ton tour ...",
            active: "A toi de jouer",
            timed_out: "Le temps s'est écoulé, votre tour a expiré",
            done: "Merci l'artiste ! ^^",
        }
        return messages[participantState]
    }, [participantState])



    return (
        <View style={styles.container}>
            <Avatar item={formatAvatar(onlineParticipant)} avatarWidth={40} />
            <View style={styles.textAndAction}>
                <Text style={styles.text}>{userText.toUpperCase()}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    text: {
        color: Colors.light.chocolate
    },
    textAndAction: {
        flexDirection: "row",
        gap: 16
    }
})