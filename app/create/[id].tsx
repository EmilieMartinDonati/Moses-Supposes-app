import DualActionsFooter from "@/components/DualActionsFooter";
import { Colors } from "@/constants/theme";
import ExquisiteCorpseRecap from "@/features/creation/ExquisiteCorpseRecap";
import WritingWorkshopHeader from "@/features/oneWritingWorkshop/WritingWorkshopHeader";
import { getWritingWorkshopWithDetails } from "@/services/supabase/writingWorkshops";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

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
                {workshop && <ExquisiteCorpseRecap values={workshop} />}
            </View>
            <DualActionsFooter leftAction={{
                label: "Revenir à l'accueil",
                onPress: () => router.replace("/")
            }}
            rightAction={{
                label: "Rejoindre",
                onPress: () => console.log("todo")
            }} />
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
