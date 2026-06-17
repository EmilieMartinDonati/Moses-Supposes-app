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
    writingDelay
}: {
    onlineParticipant?: OnlineParticipant,
    participantState: StateType,
    writingDelay: number
}) {

    const userText = useMemo(() => {
        const messages: Record<StateType, string> = {
            waiting: "Bientôt ton tour ...",
            active: "A toi de jouer",
            timed_out: "Votre tour a expiré",
            done: "Merci l'artiste ! ^^",
        }
        return messages[participantState]
    }, [participantState])

    const showCounter = useMemo(() => {
        return participantState === "active"
    }, [participantState])



    return (
        <View style={styles.container}>
            <View style={styles.avatarAndText}>
                <Avatar item={
                    {...formatAvatar(onlineParticipant), bgColor: Colors.light.honey }} avatarWidth={40} />
                <Text style={styles.text}>{userText.toUpperCase()}</Text>
            </View>
            {showCounter && (
                <Text style={styles.text}>
                    {writingDelay / 60} min
                </Text>)
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    text: {
        color: Colors.light.chocolate
    },
    avatarAndText: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 8
    }
})