import { supabase } from "@/services/supabase/client";
import { ContributionType } from "@/types/contributions";
import { ExquisiteCorpseParticipantType } from "@/types/exquisite_corpse_participants";
import { useEffect, useRef } from "react";

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

    // Keep refs pointing at the latest callbacks so the channels (which subscribe
    // once) always invoke the freshest closure instead of the one frozen at subscribe time.
    const onNewContributionRef = useRef(onNewContribution)
    const onParticipantStateChangeRef = useRef(onExquisiteCorpseParticipantStateChange)

    useEffect(() => {
        onNewContributionRef.current = onNewContribution
        onParticipantStateChangeRef.current = onExquisiteCorpseParticipantStateChange
    })

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
                onNewContributionRef.current(payload.new as ContributionType)
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
            onParticipantStateChangeRef.current(payload.new as ExquisiteCorpseParticipantType)
        })
        .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }

    }, [participantId])

}