import FormLabel from "@/components/forms/FormLabel";
import NumberStepper from "@/components/NumberStepper";
import { Colors } from "@/constants/theme";
import { Controller } from "react-hook-form";
import {
    StyleSheet,
    Text,
    View
} from "react-native";


// ─── Step Two ────────────────────────────────────────────────────────────────

export default function ExquisiteCorpseStepTwo({
    control,
    visibility,
    errors,
}: {
    control: any;
    visibility: "private" | "public";
    errors: any;
}) {
    return (
        <View style={styles.formContainer}>

            {/* Writing delay */}
            <View style={styles.fieldGroup}>
                <View>
                    <FormLabel label="Délai d'écriture" variant="green" />
                    <Text style={styles.hint}>En secondes, par tour d'écriture</Text>
                </View>
                <Controller
                    control={control}
                    name="writingDelay"
                    render={({ field: { onChange, value } }) => (
                        <NumberStepper
                            value={value || 60}
                            handleChange={onChange}
                            min={10}
                            max={3600}
                            step={30}
                        />
                    )}
                />
                {errors.writingDelay && (
                    <Text style={styles.errorText}>{errors.writingDelay.message}</Text>
                )}
            </View>

            {/* Max sentences */}
            <View style={styles.fieldGroup}>
                <View>
                    <FormLabel label="Phrases max par participant" variant="green" />
                    <Text style={styles.hint}>Recommandé : 2</Text>
                </View>
                <Controller
                    control={control}
                    name="max_sentences"
                    render={({ field: { onChange, value } }) => (
                        <NumberStepper
                            value={value || 2}
                            handleChange={onChange}
                            min={1}
                            max={20}
                        />
                    )}
                />
                {errors.max_sentences && (
                    <Text style={styles.errorText}>{errors.max_sentences.message}</Text>
                )}
            </View>

            {/* Public: max participants */}
            {visibility === "public" && (
                <>
                    <FormLabel label="Nombre maximal de participants" variant="green" />
                    <Controller
                        control={control}
                        name="max_participants"
                        render={({ field: { onChange, value } }) => (
                            <NumberStepper
                                value={value || 100}
                                handleChange={onChange}
                                min={2}
                                max={500}
                            />
                        )}
                    />
                    {errors.max_participants && (
                        <Text style={styles.errorText}>{errors.max_participants.message}</Text>
                    )}
                </>
            )}

            {/* Private: iterations per participant */}
            {visibility === "private" && (
                <>
                    <FormLabel label="Nombre de tours par participant" variant="green" />
                    <Controller
                        control={control}
                        name="iterations_count"
                        render={({ field: { onChange, value } }) => (
                            <NumberStepper
                                value={value || 3}
                                handleChange={onChange}
                                min={1}
                                max={50}
                            />
                        )}
                    />
                    {errors.iterations_count && (
                        <Text style={styles.errorText}>{errors.iterations_count.message}</Text>
                    )}
                </>
            )}
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    formContainer: {
        gap: 24,
    },
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: Colors.light.chocolate,
        opacity: 0.6,
    },
    hint: {
        fontSize: 12,
        color: Colors.light.chocolate,
        opacity: 0.6
    },
    errorText: {
        fontSize: 12,
        color: "#b33a3a",
    },
});
