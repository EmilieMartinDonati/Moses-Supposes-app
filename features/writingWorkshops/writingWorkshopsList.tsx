import { getWritingWorkshopsByVisibility } from "@/services/supabase/writingWorkshops";
import { chunkArray } from "@/utils/utils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WritingWorkshopsCarousel from "./WritingWorkshopsCarousel";

type WritingWorkshop = {
    id: number;
    title: string;
    prompt: string;
    start_time: string;
    end_time: string;
    status: "draft" | "published";
};

export default function WritingWorkshopList() {
    const [liveWorkshops, setLiveWorkshops] = useState<WritingWorkshop[]>([]);
    const [upcomingWorkshops, setUpcomingWorkshops] = useState<WritingWorkshop[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        async function loadWorkshops() {
            const [currentWorkshops, toComeWorkshops] = await Promise.all([
                getWritingWorkshopsByVisibility({ onlyPublic: false, visibility: "live" }),
                getWritingWorkshopsByVisibility({ onlyPublic: false, visibility: "upcoming" })
            ]);
            setLiveWorkshops(currentWorkshops);
            setUpcomingWorkshops(toComeWorkshops);
            setLoading(false);
        }

        loadWorkshops();
    }, []);


    return (
        <View style={styles.writingWorkshopsList}>
            <Text style={styles.writingWorkshopsSection}>🔥 Ateliers en cours</Text>
            <WritingWorkshopsCarousel 
              visibility={"live"}
              workshops={chunkArray(liveWorkshops, 1)}
              loading={loading}
              />
            <Text style={styles.writingWorkshopsSection}>⏳ Ateliers à venir</Text>
            <WritingWorkshopsCarousel 
              visibility={"upcoming"}
              workshops={chunkArray(upcomingWorkshops, 1)}
              loading={loading}
              />
        </View>
    )
}

const styles = StyleSheet.create({
    writingWorkshopsList: {
        display: "flex",
        flexDirection: "column",
        gap: 32,
        paddingHorizontal: 8
    },
    writingWorkshopsSection: {
        fontSize: 16,
        fontWeight: "600"
    }
})