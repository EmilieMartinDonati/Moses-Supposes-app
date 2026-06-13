import { supabase } from '@/services/supabase/client'
import { getLastExquisiteCorpseParticipationFromUser, insertExquisiteCorpseParticipant } from '@/services/supabase/exquisite_corpse_participants'
import { ExquisiteCorpseParticipantType } from '@/types/exquisite_corpse_participants'
import * as Crypto from 'expo-crypto'
import { ActionError } from './errors'

export const getExquisiteCorpseTicket = async ({ workshopId, userId, guestId }: { workshopId: string, userId: string | null, guestId: string | null }) => {

    // initialize workshop presence
    await createExquisiteCorpseParticipant({
        workshopId,
        userId,
        guestId
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
    // todo check that they don't already have a turn waiting or active
    // to account for case where user goes back to landing then back to workshop
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
