import { OnlineParticipant } from "@/types/workshops"
import { AvatarItem } from "@/components/GroupedAvatars"
import { ContributionType } from "@/types/contributions"

export const formatAvatar = (participant?: OnlineParticipant | ContributionType): AvatarItem => {
    if (participant?.display_name) {
        const label = participant.display_name
            .split(" ")
            .map((n: string) => n.substring(0, 1).toUpperCase())
            .join("")
        return { type: "text", label }
    }
    if (participant?.avatar_seed) {
        return {
            type: "image",
            uri: `https://api.dicebear.com/10.x/notionists/png?seed=${encodeURIComponent(participant.avatar_seed)}`,
        }
    }
    return { type: "text", label: "?" }
}
