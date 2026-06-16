import { Colors } from "@/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";
import { AvatarItem } from "./GroupedAvatars";

export default function Avatar({
    item, avatarWidth, index = 0
}: { item: AvatarItem, avatarWidth: number, index?: number }) {

    const circle = {
        width: avatarWidth,
        height: avatarWidth,
        borderRadius: avatarWidth / 2,
        marginLeft: index !== 0 ? -(avatarWidth / 4) : 0,
        borderWidth: 2,
        borderColor: Colors.light.elevatedBeige,
    }

    if (item.type === "image") {
        return <Image key={index} source={{ uri: item.uri }} style={[circle, {backgroundColor: "white"}]} />
    }

    return (
        <View
            key={index}
            style={[
                circle,
                styles.center,
                { backgroundColor: item.bgColor || Colors.light.chocolate },
            ]}>
            <Text style={styles.label}>{item.label}</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center"
    },
    label: {
        color: "white",
        fontWeight: "600"
    }
})