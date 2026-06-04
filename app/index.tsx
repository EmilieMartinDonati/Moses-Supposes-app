import { NavigationActions } from "@/actions/navigation"
import FloatingActionButton from "@/components/ui/floatingActionButton"
import { Colors } from "@/constants/theme"
import CodeAddBanner from "@/features/codes/CodeAddBanner"
import HomeHeader from "@/features/home/homeHeader"
import WritingWorkshopList from "@/features/writingWorkshops/writingWorkshopsList"
import { ScrollView, StyleSheet, View } from "react-native"

export default function HomeScreen() {

    const onPressFAB = () => {
        NavigationActions.createWorkshop()
    }

    return (
        // <SafeAreaView>
        <>
            <ScrollView
                contentContainerStyle={styles.main}
                style={{ backgroundColor: Colors.light.background }}>
                <HomeHeader title="MOSES SUPPOSES" logo="" actions={[]} />
                <View style={styles.codeAddBannerContainer}>
                    <CodeAddBanner />
                </View>
                <View style={styles.writingWorkshopListContainer}>
                    <WritingWorkshopList />
                </View>
            </ScrollView>
            <FloatingActionButton variant="add" onPress={onPressFAB} />
            </>
        // </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: "flex-start"
    },
    codeAddBannerContainer: {
    },
    writingWorkshopListContainer: {
        paddingTop: 24
    }
})
