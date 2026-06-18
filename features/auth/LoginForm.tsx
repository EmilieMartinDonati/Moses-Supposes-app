import { loginUser } from "@/actions/auth";
import Alert from "@/components/Alert";
import Loader from "@/components/Loader";
import { Colors } from "@/constants/theme";
import { buttonStyles } from "@/styles/components.styles";
import { formStyles } from "@/styles/form.styles";
import { getAuthErrorField } from "@/utils/authentification";
import { loginSchema } from "@/utils/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import { z } from "zod";

type FormValues = z.infer<typeof loginSchema>

export default function LoginForm({ handleRedirect }: {
    handleRedirect: (val: number) => void
}) {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [authenticationError, setAuthenticationError] = useState<string | undefined>(undefined)

    const { handleSubmit, control, setError, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true)
        setAuthenticationError(undefined)
        const {error, errorCode } = await loginUser({
            email: data.email,
            password: data.password
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
            handleRedirect(0)
        }
        setIsSubmitting(false)
    }

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
            <Pressable
                disabled={isSubmitting}
                style={[buttonStyles.button, buttonStyles.button_green, buttonStyles.button_md, { alignSelf: "center" }]} onPress={handleSubmit(onSubmit)}>
                {!isSubmitting && <Text style={[buttonStyles.buttonText, buttonStyles.buttonText_green]}>Continuer</Text>}
                {isSubmitting && <Loader />}
            </Pressable>
        </View>
    )
}