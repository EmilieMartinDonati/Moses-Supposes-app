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
            const { error, count } = await countExquisiteCorpseParticipantsByState({ workshopId, state: "waiting" })
            if (error) {
                throw new ActionError("count_waiting_participants", "Impossible d'évaluer la disponibilité de l'atelier", { cause: error })
            }
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

//---------------------- CREATE -----------------------------//

export const clickCreateWritingWorkshop = () => {
    NavigationActions.createWorkshop()
}