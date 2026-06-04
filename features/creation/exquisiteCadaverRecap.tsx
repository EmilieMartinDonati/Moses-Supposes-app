import { Text, View } from "react-native"

export default function ExquisiteCadaverRecap({
    values
}: { values: any }) {

    return (
        <View>
            <Text>Récapitulatif</Text>
            <Text>Titre: {values.title}</Text>
            <Text>Prompt: {values.prompt}</Text>
            <Text>Délai d'écriture: {values.writingDelay}</Text>
            <Text>Nombre de phrases maximum par participants: {values.max_sentences}</Text>
            {values.visibility === "public" && (
                <>
                    <Text>Max participants: {values.max_participants}</Text>
                    <Text>Start time: {values.start_time?.toString()}</Text>
                    <Text>End time: {values.end_time?.toString()}</Text>
                </>
            )}
            {values.visibility === "private" && (
                <Text>Nombre de tour par participants: {values.iterations_count}</Text>
            )}
        </View>
    )
}           