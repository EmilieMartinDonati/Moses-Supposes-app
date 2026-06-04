import { Colors } from "@/constants/theme";
import ExquisiteCadaverStepOne from "@/features/creation/exquisiteCadaverStepOne";
import ExquisiteCadaverStepThree from "@/features/creation/exquisiteCadaverStepThree";
import ExquisiteCadaverStepTwo from "@/features/creation/exquisiteCadaverStepTwo";
import WritingWorkshopHeader from "@/features/oneWritingWorkshop/writingWorkshopHeader";
import { createWritingWorkshop } from "@/services/supabase/writingWorkshops";
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { z } from 'zod'; // or 'zod/v4'

export default function WritingWorkshopCreationScreen() {
    const [step, setStep] = useState(0)
    const [stepFields, setStepFields] = useState<any[]>([["title", "prompt", "visibility"]])

    const baseSchema = z.object({
        title: z.string().min(1, 'Titre obligatoire'),
        prompt: z.string().min(1, 'Prompt obligatoire'),
        writingDelay: z.number(),
        max_sentences: z.number()
    })

    const exquisiteCadaverFormSchema = z.discriminatedUnion('visibility', [
        baseSchema.extend({
            visibility: z.literal('private'),
            iterations_count: z.number({ error: "Obligatoire" }).min(1, "Obligatoire"),
        }),
        baseSchema.extend({
            visibility: z.literal('public'),
            max_participants: z.number({ error: "Obligatoire" }),
            start_time: z.date(),
            end_time: z.date(),
        }),
    ])

    type FormValues = z.infer<typeof exquisiteCadaverFormSchema>

    const { handleSubmit, watch, control, trigger, getValues, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(exquisiteCadaverFormSchema),
        defaultValues: {
            title: "",
            prompt: "",
            visibility: "public",
            writingDelay: 120,
            max_sentences: 2
        }
    })

    const visibility = watch("visibility")

    useEffect(() => {
        if (visibility === "private") {
            setStepFields([["title", "prompt", "visibility"], ["writingDelay", "max_sentences", "iterations_count"], []])
        }
        else {
            setStepFields([["title", "prompt", "visibility"], ["writingDelay", "max_sentences", "max_participants"], ["start_time", "end_time"]])
        }

    }, [visibility])

    const handlePrev = () => {
        if (step === 0) return;
        setStep(step - 1)
    }

    const handleNext = async () => {
        const isValid = await trigger(stepFields[step]);
        if (isValid) {
            setStep(step + 1)
        }
        }

    const onSubmit = async (data: any) => {
        const result = await createWritingWorkshop(data)
        if (result?.id) {
            router.replace(`/create/${result.id}`)
        }
    }

    return (
        <View style={styles.writingWorkshopCreationScreen}>
            <WritingWorkshopHeader
                title={"Étape " + (step + 1) + "/ 3"}
                type="Nouveau cadavre exquis" />
            <View style={styles.createFormContainer}>
                {step === 0 && <ExquisiteCadaverStepOne control={control} errors={errors} />}
                {step === 1 && <ExquisiteCadaverStepTwo control={control} visibility={watch("visibility")} errors={errors} />}
                {step === 2 && <ExquisiteCadaverStepThree control={control} visibility={watch("visibility")} errors={errors} values={getValues()}/>}
            </View>
            <View style={styles.buttonsContainer}>
                <Pressable onPress={handlePrev}><Text>Retour</Text></Pressable>
                <Pressable style={styles.submitButton}
                      onPress={step !== 2 ? handleNext : handleSubmit(onSubmit)}>
                    <Text style={styles.submitText}>{step === 2 && visibility === "private" ?
                        "Créer et obtenir le code d'invitation" :
                        step === 2 ? "Créer" :
                            "Continuer"}
                    </Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    writingWorkshopCreationScreen: {
        flex: 1,
        paddingBottom: 24,
        backgroundColor: Colors.light.mainBeige,
    },
    createFormContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "center"
    },
    submitButton: {
        backgroundColor: Colors.light.chocolate,
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 16
    },
    submitText: {
        color: Colors.light.mainBeige,
        fontSize: 13,
        fontWeight: "500",
        textTransform: "uppercase"
    },
    buttonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 8
    }
})