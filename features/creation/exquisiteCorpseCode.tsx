import { Colors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export default function ExquisiteCorpseCode({ code }: { code: string }) {

    return (
        <View style={styles.codeBannerContainer}>
            <Text style={styles.code}>{code}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    codeBannerContainer: {
        backgroundColor: Colors.light.waterGreen,
        alignItems: "center",
        justifyContent: "center",
        height: 50
    },
    code: {
        textTransform: "uppercase",
        color: Colors.light.chocolate,
        fontSize: 16,
        fontWeight: "600"
    }
})