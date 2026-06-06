import { z } from "zod";

// Create exquisite cadaver

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