import { fetchContributionsByWorkshop } from "@/actions/contributions"
import { fetchWritingWorkshop } from "@/actions/writingWorkshops"
import { ContributionType } from "@/types/contributions"
import { WritingWorkshopType } from "@/types/workshops"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import ContributionList from "./ContributionsList"
import WritingWorkshopHeader from "./WritingWorkshopHeader"
import { View } from "react-native"
import { Colors } from "@/constants/theme"
import { Feather } from '@expo/vector-icons';

export default function WritingWorkshopConsultation() {

    const { id } = useLocalSearchParams<{ id: string }>()
    const writingWorkshopId = id

    const [contributions, setContributions] = useState<ContributionType[] | []>([])
    const [writingWorkshop, setWritingWorkshop] = useState<WritingWorkshopType | null>(null)

    const fetchContributions = async () => {
        const retrievedContributions = await fetchContributionsByWorkshop({ workshopId: writingWorkshopId })
        setContributions(retrievedContributions)
    }

    const fetchWorkshop = async () => {
        const retrievedWorkshop = await fetchWritingWorkshop({ workshopId: writingWorkshopId })
        setWritingWorkshop(retrievedWorkshop)
    }

    useEffect(() => {
        if (!writingWorkshopId) {
            return
        }
        fetchContributions()
        fetchWorkshop()
    }, [writingWorkshopId])

    if (!writingWorkshop || !contributions.length) {
        return null
    }

    const renderRightAction = () => {
        return (
            <View style={styles.rightActions}>
                <Feather name="download" size={24} color={Colors.light.chocolate} />
                <Feather name="mail" size={24} color={Colors.light.forestGreen} />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.writingWorkshopEditorContainer}>
            <WritingWorkshopHeader
                title={writingWorkshop.title}
                type={"Cadavre Exquis"}
                renderRightAction={renderRightAction}
            />
            <ScrollView>
                <ContributionList
                    contributions={[...contributions, ...contributions, ...contributions, ...contributions, ...contributions]}
                />
            </ScrollView>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    writingWorkshopEditorContainer: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: "white"
    },
    rightActions: {
        flexDirection: "row",
        gap: 16
    },
    rightActionText: {
        color: Colors.light.chocolate
    }
});