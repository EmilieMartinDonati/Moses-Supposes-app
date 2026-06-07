import Alert from "@/components/Alert";
import DatePickerField from "@/components/forms/DatePickerField";
import FormLabel from "@/components/forms/FormLabel";
import { Colors } from "@/constants/theme";
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from "react-native";

// ─── Step Three ───────────────────────────────────────────────────────────────

export default function ExquisiteCorpseStepThree({
    control,
    errors,
    visibility
}: {
    control: any;
    errors: any;
    visibility: "private" | "public"
}) {

    if (visibility === "private") {
        return (
            <View style={styles.formContainer}>
                <Text style={styles.sectionHint}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Saisissez votre email"
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
                {errors.email && (
                    <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
                <Alert
                    visible={true}
                    height={200}
                    width={250}
                    variant="success"
                    content="Nous vous demandons votre email afin de pouvoir vous envoyer les résultats de votre atelier" />
            </View>
        )
    }

    return (
        <View style={styles.formContainer}>
            <Text style={styles.sectionHint}>
                Définissez la fenêtre de participation pour cet atelier.
            </Text>
                  <Alert
                visible={true}
                height={200}
                width={250}
                variant="success"
                content="Si votre workshop est encore actif et que les contributions abondent, nous vous enverrons une notification 30 minutes avant la clotûre pour vous demander si vous souhaitez étendre la date de fin." />
            <Controller
                control={control}
                name="start_time"
                render={({ field: { value, onChange } }) => (
                    <DatePickerField
                        renderLabelAndInstructions={() => <FormLabel label="Date de début" />}
                        value={value}
                        handleChange={onChange}
                    />
                )}
            />
            {errors.start_time && (
                <Text style={styles.errorText}>{errors.start_time.message}</Text>
            )}
            <Controller
                control={control}
                name="end_time"
                render={({ field: { value, onChange } }) => (
                    <DatePickerField
                        renderLabelAndInstructions={() => <FormLabel label="Date de fin" />}
                        value={value}
                        handleChange={onChange}
                    />
                )}
            />
            {errors.end_time && (
                <Text style={styles.errorText}>{errors.end_time.message}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        gap: 24,
    },
    sectionHint: {
        fontSize: 11,
        fontWeight: "600",
        letterSpacing: 0.8,
        textTransform: "uppercase",
        color: Colors.light.chocolate,
        opacity: 0.6
    },
    errorText: {
        fontSize: 12,
        color: "#b33a3a",
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
});
