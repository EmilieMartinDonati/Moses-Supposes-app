import { signUpAndLoginUser } from "@/actions/auth";
import Alert from "@/components/Alert";
import { Colors } from "@/constants/theme";
import { buttonStyles } from "@/styles/components.styles";
import { formStyles } from "@/styles/form.styles";
import { getAuthErrorField } from "@/utils/authentification";
import { emailSignupSchema } from "@/utils/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";

type FormValues = z.infer<typeof emailSignupSchema>

export default function SignupForm() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authenticationError, setAuthenticationError] = useState<string | undefined>(undefined)

    const { handleSubmit, control, setError, watch, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(emailSignupSchema),
        defaultValues: {
            emailOptin: true
        }
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        setAuthenticationError(undefined)
        const { error, errorCode } = await signUpAndLoginUser({
            email: data.email,
            password: data.password,
            emailOptin: data.emailOptin
        })
        if (error) {
            const field = getAuthErrorField(errorCode)
            if (field) {
                setError(field, { type: "server", message: error })
            } else {
                setAuthenticationError(error)
            }
        }
        setIsSubmitting(false)
    }

    const emailOptinValue = watch("emailOptin")

    return (
        <View style={formStyles.formContainer}>
            {authenticationError && <Alert variant="error" width={150} height={50} content={authenticationError} />}
            <View style={formStyles.fieldGroupLg}>
                <Text style={formStyles.label}>Email</Text>
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            style={[formStyles.textInput, errors["email"] && formStyles.textInputError]}
                            value={value} onChangeText={onChange} placeholder="Email"
                            placeholderTextColor={errors["email"] ? Colors.light.paleRose : Colors.light.elevatedBeige}
                        />
                    )}
                />
                {errors.email && <Text style={formStyles.errorText}>{errors.email.message}</Text>}
                <Text style={formStyles.label}>Mot de passe</Text>
                <Controller
                    control={control}
                    name="password"
                    render={({ field: { value, onChange } }) => (
                        <TextInput
                            style={[formStyles.textInput, errors["password"] && formStyles.textInputError]}
                            value={value} onChangeText={onChange}
                            placeholder="Mot de passe"
                            placeholderTextColor={errors["password"] ? Colors.light.paleRose : Colors.light.elevatedBeige}
                        />
                    )}
                />
                {errors.password && <Text style={formStyles.errorText}>{errors.password.message}</Text>}
            </View>
            <View style={styles.optinFieldGroup}>
                <Controller control={control} name="emailOptin" render={({ field: { value, onChange } }) => (
                    <Pressable style={styles.checkBox} onPress={() => onChange(!emailOptinValue)}>
                        <View style={[styles.checkBoxInner, !!watch("emailOptin") && styles.checkBoxInnerFilled]}></View>
                    </Pressable>
                )} />
                <Text style={styles.optinText}>J'accepte de recevoir par mail des annonces sur les concours littéraires à venir</Text>
            </View>
            <Pressable
                disabled={isSubmitting}
                style={[buttonStyles.button, buttonStyles.button_green, buttonStyles.button_md, { alignSelf: "center" }]} onPress={handleSubmit(onSubmit)}>
                <Text style={[buttonStyles.buttonText, buttonStyles.buttonText_green]}>Continuer</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    optinFieldGroup: {
        flexDirection: "row",
        gap: 16,
        alignItems: "center"
    },
    checkBox: {
        borderColor: Colors.light.chocolate,
        borderWidth: 2,
        borderRadius: 25,
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    checkBoxInner: {
        width: 20,
        height: 20,
        borderRadius: 10
    },
    checkBoxInnerFilled: {
        backgroundColor: Colors.light.chocolate
    },
    optinText: {
        textAlign: "justify",
        fontSize: 12
    }
})