import { Colors } from "@/constants/theme";
import ExquisiteCadaverRecap from "@/features/creation/exquisiteCadaverRecap";
import WritingWorkshopHeader from "@/features/oneWritingWorkshop/writingWorkshopHeader";
import { getWritingWorkshopWithDetails } from "@/services/supabase/writingWorkshops";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WorkshopConfirmationScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const [workshop, setWorkshop] = useState<any>(null)

    useEffect(() => {
        getWritingWorkshopWithDetails(id).then(setWorkshop)
    }, [id])

    return (
        <View style={styles.container}>
            <WritingWorkshopHeader title="Atelier créé !" type="Cadavre Exquis" />
            <View style={styles.content}>
                {workshop && <ExquisiteCadaverRecap values={workshop} />}
            </View>
            <View style={styles.buttons}>
                <Pressable style={styles.secondaryButton} onPress={() => router.replace("/")}>
                    <Text style={styles.secondaryText}>Retour à l'accueil</Text>
                </Pressable>
                <Pressable style={styles.primaryButton} onPress={() => router.replace(`/workshops/${id}`)}>
                    <Text style={styles.primaryText}>Voir l'atelier</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.mainBeige,
        paddingBottom: 24,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: "center",
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 8,
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: Colors.light.chocolate,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },
    primaryText: {
        color: Colors.light.mainBeige,
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    secondaryButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.chocolate,
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
    },
    secondaryText: {
        color: Colors.light.chocolate,
        fontSize: 13,
        fontWeight: "600",
        textTransform: "uppercase",
    },
})
