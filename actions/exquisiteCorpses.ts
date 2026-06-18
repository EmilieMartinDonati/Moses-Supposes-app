import { supabase } from '@/services/supabase/client'
import { getExquisiteCorpseCurrentParticipationFromUser, getLastExquisiteCorpseParticipationFromUser, insertExquisiteCorpseParticipant } from '@/services/supabase/exquisite_corpse_participants'
import { ExquisiteCorpseParticipantType } from '@/types/exquisite_corpse_participants'
import * as Crypto from 'expo-crypto'
import { ActionError } from './errors'

export const replayExquisiteCorpse = async ({ workshopId, userId, guestId }: { workshopId: string, userId: string | null, guestId: string | null }) => {
    try {
        await getExquisiteCorpseTicket({
            workshopId, userId, guestId
        })
        // refresh participant
        const participant = await fetchExquisiteCorpseCurrentParticipant({
            workshopId, userId, guestId
        })
        return participant
    }
    catch (e) {
        console.log("ERROR REPLAYING", e)
    }
}

export const getExquisiteCorpseTicket = async ({ workshopId, userId, guestId }: { workshopId: string, userId: string | null, guestId: string | null }) => {

    // check if user already has a valid entry ticket (state "waiting" or "active")
    const { error, data } = await getExquisiteCorpseCurrentParticipationFromUser({
        userId, guestId, workshopId
    })
    if (error) {
        throw new ActionError("get_exquisite_corpse_current_participant_from_user", "Impossible d'évaluer si un ticket d'admission existe déjà", { cause: error })
    }
    if (data) {
        return
    }

    // initialize workshop presence
    await createExquisiteCorpseParticipant({
        workshopId,
        userId,
        guestId
    })

    // check if it can be put to active and if so assign next player
    const { error: transactionError } = await supabase.rpc("assign_next_turn", {
        p_workshop_id: workshopId
    })
    if (transactionError) {
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

export const fetchExquisiteCorpseCurrentParticipant = async ({
    workshopId, userId, guestId
}: {
    workshopId: string,
    userId: string | null,
    guestId: string | null
}) => {
    // without an identity, the query would match any latest participant of the workshop
    if (!userId && !guestId) return null
    try {
        const { data, error } = await getExquisiteCorpseCurrentParticipationFromUser({
            workshopId, guestId, userId
        })
        if (error) {
            throw new ActionError("fetching exquisite corpse participant", "Impossible de récupérer votre billet d'entrée", { cause: error })
        }
        return data
    } catch (e) {
        // snackbar
        return null
    }
}
