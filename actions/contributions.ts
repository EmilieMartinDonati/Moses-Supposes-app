import { supabase } from "@/services/supabase/client"
import { getContributionsByWorkshop, getGuestSingleContribution } from "@/services/supabase/contributions"
import { Profile } from "@/services/supabase/profiles"
import { useAppStore } from "@/store/useAppStore"
import { ContributionType, StatusType } from "@/types/contributions"
import { WorkshopType } from "@/types/workshops"
import { User } from "@supabase/supabase-js"
import { animals, uniqueNamesGenerator } from 'unique-names-generator'
import { ActionError } from "./errors"

export const submitContribution = async ({
    type, content, workshopId, participantId
}: {
    type: WorkshopType,
    content: string,
    workshopId: string,
    participantId?: string | undefined
}): Promise<void> => {
    try {

        if (!type || !content || !workshopId) {
            throw new Error("L'un ou plusieurs des paramètres sont manquants")
        }

        if (type === "exquisite_corpse" && !participantId) {
            throw new Error("Impossible de récupérer l'id participant pour ce tour de cadavre exquis")
        }

        const { profile, user, guestId }: {
            profile: Profile | null
            user: User | null,
            guestId: string | null
        } = useAppStore.getState()

        if (!guestId && !user) {
            throw new Error("Aucun utilisateur connecté, ou, alternativement, aucun invité n'ont été trouvés")
        }
        if (user && !profile) {
            throw new Error("Erreur lors de la récupération du profil utilisateur")
        }

        // generate field displayName && avatarSeed
        const { displayName, avatarSeed } = await generateContributionDisplayNameAndAvatarSeed({
            user, profile, guestId
        })
        if (!displayName && !avatarSeed) {
            throw new Error("Aucun nom d'utilisateur et aucun avatar n'ont pu être générés")
        }

        // status
        // @todo replace this js function with a supabase rpc function that enforces status flow rules for example for teacher assignement, "submitted" status can not happen before "reviewed"
        const status = await getStatusByWorkshopType({
            workshopId, type
        })
        if (!status) {
            throw new Error("Le statut de la contribution n'a pas pu être défini")
        }

        const { error: transactionError } = await supabase.rpc("submit_contribution", {
            p_user_id: user?.id || null,
            p_guest_id: guestId || null,
            p_participant_id: participantId || null,
            p_state: status,
            p_workshop_id: workshopId,
            p_content: content,
            p_display_name: displayName,
            p_avatar_seed: avatarSeed
        })

        if (transactionError) {
            throw transactionError
        }


    } catch (e) {
        console.error("Error when submitting contribution", e)
        // show snackbar or display error message and blocks redirect
    }
}

export const generateContributionDisplayNameAndAvatarSeed = async ({ user, profile, guestId }: {
    user: User | null, profile: Profile | null, guestId: string | null
}) => {
    const result: { displayName: string | null, avatarSeed: string | null } = {
        displayName: null,
        avatarSeed: null
    }
    try {
        // If user exists, select username from profile if specified in account, otherwise parse user email
        if (profile?.username) {
            result.displayName = profile.username
        }
        else if (user?.email) {
            result.displayName = user.email.slice(0, user.email.indexOf("@"))
        }
        // If user doesn't exist, create avatar seed to guarantee coherence between submissions
        if (!user && guestId) {
            result.avatarSeed = await getOrCreateGuestAvatarSeed({
                guestId
            })
        }
        return result
    }
    catch (e) {
        console.error("Error generating contribution fields from profile", e)
        return result
    }

}

export const getOrCreateGuestAvatarSeed = async ({ guestId }: { guestId: string }) => {
    const { data: latest_contribution } = await getGuestSingleContribution({
        guestId, select: "avatar_seed", ascending: false
    })
    if (latest_contribution?.avatar_seed) {
        return latest_contribution?.avatar_seed
    }
    else {
        return uniqueNamesGenerator({
            dictionaries: [animals],
            style: 'lowerCase'
        })
    }
}

export const getStatusByWorkshopType = async ({ workshopId, type }: {
    workshopId: string,
    type: WorkshopType
}): Promise<StatusType> => {
    if (type === "exquisite_corpse") {
        return "submitted"
    }
    // todo infer from config 
    return "draft"
}

export const fetchContributionsByWorkshop = async ({ workshopId }: { workshopId: string }): Promise<ContributionType[]> => {
    try {
        const { data, error } = await getContributionsByWorkshop({ workshopId })
        if (error) {
            throw new ActionError("retrieve_workshop_contributions", `Impossible de récupérer les contributions pour l'atelier ${workshopId}`, { cause: error })
        }
        return (data ?? []) as unknown as ContributionType[]
    }
    catch (e) {
        // todo snackbar
        return []
    }
}