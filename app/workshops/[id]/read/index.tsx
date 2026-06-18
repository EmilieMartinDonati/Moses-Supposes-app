import { fetchContributionsByWorkshop } from "@/actions/contributions"
import { fetchWritingWorkshop } from "@/actions/writingWorkshops"
import { Colors } from "@/constants/theme"
import ContributionList from "@/features/oneWritingWorkshop/ContributionsList"
import WritingWorkshopHeader from "@/features/oneWritingWorkshop/WritingWorkshopHeader"
import { ContributionType } from "@/types/contributions"
import { WritingWorkshopType } from "@/types/workshops"
import { Feather } from '@expo/vector-icons'
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

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
                <View style={styles.firstSentenceContainer}>
                    <Text style={styles.firstSentence}>{writingWorkshop.prompt}</Text>
                </View>
                <ContributionList
                    contributions={contributions}
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
    firstSentenceContainer: {
        backgroundColor: Colors.light.mainBlue,
        padding: 32
    },
    firstSentence: {
        color: "white"
    }
});