import { Colors } from "@/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export const EMAIL_OPTIN_STORAGE_KEY = "emailOptin";

export default function EmailOptinField() {

    const [emailOptin, setEmailOptin] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(EMAIL_OPTIN_STORAGE_KEY).then((stored) => {
            if (stored !== null) {
                setEmailOptin(JSON.parse(stored));
            }
        });
    }, []);

    const toggle = async () => {
        const next = !emailOptin;
        setEmailOptin(next);
        await AsyncStorage.setItem(EMAIL_OPTIN_STORAGE_KEY, JSON.stringify(next));
    };

    return (
        <View style={styles.optinFieldGroup}>
            <Pressable style={styles.checkBox} onPress={toggle}>
                <View style={[styles.checkBoxInner, emailOptin && styles.checkBoxInnerFilled]}></View>
            </Pressable>
            <Text style={styles.optinText}>J'accepte de recevoir par mail des annonces sur les concours littéraires à venir</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    optinFieldGroup: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center"
    },
    checkBox: {
        borderColor: Colors.light.chocolate,
        borderWidth: 2,
        borderRadius: 25,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    checkBoxInner: {
        width: 20,
        height: 20,
        borderRadius: 10
    },
    checkBoxInnerFilled: {
        backgroundColor: Colors.light.chocolate
    },
    optinText: {
        textAlign: "justify",
        fontSize: 12
    }
});
