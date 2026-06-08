import { z } from "zod";

// ------ Create exquisite corpse ------//

const baseExquisiteCadaverSchema = z.object({
    title: z.string().min(1, "Titre obligatoire"),
    prompt: z.string().min(1, "Prompt obligatoire"),
    writingDelay: z.number(),
    max_sentences: z.number(),
});

export const exquisiteCorpseFormSchema = z.discriminatedUnion("visibility", [
    baseExquisiteCadaverSchema.extend({
        visibility: z.literal("private"),
        iterations_count: z.number({ error: "Obligatoire" }).min(1, "Obligatoire"),
        email: z.email({ error: "Obligatoire" })
    }),
    baseExquisiteCadaverSchema.extend({
        visibility: z.literal("public"),
        max_participants: z.number({ error: "Obligatoire" }),
        start_time: z.date({ error: "Obligatoire" }),
        end_time: z.date({ error: "Obligatoire" }),
    }),
]);

// --------------- Sign up with email ---------------//

const passwordSchema = z.string()
.min(8, {message: "Au moins 8 caractères"})
.max(40, {message: "40 caractères maximum"})
  .refine((password) => /[A-Z]/.test(password), {
    message: "Au moins un caractère majuscule",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Au moins un caractère minuscule"
  })
  .refine((password) => /[0-9]/.test(password), { message: "Au moins un chiffre de 0 à 9" })
  .refine((password) => /[!@#$%^.&*]/.test(password), {
    message: "Au moins un caractère spécial",
  });

export const emailSignupSchema = z.object({
  email: z.email("Email invalide"),
  password: passwordSchema,
  emailOptin: z.boolean()
})