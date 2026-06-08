import AnimatedToggle from "@/components/AnimatedToggle";
import FormLabel from "@/components/forms/FormLabel";
import { Colors } from "@/constants/theme";
import { Controller } from "react-hook-form";
import {
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";

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
            <View style={styles.fieldGroup}>
                <FormLabel variant="neutral" label="Titre" />
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
                <FormLabel variant="neutral" label="Prompt" />
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
                <FormLabel variant="neutral" label="Visibilité" />
                <Controller
                    control={control}
                    name="visibility"
                    render={({ field: { onChange, value } }) => (
                        <AnimatedToggle
                            leftValue="private"
                            rightValue="public"
                            leftLabel="privé"
                            rightLabel="public"
                            currentValue={value}
                            leftIcon={"🔒"}
                            rightIcon={"🌐"}
                            handleChange={onChange}
                        />
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
    textInput: {
        backgroundColor: Colors.light.faintWarmWhite,
        color: Colors.light.chocolate,
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
    }
});
