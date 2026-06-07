
import { Colors } from "@/constants/theme"
import { Pressable, StyleSheet, Text, View } from "react-native"

const variants = {
    "neutral": {
        "container": {
            backgroundColor: Colors.light.faintWarmWhite,
            borderColor: Colors.light.elevatedBeige
        },
        "button": {
            backgroundColor: Colors.light.mainBeige
        },
        "buttonPressed": {
            backgroundColor: Colors.light.elevatedBeige,
        },
        "text": {
            color: Colors.light.chocolate,
        }
    }
} as const

type ColorVariant = keyof typeof variants


export default function NumberStepper({
    handleChange,
    min,
    max,
    value,
    sizeVariant = "medium",
    colorVariant = "neutral"
}: {
    handleChange: (v: number) => void,
    min: number,
    max: number,
    value: number,
    sizeVariant?: "small" | "medium" | "large",
    colorVariant?: ColorVariant
}) {

const increment = () => handleChange(Math.min(max, value + 1))
const decrement = () => handleChange(Math.max(min, value - 1))

    return (
        <View style={[styles.container, variants[colorVariant].container]}>
            <Pressable
                accessibilityLabel="Diminuer"
                style={({ pressed }) => [
                    styles.button,
                    variants[colorVariant].button,
                    value === min && styles.buttonDisabled,
                    pressed && variants[colorVariant].buttonPressed,

                ]}
                onPress={decrement}>
                <Text style={
                    [styles.buttonText, variants[colorVariant].text]}>-</Text>
            </Pressable>
            <Text style={[
                styles.value,
                variants[colorVariant].text
            ]}>{value}</Text>
            <Pressable
                accessibilityLabel="Diminuer"
                style={({ pressed }) => [
                    styles.button,
                    variants[colorVariant].button,
                    value === max && styles.buttonDisabled,
                    pressed && variants[colorVariant].buttonPressed,

                ]}
                onPress={increment}>
                <Text style={[
                    styles.buttonText, variants[colorVariant].text
                ]}>+</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        borderWidth: 1,
        overflow: "hidden",
        alignSelf: "center",
        paddingLeft: 48,
        paddingRight: 48,
        gap: 8
    },
    button: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 10
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontSize: 20,
        lineHeight: 24,
    },
    value: {
        minWidth: 48,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "600"
    }
})

