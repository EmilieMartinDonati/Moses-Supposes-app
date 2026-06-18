import { NavigationActions } from "@/actions/navigation";
import ExpandingChip from "@/components/ExpandingChip";
import { Colors } from "@/constants/theme";
import CodeAddBanner from "@/features/codes/CodeAddBanner";
import HomeHeader from "@/features/home/HomeHeader";
import WritingWorkshopList from "@/features/writingWorkshops/WritingWorkshopsList";
import { useAppStore } from '@/store/useAppStore';
import { useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen() {

    const insets = useSafeAreaInsets();

    const [creationButtonExpanded, setCreationButtonExpanded] = useState(false)

    const onPressFAB = () => {
        NavigationActions.createWorkshop()
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (event.nativeEvent.contentOffset.y >= 200) {
            setCreationButtonExpanded(true)
        }
        else {
            setCreationButtonExpanded(false)
        }
    }

    const user = useAppStore((s) => s.user)


    return (
        <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={{flex: 1}}>
            <HomeHeader title="MOSES SUPPOSES" user={user} />
            <ScrollView
                contentContainerStyle={styles.main}
                style={{ backgroundColor: Colors.light.background }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.codeAddBannerContainer}>
                    <CodeAddBanner />
                </View>
                <View style={styles.writingWorkshopListContainer}>
                    <WritingWorkshopList />
                </View>
            </ScrollView>
            <View style={[styles.footer, {bottom: insets.bottom + 40 }]}>
                <ExpandingChip
                    initialContent="+"
                    targetContent='Créer votre propre workshop'
                    initialColor={Colors.light.honey}
                    targetColor={Colors.light.honey}
                    shouldExpand={creationButtonExpanded}
                    onClick={onPressFAB} />
            </View>
         </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    main: {
        justifyContent: "flex-start"
    },
    writingWorkshopListContainer: {
        paddingTop: 24,
        paddingBottom: 120
    },
    footer: {
        position: "absolute",
        right: 24
    }
})
