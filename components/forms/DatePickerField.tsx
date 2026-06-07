import { Colors } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

// WIP

export default function DatePickerField({
    value,
    handleChange,
    gap = 8,
    renderLabelAndInstructions,
}: {
    value: Date | undefined;
    handleChange: (v: Date) => void,
    gap?: number,
    renderLabelAndInstructions?: () => React.ReactNode,
}) {

    const [showPicker, setShowPicker] = useState(false)

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
        <View style={{ gap: gap }}>
            {renderLabelAndInstructions?.()}
            <Pressable
                onPress={() => setShowPicker(!showPicker)}
                style={({ pressed }) => [
                    styles.trigger,
                    pressed && styles.triggerPressed,
                ]}
                accessibilityRole="button"
            >
                <Text style={[styles.triggerText, !formatted && styles.placeholder]}>
                    {formatted ?? "Choisir une date"}
                </Text>
                <Text style={styles.icon}>📅</Text>
            </Pressable>

            {showPicker && (
                Platform.OS === "web" ? (
                    <input
                        type="datetime-local"
                        style={{ marginTop: 8, padding: 8, borderRadius: 8, border: `1px solid ${Colors.light.elevatedBeige}`, fontFamily: "inherit", fontSize: 14 }}
                        onChange={(e) => {
                            handleChange(new Date(e.target.value));
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
                            if (date) handleChange(date);
                        }}
                    />
                )
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    trigger: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.light.elevatedBeige,
        paddingHorizontal: 14,
        paddingVertical: 12
    },
    triggerPressed: {
        backgroundColor: Colors.light.elevatedBeige,
    },
    triggerText: {
        fontSize: 15,
        color: Colors.light.chocolate,
    },
    placeholder: {
        opacity: 0.4,
    },
    icon: {
        fontSize: 16
    }
})