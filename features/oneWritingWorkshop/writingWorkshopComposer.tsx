import { Colors } from "@/constants/theme";
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from 'zod'; // or 'zod/v4'

export default function WritingWorkshopComposer({ onSubmit }: {
    onSubmit: ( data: { text: string } ) => Promise<void>
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
        <View style={styles.writingWorkshopComposerContainer}>
            <View style={styles.userContainer}>
                <View style={styles.userChip}>
                    <Text style={styles.smallUserText}>Y</Text>
                </View>
                <Text style={styles.userText}>A TON TOUR</Text>
            </View>
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
                <Pressable style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
                    <Text style={styles.submitText}>Envoyer</Text>
                </Pressable>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    writingWorkshopComposerContainer: {
        height: 280,
        borderTopColor: Colors.light.elevatedBeige,
        borderTopWidth: 1,
        padding: 16,
        justifyContent: "space-between"
    },
    userContainer: {
        gap: 10,
        flexDirection: "row",
        alignItems: "center"
    },
    userChip: {
        backgroundColor: Colors.light.honey,
        width: 24,
        height: 24,
        borderRadius: 12,        // exactement la moitié
        justifyContent: "center",
        alignItems: "center",    // centre le texte dedans
    },
    smallUserText: {
        fontSize: 10,
        fontWeight: "500",
    },
    userText: {
        color: Colors.light.chocolate
    },
    input: {
        height: 120,
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