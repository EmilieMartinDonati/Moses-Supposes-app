import { supabase } from "@/services/supabase/client"
import { useEffect } from "react"

export default function useWorkshopChannel({ writingWorkshopId, guestId, userId }: { writingWorkshopId: string, guestId: string, userId: string }) {
    useEffect(() => {
        if (!writingWorkshopId && (!guestId || !userId)) {
            return
        }
        const channel = supabase.channel(`workshop:${writingWorkshopId}`)

        channel.on("presence", { event: "sync" }, () => {
            console.log('Presence state:', channel.presenceState())
        })
        channel.subscribe(async (status: string) => {
            console.log("STATUS SUSCRIPTION", status)
            if (status === "SUBSCRIBED") {
                await channel.track({
                    guest_id: guestId ?? null,
                    writing_workshop_id: writingWorkshopId,
                    user_id: userId ?? null,
                    joined_at: Date.now(),
                    isTurnOver: false,
                    turnNumber: 1
                })
            }
        })
        return () => {
            supabase.removeChannel(channel)
        }

    }, [guestId, writingWorkshopId, userId])

}