import { Colors, Fonts } from "@/constants/theme";
import { useRef } from "react";
import { Controller } from "react-hook-form";
import {
    Animated,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

// ─── Visibility Toggle ───────────────────────────────────────────────────────

function VisibilityToggle({
    value,
    onChange,
}: {
    value: "private" | "public";
    onChange: (v: "private" | "public") => void;
}) {
    const isPublic = value === "public";
    const anim = useRef(new Animated.Value(isPublic ? 1 : 0)).current;

    const toggle = () => {
        const next = !isPublic;
        Animated.timing(anim, {
            toValue: next ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
        onChange(next ? "public" : "private");
    };

    const trackColor = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.light.honey, Colors.light.mainBlue],
    });

    const thumbLeft = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [3, 27],
    });

    return (
        <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, !isPublic && styles.toggleLabelActive]}>
                🔒 Privé
            </Text>

            <Pressable onPress={toggle} accessibilityRole="switch" accessibilityState={{ checked: isPublic }}>
                <Animated.View style={[styles.toggleTrack, { backgroundColor: trackColor }]}>
                    <Animated.View style={[styles.toggleThumb, { left: thumbLeft }]} />
                </Animated.View>
            </Pressable>

            <Text style={[styles.toggleLabel, isPublic && styles.toggleLabelActive]}>
                🌐 Public
            </Text>
        </View>
    );
}

// ─── Step One ────────────────────────────────────────────────────────────────

export default function ExquisiteCorpseStepOne({
    control,
    errors,
}: {
    control: any;
    errors: any;
}) {
    return (
        <View style={styles.formContainer}>
            {/* Titre */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Titre</Text>
                <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Titre de votre cadavre exquis"
                            placeholderTextColor={Colors.light.chocolate + "66"}
                            underlineColorAndroid="transparent"
                            multiline
                            style={styles.textInput}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.title && (
                    <Text style={styles.errorText}>{errors.title.message}</Text>
                )}
            </View>

            {/* Prompt */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Prompt</Text>
                <Controller
                    control={control}
                    name="prompt"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Saisissez la première phrase de votre cadavre exquis"
                            placeholderTextColor={Colors.light.chocolate + "66"}
                            underlineColorAndroid="transparent"
                            multiline
                            numberOfLines={3}
                            style={[styles.textInput, styles.textInputMultiline]}
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                {errors.prompt && (
                    <Text style={styles.errorText}>{errors.prompt.message}</Text>
                )}
            </View>

            {/* Visibilité */}
            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Visibilité</Text>
                <Controller
                    control={control}
                    name="visibility"
                    render={({ field: { onChange, value } }) => (
                        <VisibilityToggle value={value} onChange={onChange} />
                    )}
                />
            </View>
        </View>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    formContainer: {
        gap: 24,
    },
    // Field group
    fieldGroup: {
        gap: 8,
    },
    label: {
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: Colors.light.chocolate,
        opacity: 0.6,
    },
    textInput: {
        backgroundColor: Colors.light.faintWarmWhite,
        color: Colors.light.chocolate,
        fontFamily: Platform.select(Fonts ?? {}) ?? undefined,
        fontSize: 15,
        padding: 12,
        borderRadius: 8,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 1,
    },
    textInputMultiline: {
        minHeight: 80,
        textAlignVertical: "top",
    },
    errorText: {
        fontSize: 12,
        color: "#b33a3a",
    },

    // Toggle
    toggleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: Colors.light.faintWarmWhite,
        borderRadius: 10,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    toggleTrack: {
        width: 50,
        height: 26,
        borderRadius: 13,
        justifyContent: "center",
    },
    toggleThumb: {
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 2,
        top: 3,
    },
    toggleLabel: {
        fontSize: 14,
        color: Colors.light.chocolate,
        opacity: 0.4,
        fontWeight: "500",
    },
    toggleLabelActive: {
        opacity: 1,
        fontWeight: "700",
    },
});
