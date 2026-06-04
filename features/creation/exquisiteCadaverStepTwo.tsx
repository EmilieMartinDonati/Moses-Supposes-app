import { Colors } from "@/constants/theme";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function ExquisiteCadaverStepTwo({
    control, visibility, errors
}: { control: any, visibility: "private" | "public", errors: any }) {

    return (
        <View style={styles.formContainer}>
            {visibility === "public" && <>
                <View style={styles.labelAndError}>
                    <Text style={styles.label}>Nombre maximal de participants</Text>
                    {errors.max_participants && <Text style={{ color: 'red' }}>{errors.max_participants.message}</Text>}
                </View>
                <Controller
                    control={control}
                    name="max_participants"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            keyboardType="number-pad"
                            value={value?.toString()}
                            onChangeText={(val) => onChange(parseInt(val) || 0)}
                        />
                    )}
                />
            </>
            }
            <View style={styles.labelAndError}>
                <Text style={styles.label}>Délai d'écriture (en secondes)</Text>
                {errors.writingDelay && <Text style={{ color: 'red' }}>{errors.writingDelay.message}</Text>}
            </View>
            <Controller
                control={control}
                name="writingDelay"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.textInput}
                        keyboardType="number-pad"
                        value={value?.toString()}
                        onChangeText={(val) => onChange(parseInt(val) || 0)}
                    />
                )}
            />
            <View style={styles.labelAndError}>
                <Text style={styles.label}>Nombre maximal de phrases par participants (recommandé : 2)</Text>
                {errors.max_sentences && <Text style={{ color: 'red' }}>{errors.max_sentences.message}</Text>}
            </View>
            <Controller
                control={control}
                name="max_sentences"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={styles.textInput}
                        keyboardType="number-pad"
                        value={value?.toString()}
                        onChangeText={(val) => onChange(parseInt(val) || 0)}
                    />
                )}
            />
            {visibility === "private" && <>
                <View style={styles.labelAndError}>
                    <Text style={styles.label}>Nombre de tours par participant</Text>
                    {errors.iterations_count && <Text style={{ color: 'red' }}>{errors.iterations_count.message}</Text>}
                </View>
                <Controller
                    control={control}
                    name="iterations_count"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.textInput}
                            keyboardType="number-pad"
                            value={value?.toString()}
                            onChangeText={(val) => onChange(parseInt(val) || 0)}
                        />
                    )}
                />
            </>}
        </View>
    )
}


const styles = StyleSheet.create({
    labelAndError: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    formContainer: {
        display: "flex",
        justifyContent: "center",
        gap: 16
    },
    textInput: {
        backgroundColor: Colors.light.faintWarmWhite,
        color: Colors.light.chocolate,
        padding: 8,
        borderRadius: 4,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 0.5
    },
    label: {
        fontWeight: "bold",
        color: Colors.light.chocolate
    }
})