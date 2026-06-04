import { router } from "expo-router";

type NavigationActionsType = {
    goHome: () => void,
    goToWorkshopEditor: (workshopId: string) => void,
    goToWorkshopLobby: (workshopId: string) => void,
    goBack: () => void,
    createWorkshop: () => void
}

export const NavigationActions: NavigationActionsType = {
    goHome: () => {
        router.push("/")
    },
    goToWorkshopEditor: (id) => {
        router.push(`/workshops/${id}`);
    },

    goToWorkshopLobby: (id) => {
        router.push(`/workshops/${id}/lobby`);
    },
    goBack: () => {
        router.back();
    },
    createWorkshop: () => {
        router.push("/create")
    }
}