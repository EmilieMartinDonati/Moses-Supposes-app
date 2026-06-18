import DualActionsFooter from "@/components/DualActionsFooter";
import { Colors } from "@/constants/theme";
import WritingWorkshopHeader from "@/features/oneWritingWorkshop/WritingWorkshopHeader";
import { createWritingWorkshop } from "@/services/supabase/writingWorkshops";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { z } from "zod";
import { exquisiteCorpseFormSchema } from "../../utils/forms";
import ExquisiteCorpseStepOne from "./ExquisiteCorpseStepOne";
import ExquisiteCorpseStepThree from "./ExquisiteCorpseStepThree";
import ExquisiteCorpseStepTwo from "./ExquisiteCorpseStepTwo";

type FormValues = z.infer<typeof exquisiteCorpseFormSchema>;

export default function ExquisiteCorpseCreationForm() {
    const [step, setStep] = useState(0);
    const [stepFields, setStepFields] = useState<any[]>([["title", "prompt", "visibility"]]);

    const { handleSubmit, watch, control, trigger, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(exquisiteCorpseFormSchema),
        defaultValues: {
            title: "",
            prompt: "",
            visibility: "public",
            writingDelay: 120,
            max_sentences: 2,
        },
    });

    const visibility = watch("visibility");

    useEffect(() => {
        if (visibility === "private") {
            setStepFields([["title", "prompt", "visibility"], ["writingDelay", "max_sentences", "iterations_count"], ["email"]]);
        } else {
            setStepFields([["title", "prompt", "visibility"], ["writingDelay", "max_sentences", "max_participants"], ["start_time", "end_time"]]);
        }
    }, [visibility]);

    const handlePrev = () => {
        if (step === 0) return;
        setStep(step - 1);
    };

    const handleNext = async () => {
        const isValid = await trigger(stepFields[step]);
        if (isValid) setStep(step + 1);
    };

    const onSubmit = async (data: any) => {
        const result = await createWritingWorkshop(data);
        if (result?.id) {
            router.replace(`/create/${result.id}`);
        }
    };

    return (
        <View style={styles.writingWorkshopCreationScreen}>
            <WritingWorkshopHeader
                title={"Étape " + (step + 1) + "/ 3"}
                type="Nouveau cadavre exquis"
            />
            <View style={styles.createFormContainer}>
                {step === 0 && <ExquisiteCorpseStepOne control={control} errors={errors} />}
                {step === 1 && <ExquisiteCorpseStepTwo control={control} visibility={visibility} errors={errors} />}
                {step === 2 && <ExquisiteCorpseStepThree control={control} visibility={visibility} errors={errors} />}
            </View>
            <DualActionsFooter
                leftAction={{
                    label: step === 0 ? "Retour à l'accueil" : "Précédent",
                    onPress: step === 0 ? () => router.replace("/") : handlePrev
                }}
                rightAction={{
                    label: step === 2 ? "Créer" : "Continuer",
                    onPress: step === 2 ? handleSubmit(onSubmit) : handleNext
                }} />
        </View>
    );
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
        justifyContent: "center",
    }
});
