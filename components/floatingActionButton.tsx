import { StyleSheet, TouchableOpacity } from "react-native";

import AntDesign from '@expo/vector-icons/AntDesign';

// WIP use variants from theme

const variantConfig: any = {
    add: { background: '#e6b566', iconColor: '#faf7f4', iconName: 'plus' },
    delete: { background: '#c45c5c', iconColor: '#faf7f4', iconName: 'delete' },
    share: { background: '#4a6e85', iconColor: '#faf7f4', iconName: 'share-alt' },
    seeDetails: { background: '#8a6a4a', iconColor: '#faf7f4', iconName: 'eye' },
};

export default function FloatingActionButton({ onPress, variant = "add", style = {}}: {
    onPress: () => void,
    variant: "add" | "remove" | "watch" | "share",
    style?: {}
}) {

    const { background, iconColor, iconName } = variantConfig[variant]

    return (
        <TouchableOpacity onPress={onPress} style={[style, styles.fab, { backgroundColor: background }]}>
            <AntDesign
                name={iconName}
                size={24}
                color={iconColor} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        bottom: 24,
        right: 24,
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    }
})