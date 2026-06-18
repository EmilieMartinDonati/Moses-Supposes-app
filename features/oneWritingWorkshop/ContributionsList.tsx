import Avatar from "@/components/Avatar";
import { Colors } from "@/constants/theme";
import { ContributionType } from "@/types/contributions";
import { StyleSheet, Text, View } from "react-native";
import { formatAvatar } from "./formatAvatar";

export default function ContributionList({
    contributions = []
}: {
    contributions: ContributionType[] | []
}) {

    return (
        <View style={styles.contributionsConsultationContainer}>
            {contributions.map((contribution) => (
                <View key={contribution.id} style={styles.avatarAndContribution}>
                    <Avatar
                        item={formatAvatar(contribution)}
                        avatarWidth={25} />
                    <View style={styles.dividerAndContribution}>
                        <View style={styles.divider} />
                        <View style={styles.contributionContentContainer}>
                            <Text style={styles.contentText}>{contribution.content}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    contributionsConsultationContainer: {
        flex: 1,
        paddingBottom: 48,
        paddingTop: 16,
        paddingHorizontal: 32,
        backgroundColor: Colors.light.faintWarmWhite
    },
    avatarAndContribution: {
        gap: 6,
        alignItems: "flex-start",
        justifyContent: "center",
        paddingVertical: 8
    },
    contributionContentContainer: {
        backgroundColor: Colors.light.mainBeige,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 0.5,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        minHeight: 30,
        minWidth: "60%",
        paddingHorizontal: 32,
        paddingVertical: 8,
        justifyContent: "center",
        flexShrink: 1
    },
    contentText: {
        fontSize: 14,
        lineHeight: 20,
        color: Colors.light.chocolate
    },
    dividerAndContribution: {
        flexDirection: "row",
        gap: 8,
        paddingLeft: 8
    },
    divider: {
        width: 3,
        backgroundColor: Colors.light.honey,
        opacity: 0.6
    }
})