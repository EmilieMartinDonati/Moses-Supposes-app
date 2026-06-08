import { signUpAndLoginUser } from "@/actions/auth";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import { Colors } from "@/constants/theme";
import { buttonStyles } from "@/styles/components.styles";
import { formStyles } from "@/styles/form.styles";
import { getAuthErrorField } from "@/utils/authentification";
import { emailSignupSchema } from "@/utils/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { z } from "zod";
import { EMAIL_OPTIN_STORAGE_KEY } from "./EmailOptinField";

type FormValues = z.infer<typeof emailSignupSchema>

export default function SignupForm({ handleRedirect }: {
    handleRedirect: (val: number) => void
}) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authenticationError, setAuthenticationError] = useState<string | undefined>(undefined)
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)

    const { handleSubmit, control, setError, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(emailSignupSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        setAuthenticationError(undefined)
        const storedOptin = await AsyncStorage.getItem(EMAIL_OPTIN_STORAGE_KEY)
        const { error, errorCode } = await signUpAndLoginUser({
            email: data.email,
            password: data.password,
            emailOptin: storedOptin !== null ? JSON.parse(storedOptin) : false
        })
        if (error) {
            const field = getAuthErrorField(errorCode)
            if (field) {
                setError(field, { type: "server", message: error })
            } else {
                setAuthenticationError(error)
            }
        }
        else {
            setShowSuccessAlert(true)
            handleRedirect(5000)
        }
        setIsSubmitting(false)
    }

    return (
        <View style={formStyles.formContainer}>
            {authenticationError && <Alert variant="error" width={150} height={50} content={authenticationError} />}
            {showSuccessAlert && <Alert variant="success" width={150} height={50} content={"Vous êtes bien connectés. Vous serez redirigés vers la page d'accueil dans quelques secondes."} />}
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
            <Pressable
                disabled={isSubmitting || showSuccessAlert}
                style={[buttonStyles.button, buttonStyles.button_green, buttonStyles.button_md, { alignSelf: "center" }]} onPress={handleSubmit(onSubmit)}>
                {!isSubmitting && <Text style={[buttonStyles.buttonText, buttonStyles.buttonText_green]}>Continuer</Text>}
                {isSubmitting && <Loader />}
            </Pressable>
        </View>
    )
}