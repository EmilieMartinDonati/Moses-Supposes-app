import { getExquisiteCorpseConfig, insertExquisiteCorpseConfig } from "@/services/supabase/exquisite_corse_config"
import { generateUniqueCode, getWritingWorkshopById, insertWorkshopAccess, insertWritingWorkshop } from "@/services/supabase/writingWorkshops"
import { useAppStore } from "@/store/useAppStore"
import { WorkshopType } from "@/types/workshops"
import { User } from "@supabase/supabase-js"
import { countExquisiteCorpseParticipantsByState } from "../services/supabase/exquisite_corpse_participants"
import { ActionError } from "./errors"
import { getExquisiteCorpseTicket } from "./exquisiteCorpses"
import { NavigationActions } from "./navigation"


//--------------------------------- JOIN ---------------------------------//

export const clickWritingWorkshop = async ({ workshopId, visibility, type }: {
    workshopId: string,
    visibility: "live" | "upcoming" | "finished",
    type: WorkshopType
}) => {
    try {
        if (visibility === "upcoming") {
            return
            //@todo redirect to page id consultation
        }

        if (visibility === "finished") {
            NavigationActions.goToWorkshopConsultation(workshopId)
            return
        }

        const { user, guestId } = useAppStore.getState()

        if (!user && !guestId) {
            throw new ActionError("no_identity", "Vous devez être connecté ou identifié pour rejoindre l'atelier")
        }

        if (type !== "exquisite_corpse") {
            NavigationActions.goToWorkshopEditor(workshopId)
        }
        else {
            // If busy, redirect to lobby
            const { error: countError, count } = await countExquisiteCorpseParticipantsByState({ workshopId, state: "waiting" })
            if (countError) {
                throw new ActionError("count_waiting_participants", "Impossible d'évaluer la disponibilité de l'atelier", { cause: countError })
            }
            // handle redirection : lobby or editor
            if ((count ?? 0) > 10) {
                NavigationActions.goToWorkshopLobby(workshopId)
            }
            else {
                await getExquisiteCorpseTicket({ workshopId, userId: user?.id || null, guestId })
                NavigationActions.goToWorkshopEditor(workshopId)
            }
        }
    } catch (e) {
        console.error("Error on click joining workshop", e)
        // todo show snackbar on app overlay with error message
        // consume ActionError to add in collection Logs or Events
    }
}


//---------------------- INSIDE WORKSHOP -----------------------------//

export const fetchWritingWorkshopWithConfig = async ({ workshopId }: { workshopId: string }) => {

    try {
        let writingWorkshop: any = {}
        let exquisiteCorpseConfig: any = {} // dirty right now it's waiting for me to find the accurate hack for dynamic select in supa queries which returns potential type GenericStringError

        const errorMessage = "Impossible de récupérer les informations du cadavre exquis"

        const { data, error } = await getWritingWorkshopById({ workshopId })
        if (error) {
            throw new ActionError("fetching_writing_workshop", errorMessage, { cause: error })
        }
        writingWorkshop = data
        const type = writingWorkshop.type
        if (type === "exquisite_corpse") {
            const result = await getExquisiteCorpseConfig({ workshopId })
            if (result.error) {
                throw new ActionError("fetching_exquisite_corpse_config", errorMessage, { cause: error })
            }
            exquisiteCorpseConfig = result.data
        }
        const result = {
            ...writingWorkshop,
            ...exquisiteCorpseConfig
        }
        // careful with the merge here
        result.id = writingWorkshop.id
        return result

    }
    catch (e) {
        console.log("e", e)
        // snackbar
    }
}

//---------------------- FOR CREATION CONFIRMATION FORM -----------------------------//

export const fetchWritingWorkshopWithConfigAndAccess = async ({ workshopId}: {workshopId: string} ) => {
    console.log("to migration from services")
}

export const fetchWritingWorkshop = async ({ workshopId }: { workshopId: string }) => {
    try {
        const { data, error } = await getWritingWorkshopById({ workshopId })
        if (error) {
            throw new ActionError("fetching_writing_workshop", "Impossible de récupérer les informations du cadavre exquis", { cause: error })
        }
        return data
    }
    catch (e) {
        console.log("e", e)
        // snackbar
    }
}

export const createWritingWorkshop = async ({
    data,
    user
}: {
    data: any,
    user?: User | null
}) => {
  try {
        const { visibility, prompt, title } = data
        const writing_workshop_payload : {
            prompt: string,
            title: string,
            type: "exquisite_corpse" | "contest",
            creator_email?: string,
            status: "draft" | "published"
            created_by?: string
        } = {
            prompt,
            title,
            type: "exquisite_corpse",
            status: "published"
        }
        if (data.email) {
            writing_workshop_payload["creator_email"] = data.email
        }

        if (user) {
            writing_workshop_payload["created_by"] = user.id
        }

        const { data: writing_workshop, error } = await insertWritingWorkshop({
            payload: writing_workshop_payload
        })

        if (error) {
            console.error("Error creating writing workshop:", error);
            throw error;
        }

        const workshop_id = writing_workshop.id
        const exquisite_corpse_config_payload: {
            workshop_id: string,
            writing_delay: number,
            max_sentences: number,
            visibility: "private" | "public",
            iterations_count?: number,
            max_participants?: number,
            start_time?: Date,
            end_time?: Date
        } = {
            workshop_id,
            writing_delay: data.writingDelay,
            max_sentences: data.max_sentences,
            visibility
        }
        if (data.iterations_count) {
            exquisite_corpse_config_payload["iterations_count"] = data.iterations_count
        }
        if (data.max_participants) {
            exquisite_corpse_config_payload["max_participants"] = data.max_participants
        }
        if (data.start_time) {
            exquisite_corpse_config_payload["start_time"] = data.start_time
        }
        if (data.end_time) {
            exquisite_corpse_config_payload["end_time"] = data.end_time
        }

        const { data: config, error: configError } = await insertExquisiteCorpseConfig({
            payload: exquisite_corpse_config_payload
        })

        if (configError) {
            console.error("Error creating exquisite corpse config:", configError);
            throw configError;
        }

        let access = null
        if (visibility === "private") {
            const code = await generateUniqueCode()
            const workshop_access_payload = {
                code,
                workshop_id,
                type: "code"
            }
            const { data, error: accessError } = await insertWorkshopAccess({
                payload: workshop_access_payload
            })
            if (accessError) {
                console.error("Error creating workshop access:", accessError);
                throw accessError;
            }
            access = data
        }

        return {
            ...writing_workshop,
             writing_delay: config.writing_delay,
            max_sentences: config.max_sentences,
            visibility: config.visibility,
            iterations_count: config.iterations_count,
            max_participants: config.max_participants,
            start_time: config.start_time,
            end_time: config.end_time,
            access_type: access?.type,
            access_code: access?.code
        }
    }
    catch (e) {
        console.error("error creating writing workshop", e)
    }
}