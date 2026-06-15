import { supabase } from "@/services/supabase/client";
import { ContributionType } from "@/types/contributions";
import { ExquisiteCorpseParticipantType } from "@/types/exquisite_corpse_participants";
import { useEffect } from "react";

export default function useExquisiteCorpseRealtime({
    workshopId,
    participantId,
    onNewContribution,
    onExquisiteCorpseParticipantStateChange
}: {
    workshopId: string | null,
    participantId: string | null, 
    onNewContribution: (contribution: ContributionType) => void,
    onExquisiteCorpseParticipantStateChange: (participant: ExquisiteCorpseParticipantType) => void
}) {

    useEffect(() => {
        if (!workshopId) {
            return
        }
        const channel = supabase.channel(`contributions:${workshopId}`)
            .on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "contributions",
                filter: `workshop_id=eq.${workshopId}`
            }, (payload) => {
                onNewContribution(payload.new as ContributionType)
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [workshopId])

    useEffect(() => {
        if (!participantId) {
            return
        }
        const channel = supabase.channel(`participants:${participantId}`)
        .on("postgres_changes", {
            event: "UPDATE",
            schema: "public",
            table: "exquisite_corpse_participants",
            filter: `id=eq.${participantId}`
        }, 
        (payload) => {
            onExquisiteCorpseParticipantStateChange(payload.new as ExquisiteCorpseParticipantType)
        })
        .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [participantId])

}