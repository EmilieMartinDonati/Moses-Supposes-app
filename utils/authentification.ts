const authErrorMessages: Record<string, string> = {
  email_exists:                  "Cet email est déjà utilisé.",
  user_already_exists:           "Un compte existe déjà avec cet email.",
  email_address_invalid:         "Veuillez entrer une adresse email valide.",
  email_provider_disabled:       "L'inscription par email est désactivée.",
  email_address_not_authorized:  "This email address is not authorized.",
  weak_password:                 "Votre mot de passe est trop faible. Choisissez-en un plus robuste.",
  over_request_rate_limit:       "Trop de tentatives. Veuillez patienter avant de réessayer.",
  over_email_send_rate_limit:    "Trop d'emails envoyés. Veuillez patienter.",
  captcha_failed:                "La vérification CAPTCHA a échoué. Veuillez réessayer.",
  unexpected_failure:            "Une erreur est survenue. Veuillez réessayer plus tard.",
}

export const getAuthErrorMessage = (code: string | undefined): string => {
  if (!code) return authErrorMessages.unexpected_failure
  return authErrorMessages[code] ?? authErrorMessages.unexpected_failure
}

// Codes the user can fix by re-typing a field, mapped to that field.
const authErrorFields: Record<string, "email" | "password"> = {
  email_exists:                 "email",
  user_already_exists:          "email",
  email_address_invalid:        "email",
  email_address_not_authorized: "email",
  weak_password:                "password",
}

export const getAuthErrorField = (code: string | undefined): "email" | "password" | undefined => {
  if (!code) return undefined
  return authErrorFields[code]
}