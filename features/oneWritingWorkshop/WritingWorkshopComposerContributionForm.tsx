import Loader from '@/components/Loader';
import { Colors } from '@/constants/theme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from 'zod'; // or 'zod/v4'


export default function WritingWorkshopComposerContributionForm({
    onSubmit, isSubmitting
}: {
    onSubmit: (data: { text: string }) => Promise<void>,
    isSubmitting: boolean
}) {

    const formSchema = z.object({
        text: z.string()
    })

    const {
        handleSubmit,
        control,
        formState: { errors } } = useForm({
            resolver: zodResolver(formSchema),
            defaultValues: {
                text: ""
            },
        })


    return (
        <View style={styles.formContainer}>
            <Controller
                control={control}
                name="text"
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        style={[styles.input, { outline: 'none' } as any]}
                        placeholder="Continue the story…"
                        placeholderTextColor={Colors.light.mainBlue}
                        underlineColorAndroid="transparent"
                        multiline
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <View style={styles.inputFooter}>
                <Text style={styles.hint}>1 phrase maximum</Text>
                <Pressable
                    style={styles.submitButton}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isSubmitting}>
                    {isSubmitting ?
                        <Loader /> :
                        <Text style={styles.submitText}>Envoyer</Text>}
                </Pressable>
            </View>
        </View>
    )


}

const styles = StyleSheet.create({
    formContainer: {
        gap: 16,
        justifyContent: "space-between"
    },
    input: {
        height: 140,
        backgroundColor: Colors.light.faintWarmWhite,
        borderColor: Colors.light.elevatedBeige,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        color: Colors.light.chocolate,
        fontSize: 14,
        textAlignVertical: "top",   // Android — texte begins at the top
    },
    inputFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    hint: {
        fontSize: 11,
        color: Colors.light.mainBlue,
    },
    submitButton: {
        backgroundColor: Colors.light.chocolate,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    submitText: {
        color: Colors.light.mainBeige,
        fontSize: 13,
        fontWeight: "500",
        textTransform: "uppercase"
    }
})