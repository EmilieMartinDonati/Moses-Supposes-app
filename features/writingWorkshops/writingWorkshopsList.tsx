import { getWritingWorkshopsByVisibility } from "@/services/supabase/writingWorkshops";
import { chunkArray } from "@/utils/utils";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import WritingWorkshopsCarousel from "./WritingWorkshopsCarousel";

import { WritingWorkshopType } from "@/types/workshops";

export default function WritingWorkshopList() {
    const [liveWorkshops, setLiveWorkshops] = useState<WritingWorkshopType[]>([]);
    const [upcomingWorkshops, setUpcomingWorkshops] = useState<WritingWorkshopType[]>([]);
    const [finishedWorkshops, setFinishedWorkshops] = useState<WritingWorkshopType[]>([]);

    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        async function loadWorkshops() {
            const [currentWorkshops, toComeWorkshops, closedWorkshops] = await Promise.all([
                getWritingWorkshopsByVisibility({ onlyPublic: false, visibility: "live" }),
                getWritingWorkshopsByVisibility({ onlyPublic: false, visibility: "upcoming" }),
                getWritingWorkshopsByVisibility({ onlyPublic: false, visibility: "finished" })
            ]);
            setLiveWorkshops(currentWorkshops);
            setUpcomingWorkshops(toComeWorkshops);
            setFinishedWorkshops(closedWorkshops)
            setLoading(false);
        }

        loadWorkshops();
    }, []);


    return (
        <View style={styles.writingWorkshopsList}>
            <Text style={styles.writingWorkshopsSection}>🔥 Ateliers en cours</Text>
            <WritingWorkshopsCarousel 
              visibility={"live"}
              workshops={chunkArray(liveWorkshops, 4)}
              loading={loading}
              />
            <Text style={styles.writingWorkshopsSection}>⏳ Ateliers à venir</Text>
            <WritingWorkshopsCarousel 
              visibility={"upcoming"}
              workshops={chunkArray(upcomingWorkshops, 1)}
              loading={loading}
              />
            <Text style={styles.writingWorkshopsSection}>⏳ Ateliers fermés</Text>
            <WritingWorkshopsCarousel 
              visibility={"finished"}
              workshops={chunkArray(finishedWorkshops, 1)}
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