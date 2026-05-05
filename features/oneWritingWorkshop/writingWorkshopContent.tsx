import { Colors } from "@/constants/theme"
import { SegmentType } from "@/types/segments"
import { useRef } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"

export default function WritingWorkshopContent({
    contributions = []
}: {
    contributions: SegmentType[]
}) {
    const lastContribution = contributions.at(-1)
    const contributionsCount = contributions.length || 10

    const scrollViewRef = useRef<ScrollView>(null)

    return (
        <ScrollView
            style={styles.writingWorkshopContentContainer}
            contentContainerStyle={styles.contentInner}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}>
            <View style={styles.hiddenContributionsContainer}>
                {[1, 2, 3, 4].map((__, index) => {
                    return (
                        <View key={index}
                            style={[
                                styles.hiddenContributionsOpacifier,
                                { width: 200 + index * 20 }
                            ]}></View>
                    )

                })}
            </View>
            <Text style={styles.contributionsCountText}>{contributionsCount} contributions cachées - attendez la fin pour les lire!</Text>
            <View style={styles.lastContributionContainer}>
                <Text style={styles.lastContributionText}>{lastContribution?.text || "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit"}</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    writingWorkshopContentContainer: {
        borderTopColor: Colors.light.elevatedBeige,
        borderTopWidth: 1
    },
    contentInner: {
        padding: 16,
        gap: 8
    },
    hiddenContributionsContainer: {
        flex: 1,
        gap: 10
    },
    hiddenContributionsOpacifier: {
        backgroundColor: Colors.light.elevatedBeige,
        height: 40,
        borderRadius: 10
    },
    contributionsCountText: {
        color: Colors.light.mainBlue
    },
    lastContributionContainer: {
        marginLeft: 15,
        borderLeftColor: Colors.light.honey,
        borderLeftWidth: 4,
        marginTop: 10,
        paddingHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    lastContributionText: {
        color: Colors.light.chocolate,
        fontSize: 14,
        fontWeight: 500
    }
})