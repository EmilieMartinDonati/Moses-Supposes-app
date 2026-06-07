import { Colors } from "@/constants/theme"
import { StyleSheet, Text, View } from "react-native"

// WIP (variants should be in theme)

const variants = {
    "neutral": {
        "text": {
            color: Colors.light.chocolate,
            opacity: 0.7
        },
        "divider": {
            backgroundColor: Colors.light.chocolate
        }
    },
    "green": {
        "text": {
            color: Colors.light.forestGreen,
            opacity: 0.9
        },
        "divider": {
            backgroundColor: Colors.light.mediumGreen
        }
    },
    "blue": {
        "text": {
            color: Colors.light.mainBlue
        },
        "divider": {
            backgroundColor: Colors.light.mainBlue
        }
    }
} as const

export type ColorVariant = keyof typeof variants

const alignMap = {
    "start": "flex-start",
    "end": "flex-end",
    "center": "center"
} as const
export type AlignVariant = keyof typeof alignMap


export default function FormLabel({
    label,
    variant = "neutral",
    textAlign = "center",
    align = "center"
}: {
    label: string
    variant?: ColorVariant,
    textAlign?: "left" | "center" | "right",
    align? : AlignVariant
}) {

    return (
        <View style={[styles.container, { justifyContent: alignMap[align], alignSelf: alignMap[align]}]}>
            <View style={[styles.divider, variants[variant].divider]}></View>
            <Text style={[styles.text, variants[variant].text, { textAlign: textAlign}]}>
                {"  "}{label}{"  "}
            </Text>
            <View style={[styles.divider, variants[variant].divider]}></View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        maxWidth: 256
    },
    divider: {
        height: 0.5,
        width: 56,
        opacity: 0.8,
    },
    text: {
        textTransform: "uppercase",
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8
    }
})