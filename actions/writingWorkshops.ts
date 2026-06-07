import { getWritingWorkshopById } from "@/services/supabase/writingWorkshops"
import { useAppStore } from "@/store/useAppStore"
import { countExquisiteCorpseWaitingParticipants } from "../services/supabase/exquisite_corpse_participants"
import { NavigationActions } from "./navigation"

export const clickWritingWorkshop = async (writingWorkshopId: string, visibility: "live" | "upcoming") => {

    if (visibility === "upcoming") {
        //@todo redirect to page id consultation
    }
    else if (visibility === "live") {
        const writingWorkshop = await getWritingWorkshopById(writingWorkshopId)
        useAppStore.getState().setWritingWorkshopId(writingWorkshopId)
        useAppStore.getState().setWritingWorkshop(writingWorkshop)
        
        const count = await countExquisiteCorpseWaitingParticipants({ workshopId: writingWorkshopId })
        if ((count ?? 0) < 5) {
            NavigationActions.goToWorkshopEditor(writingWorkshopId)
        }
        else {
            //@todo redirect to consultation and invite to join
            console.log("L'atelier d'écriture est complet. Nombre de participants:", count)
        }
    }
}

export const clickCreateWritingWorkshop = () => {
    NavigationActions.createWorkshop()
}