import { ReactNode, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Avatar from "./Avatar";

export type AvatarItem =
    | { type: "image"; uri: string, bgColor?: string }
    | { type: "text"; label: string; bgColor?: string }

export default function GroupedAvatars({
    avatarWidth = 40,
    avatars,
    max = 5,
    renderItem
}: {
    avatarWidth?: number,
    avatars: AvatarItem[],
    max?: number,
    renderItem?: (avatar: AvatarItem, index: number) => ReactNode,
}) {

    const formattedAvatars: AvatarItem[] = useMemo(() => {
        const surplus = Math.max(avatars.length - max, 0)
        const shown = avatars.slice(0, max)
        if (surplus > 0) {
            shown.push({ type: "text", label: `+${surplus}`, bgColor: "grey" })
        }
        return shown
    }, [avatars, max])

    return (
        <View style={styles.row}>
            {formattedAvatars.map((avatar, index) => renderItem ? renderItem(avatar, index) :(
                <Avatar key={index} avatarWidth={avatarWidth} item={avatar} index={index}/>
            ) )}
        </View>
    )

}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row"
    }
})
