import { supabase } from '@/services/supabase/client'
import { getLastExquisiteCorpseParticipationFromUser, insertExquisiteCorpseParticipant } from '@/services/supabase/exquisite_corpse_participants'
import { useAppStore } from '@/store/useAppStore'
import { ExquisiteCorpseParticipantType } from '@/types/exquisite_corpse_participants'
import * as Crypto from 'expo-crypto'
import { ActionError } from './errors'

export const getExquisiteCorpseTicket = async ({ workshopId }: { workshopId: string }) => {
    const { user, guestId } = useAppStore.getState()

    if (!user && !guestId) {
        throw new ActionError("no_identity", "Vous devez être connecté ou identifié pour rejoindre l'atelier")
    }

    // initialize workshop presence
    await createExquisiteCorpseParticipant({
        workshopId,
        userId: user?.id ?? null,
        guestId,
    })

    // check if it can be put to active and if so assign next player
    const { error } = await supabase.rpc("assign_next_turn", {
        p_workshop_id: workshopId
    })
    if (error) {
        throw new ActionError("assign_next_turn", "Impossible d'attribuer le tour de jeu", { cause: error })
    }
}

const createExquisiteCorpseParticipant = async ({ workshopId, userId, guestId }: { workshopId: string, userId: string | null, guestId: string | null }) => {
    const payload: ExquisiteCorpseParticipantType = {
        workshop_id: workshopId,
        state: "waiting",
        participant_id: Crypto.randomUUID(),
        cycle: await computeExquisiteCorpseParticipantCycle({ workshopId, userId, guestId }),
    }

    if (userId) payload.user_id = userId
    else if (guestId) payload.guest_id = guestId

    const { data, error } = await insertExquisiteCorpseParticipant({ payload })
    if (error) throw new ActionError("insert_participant", "Impossible de rejoindre l'atelier", { cause: error })

    return data
}

const computeExquisiteCorpseParticipantCycle = async ({ userId, workshopId, guestId }: { userId: string | null, workshopId: string, guestId: string | null }) => {
    const { data: lastUserParticipation, error } = await getLastExquisiteCorpseParticipationFromUser({
        workshopId,
        userId,
        guestId,
        select: "cycle",
    })
    if (error) throw new ActionError("compute_cycle", "Impossible de calculer votre tour de participation", { cause: error })

    return lastUserParticipation ? lastUserParticipation.cycle + 1 : 0
}
