import { Colors, Fonts } from "@/constants/theme";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import ExquisiteCadaverRecap from './exquisiteCadaverRecap';

// ─── Date Picker Field ────────────────────────────────────────────────────────

function DatePickerField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: Date | undefined;
    onChange: (date: Date) => void;
}) {
    const [showPicker, setShowPicker] = useState(false);

    const formatted = value
        ? value.toLocaleString("fr-FR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    return (
        <View style={pickerStyles.fieldGroup}>
            <Text style={pickerStyles.label}>{label}</Text>

            <Pressable
                onPress={() => setShowPicker(!showPicker)}
                style={({ pressed }) => [
                    pickerStyles.trigger,
                    pressed && pickerStyles.triggerPressed,
                ]}
                accessibilityRole="button"
            >
                <Text style={[pickerStyles.triggerText, !formatted && pickerStyles.placeholder]}>
                    {formatted ?? "Choisir une date"}
                </Text>
                <Text style={pickerStyles.icon}>📅</Text>
            </Pressable>

            {showPicker && (
                Platform.OS === "web" ? (
                    <input
                        type="datetime-local"
                        style={{ marginTop: 8, padding: 8, borderRadius: 8, border: `1px solid ${Colors.light.elevatedBeige}`, fontFamily: "inherit", fontSize: 14 }}
                        onChange={(e) => {
                            onChange(new Date(e.target.value));
                            setShowPicker(false);
                        }}
                    />
                ) : (
                    <DateTimePicker
                        value={value ?? new Date()}
                        mode="datetime"
                        display="spinner"
                        onChange={(_, date) => {
                            setShowPicker(false);
                            if (date) onChange(date);
                        }}
                    />
                )
            )}
        </View>
    );
}

const pickerStyles = StyleSheet.create({
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
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.elevatedBeige,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    triggerPressed: {
        backgroundColor: Colors.light.elevatedBeige,
    },
    triggerText: {
        fontSize: 15,
        color: Colors.light.chocolate,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
    placeholder: {
        opacity: 0.4,
    },
    icon: {
        fontSize: 16,
    },
});

// ─── Step Three ───────────────────────────────────────────────────────────────

export default function ExquisiteCadaverStepThree({
    control,
    visibility,
    values,
}: {
    control: any;
    visibility: "private" | "public";
    errors: any;
    values: any;
}) {
    if (visibility === "private") {
        return <ExquisiteCadaverRecap values={values} />;
    }

    return (
        <View style={styles.formContainer}>
            <Text style={styles.sectionHint}>
                Définissez la fenêtre de participation pour cet atelier public.
            </Text>

            <Controller
                control={control}
                name="start_time"
                render={({ field: { value, onChange } }) => (
                    <DatePickerField
                        label="Date de début"
                        value={value}
                        onChange={onChange}
                    />
                )}
            />

            <Controller
                control={control}
                name="end_time"
                render={({ field: { value, onChange } }) => (
                    <DatePickerField
                        label="Date de fin"
                        value={value}
                        onChange={onChange}
                    />
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        gap: 24,
    },
    sectionHint: {
        fontSize: 13,
        color: Colors.light.chocolate,
        opacity: 0.5,
        lineHeight: 20,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
    },
});
