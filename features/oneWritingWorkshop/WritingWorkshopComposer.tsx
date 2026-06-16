import { OnlineParticipant } from "@/app/workshops/[id]";
import { Colors } from "@/constants/theme";
import { ExquisiteCorpseParticipantType } from "@/types/exquisite_corpse_participants";
import { StyleSheet, View } from "react-native";
import WritingWorkshopComposerContributionForm from "./WritingWorkshopComposerContributionForm";
import WritingWorkshopComposerReplay from "./WritingWorkshopComposerReplay";
import WritingWorkshopComposerTopContent from "./WritingWorkshopComposerTopContent";

export default function WritingWorkshopComposer({
    participant,
    onlineParticipant,
    onSubmit,
    onReplay,
    replayAllowed = true,
    isSubmitting = false,
    isReplaySubmitting = false
}: {
    onlineParticipant?: OnlineParticipant,
    participant?: ExquisiteCorpseParticipantType,
    onSubmit: (data: { text: string }) => Promise<void>,
    onReplay: () => Promise<void>
    replayAllowed: boolean,
    isSubmitting: boolean,
    isReplaySubmitting: boolean
}) {

    const _getWritingWorkshopComposerMainContent = () => {
        const state = participant?.state || "waiting"
        if (state === "waiting") {
            return null
        }
        // ----- expiration or contribution just sent -----
        if (["timed_out", "done"].includes(state)) {
            if (!replayAllowed || !onReplay) {
                return null
            }
            else {
                return (
                    <WritingWorkshopComposerReplay
                        onReplay={onReplay}
                        isSubmitting={isReplaySubmitting}
                        remainingReplayCount={5}
                    />)
            }
        }
        // ----- active ----- //
        return (
            <WritingWorkshopComposerContributionForm
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
             />
        )

    }

    return (
        <View style={styles.writingWorkshopComposerContainer}>
            <WritingWorkshopComposerTopContent
                participantState={participant?.state}
                onlineParticipant={onlineParticipant}
            />
            {_getWritingWorkshopComposerMainContent()}
        </View>
    )
}


const styles = StyleSheet.create({
    writingWorkshopComposerContainer: {
        borderTopColor: Colors.light.elevatedBeige,
        borderTopWidth: 1,
        padding: 16,
        gap: 16,
        justifyContent: "space-between"
    },
})