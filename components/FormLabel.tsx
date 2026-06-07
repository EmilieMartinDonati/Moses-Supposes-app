import { StyleSheet, Text, View } from "react-native"

export default function FormLabel ({
 label,
 variant = "neutral",
 align = "center"
}:{
    label: string
    variant?: "neutral" | "blue" | "green" | "pink" | "dark" | "honey",
    align?: "left" | "center" | "right"
}) {

    return (
        <View style={styles.container}>
         <Text style={[styles.text, { textAlign: align }]}>
            {label}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    text: {
        textTransform: "capitalize"
    }
})