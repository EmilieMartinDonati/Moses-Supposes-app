import { Colors, Fonts } from "@/constants/theme";
import { Controller } from "react-hook-form";
import {
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

// ─── Number Stepper ──────────────────────────────────────────────────────────

function NumberStepper({
    value,
    onChange,
    min = 1,
    max = 999,
}: {
    value: number;
    onChange: (v: number) => void;
    min?: number;
    max?: number;
}) {
    const decrement = () => onChange(Math.max(min, value - 1));
    const increment = () => onChange(Math.min(max, value + 1));

    return (
        <View style={stepperStyles.container}>
            <Pressable
                onPress={decrement}
                disabled={value <= min}
                style={({ pressed }) => [
                    stepperStyles.button,
                    value <= min && stepperStyles.buttonDisabled,
                    pressed && stepperStyles.buttonPressed,
                ]}
                accessibilityLabel="Diminuer"
            >
                <Text style={[stepperStyles.buttonText, value <= min && stepperStyles.buttonTextDisabled]}>−</Text>
            </Pressable>

            <Text style={stepperStyles.value}>{value}</Text>

            <Pressable
                onPress={increment}
                disabled={value >= max}
                style={({ pressed }) => [
                    stepperStyles.button,
                    value >= max && stepperStyles.buttonDisabled,
                    pressed && stepperStyles.buttonPressed,
                ]}
                accessibilityLabel="Augmenter"
            >
                <Text style={[stepperStyles.buttonText, value >= max && stepperStyles.buttonTextDisabled]}>+</Text>
            </Pressable>
        </View>
    );
}

const stepperStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.elevatedBeige,
        alignSelf: "flex-start",
        overflow: "hidden",
    },
    button: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.light.faintWarmWhite,
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    buttonPressed: {
        backgroundColor: Colors.light.elevatedBeige,
    },
    buttonText: {
        fontSize: 20,
        color: Colors.light.chocolate,
        lineHeight: 24,
    },
    buttonTextDisabled: {
        color: Colors.light.chocolate,
    },
    value: {
        minWidth: 48,
        textAlign: "center",
        fontSize: 17,
        fontWeight: "600",
        color: Colors.light.chocolate,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
});

// ─── Conditional Block ───────────────────────────────────────────────────────

function ConditionalBlock({
    label,
    accentColor,
    children,
}: {
    label?: string;
    accentColor: string;
    children: React.ReactNode;
}) {
    return (
        <View style={[blockStyles.container, { borderLeftColor: accentColor }]}>
            {label && <Text style={[blockStyles.badge, { color: accentColor }]}>{label}</Text>}
            {children}
        </View>
    );
}

const blockStyles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderWidth: 1,
        borderColor: Colors.light.elevatedBeige,
        padding: 16,
        gap: 12,
    },
    badge: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        opacity: 0.7,
    },
});

// ─── Step Two ────────────────────────────────────────────────────────────────

export default function ExquisiteCadaverStepTwo({
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
                <Text style={styles.label}>Délai d'écriture</Text>
                <Text style={styles.hint}>En secondes, par tour d'écriture</Text>
                <Controller
                    control={control}
                    name="writingDelay"
                    render={({ field: { onChange, value } }) => (
                        <NumberStepper
                            value={value || 60}
                            onChange={onChange}
                            min={10}
                            max={3600}
                        />
                    )}
                />
                {errors.writingDelay && (
                    <Text style={styles.errorText}>{errors.writingDelay.message}</Text>
                )}
            </View>

            {/* Max sentences */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Phrases max par participant</Text>
                <Text style={styles.hint}>Recommandé : 2</Text>
                <Controller
                    control={control}
                    name="max_sentences"
                    render={({ field: { onChange, value } }) => (
                        <NumberStepper
                            value={value || 2}
                            onChange={onChange}
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
                <ConditionalBlock accentColor={Colors.light.mainBlue}>
                    <Text style={styles.label}>Nombre maximal de participants</Text>
                    <Controller
                        control={control}
                        name="max_participants"
                        render={({ field: { onChange, value } }) => (
                            <NumberStepper
                                value={value || 10}
                                onChange={onChange}
                                min={2}
                                max={100}
                            />
                        )}
                    />
                    {errors.max_participants && (
                        <Text style={styles.errorText}>{errors.max_participants.message}</Text>
                    )}
                </ConditionalBlock>
            )}

            {/* Private: iterations per participant */}
            {visibility === "private" && (
                <ConditionalBlock accentColor={Colors.light.honey}>
                    <Text style={styles.label}>Nombre de tours par participant</Text>
                    <Controller
                        control={control}
                        name="iterations_count"
                        render={({ field: { onChange, value } }) => (
                            <NumberStepper
                                value={value || 3}
                                onChange={onChange}
                                min={1}
                                max={50}
                            />
                        )}
                    />
                    {errors.iterations_count && (
                        <Text style={styles.errorText}>{errors.iterations_count.message}</Text>
                    )}
                </ConditionalBlock>
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
        opacity: 0.4,
        marginTop: -4,
    },
    errorText: {
        fontSize: 12,
        color: "#b33a3a",
    },
});
