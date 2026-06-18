import { getExquisiteCorpseConfig } from "@/services/supabase/exquisite_corse_config"
import { getWritingWorkshopById } from "@/services/supabase/writingWorkshops"
import { useAppStore } from "@/store/useAppStore"
import { WorkshopType } from "@/types/workshops"
import { countExquisiteCorpseParticipantsByState } from "../services/supabase/exquisite_corpse_participants"
import { ActionError } from "./errors"
import { getExquisiteCorpseTicket } from "./exquisiteCorpses"
import { NavigationActions } from "./navigation"


//--------------------------------- JOIN ---------------------------------//

export const clickWritingWorkshop = async ({ workshopId, visibility, type }: {
    workshopId: string,
    visibility: "live" | "upcoming",
    type: WorkshopType
}) => {
    try {
        if (visibility === "upcoming") {
            return
            //@todo redirect to page id consultation
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