import { generateContributionDisplayNameAndAvatarSeed } from "@/actions/contributions"
import { supabase } from "@/services/supabase/client"
import { useAppStore } from "@/store/useAppStore"
import { OnlineParticipant } from "@/types/workshops"
import { useEffect } from "react"

export type ChannelPresenceState = { [key: string]: Array<OnlineParticipant> }

export default function useWorkshopPresenceChannel({
    workshopId,
    participantId,
    guestId,
    onSyncChange
}: {
    workshopId: string,
    participantId: string | null,
    guestId: string,
    onSyncChange: (newPresenceState: ChannelPresenceState) => void
}) {
    useEffect(() => {
        if (!workshopId || !participantId) {
            return
        }
        const state = useAppStore.getState()
        const { user, profile } = state
        const channel = supabase.channel(`workshop:${workshopId}`)

        channel.on("presence", { event: "sync" }, () => {
            onSyncChange && onSyncChange(channel.presenceState())
        })
        channel.subscribe(async (status: string) => {
            const { displayName, avatarSeed } = await generateContributionDisplayNameAndAvatarSeed({
                user, profile, guestId
            })
            if (status === "SUBSCRIBED") {
                await channel.track({
                    participant_id: participantId,
                    joined_at: Date.now(),
                    display_name: displayName,
                    avatar_seed: avatarSeed
                })
            }
        })
        return () => {
            supabase.removeChannel(channel)
        }

    }, [workshopId, participantId])

}