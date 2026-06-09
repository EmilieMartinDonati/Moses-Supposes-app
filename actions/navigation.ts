import { router } from "expo-router";

type NavigationActionsType = {
    goHome: () => void,
    goToWorkshopEditor: (workshopId: string) => void,
    goToWorkshopLobby: (workshopId: string) => void,
    goBack: () => void,
    createWorkshop: () => void,
    goToSignup: () => void,
    goToLogin: () => void
}

export const NavigationActions: NavigationActionsType = {
    goHome: () => {
        router.push("/")
    },
    goToSignup: () => {
        router.push("/auth/signup")
    },
    goToLogin: () => {
        router.push("/auth/login")
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