
import { FlatList, StyleSheet, View } from "react-native";
import WritingWorkshopCard from "./WritingWorkshopCard";

type Visibility = "live" | "upcoming";

type WritingWorkshop = {
  id: number;
  title: string;
  prompt: string;
  participantsCount?: number;
  start_time: string;
  end_time: string;
};

type WritingWorkshopsCarouselProps = {
  visibility: Visibility,
  workshops: WritingWorkshop[][],
  loading: boolean
}

export default function WritingWorkshopsCarousel({ visibility, workshops, loading }: WritingWorkshopsCarouselProps) {

  return (
    <FlatList<WritingWorkshop[]>
      ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={308}
      decelerationRate="fast"
      data={workshops}
      renderItem={({ item, index }) =>
        <View key={index} style={styles.cardsStack}>
          {item.map((workshop) => (
            <WritingWorkshopCard
              key={workshop.id}
               id={workshop.id}
              writingWorkshopId={workshop.id}
              title={workshop.title}
              prompt={workshop.prompt}
              participantsCount={workshop.participantsCount || 0}
              startTime={workshop.start_time}
              endTime={workshop.end_time}
              visibility={visibility}
              loading={loading}
            />))}
        </View>}
    />
  )
}

const styles = StyleSheet.create({
  cardsStack: {
    display: "flex",
    flexDirection: "column",
    gap: 16
  }
})