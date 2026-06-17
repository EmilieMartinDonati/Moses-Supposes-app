import { NavigationActions } from "@/actions/navigation"
import DualActionsFooter from "@/components/DualActionsFooter"
import { Colors } from "@/constants/theme"
import { StyleSheet, Text, View } from "react-native"

export default function WritingWorkshopComposerReplay({
    onReplay,
    isSubmitting = false,
    remainingReplayCount = 5
}: {
    onReplay: () => Promise<void>,
    remainingReplayCount: number,
    isSubmitting: boolean
}) {

    return (
        <View style={styles.container}>
            <View style={styles.replayInvitation}>
                <Text>Vous avez encore le droit de rejouer {remainingReplayCount} fois.</Text>
            </View>
            <DualActionsFooter
                leftAction={{
                    label: "Retour",
                    onPress: NavigationActions.goHome
                }}
                rightAction={{
                    label: "Rejouer",
                    onPress: onReplay,
                    submitting: isSubmitting
                }}
                colorVariant={"green"}
                showLoaderOnSubmitting
            />
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        gap: 16,
        justifyContent: "space-between"
    },
    replayInvitation: {
        height: 80,
        backgroundColor: Colors.light.waterGreen,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 0.5,
        borderRadius: 8,
        opacity: 0.8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: Colors.light.mainBlue,
        fontSize: 14,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "justify"
    }
})