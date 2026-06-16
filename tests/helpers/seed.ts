import { supabase } from "@/services/supabase/client"
import { StateType } from "@/types/exquisite_corpse_participants"
import { VisibilityType, WorkshopType } from "@/types/workshops"

type ConfigPayload = {
    workshop_id: string | undefined
    visibility: VisibilityType
    writing_delay: number
    max_sentences: number
    max_participants?: number
    start_time?: string
    end_time?: string
    iterations_count?: number
}

export const createTestWorkshop = async ({
    type = "exquisite_corpse",
    visibility = "public"
}: {
    type: WorkshopType,
    visibility?: VisibilityType
}) => {

    const payload = {
        type,
        title: "I am vitest test name",
        prompt: "vitest test prompt",
        creator_email: "emilie.martindonati@gmail.com"
    }
    const { data: workshopData } = await supabase.from("writing_workshops").insert(payload).select("id").single()

    const configPayload: ConfigPayload = {
        workshop_id: workshopData?.id,
        visibility,
        writing_delay: 120,
        max_sentences: 2
    }

    if (visibility === "public") {
        const now = Date.now()
        configPayload.max_participants = 200
        configPayload.start_time = new Date(now - 60_000).toISOString()       // 1 min ago → already live
        configPayload.end_time = new Date(now + 60 * 60_000).toISOString()    // 1 hour from now
    }
    else if (visibility === "private") {
        configPayload.iterations_count = 3
    }

    await supabase.from("exquisite_corpse_config").insert(configPayload)

    return workshopData
}

export const deleteTestWorkshop = async ({ workshopId }: { workshopId: string }) => {

    const { data: workshop } = await supabase.from("writing_workshops").select("type").eq("id", workshopId).single()
    if (!workshop) return

    const isExquisiteCorpse = workshop.type === "exquisite_corpse"

    await supabase.from("writing_workshops").delete().eq("id", workshopId)

    if (isExquisiteCorpse) {
        // or maybe ON DELETE CASCADE handles it already ? ^^
        await supabase.from("exquisite_corpse_config").delete().eq("workshop_id", workshopId)
        await supabase.from("exquisite_corpse_participants").delete().eq("workshop_id", workshopId)
        await supabase.from("contributions").delete().eq("workshop_id", workshopId)
    }
}


export const createTestExquisiteCorpseParticipant = async ({
    guestId, workshopId, state = "waiting"
}: {
    guestId: string, workshopId: string, state: StateType
}) => {

    const payload = {
        guest_id: guestId,
        workshop_id: workshopId,
        participant_id: crypto.randomUUID(), // to deprecate
        cycle: 0,
        state
    }
    const { data } = await supabase.from("exquisite_corpse_participants").insert(payload).select("*").single()

    return data
}