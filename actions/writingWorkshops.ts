import { getWritingWorkshopById } from "@/services/supabase/writingWorkshops"
import { useAppStore } from "@/store/useAppStore"
import { NavigationActions } from "./navigation"

export const clickWritingWorkshop = async (writingWorkshopId: string, visibility: "live" | "upcoming") => {
    console.log("Rejoindre l'atelier d'écriture", visibility, writingWorkshopId, typeof writingWorkshopId)

    if (visibility === "upcoming") {
        //@todo redirect to page id mode consultation
    }
    else if (visibility === "live") {
        const writingWorkshop = await getWritingWorkshopById(writingWorkshopId)
        useAppStore.getState().setWritingWorkshopId(writingWorkshopId)
        useAppStore.getState().setWritingWorkshop(writingWorkshop)
        const count = 2;
        // @todo instead count presence from realTime feature
        if ((count ?? 0) < 5) {
            // await createPresence({ writingWorkshopId })
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