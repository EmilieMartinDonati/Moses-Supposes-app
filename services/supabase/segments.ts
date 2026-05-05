import { supabase } from "./client";

export async function createSegment({ text, guestId, userId, writingWorkshopId }: { text: string, guestId?: string, userId?: string, writingWorkshopId: string }) {

    const payload: { text: string, user_id?: string, guest_id?: string, workshop_id: string } = {
        text,
        workshop_id: writingWorkshopId,
    }

    if (guestId) {
        payload.guest_id = guestId
    }
    if (userId) {
        payload.user_id = userId
    }

    const createdSegment = await supabase.from("segments").insert(payload).select("*").single()
    console.log("___ CREATED SEGMENT ____", createdSegment)

    // @todo replace w/ transaction
}

export async function fetchSegmentsByWorkshopId({ writingWorkshopId, limit = 1000, orderField = "created_at", orderBy = "lorem ipsum" }: {
    writingWorkshopId: string,
    limit?: number,
    orderField?: string,
    orderBy?: string
}) {

    const { data: segments, error } = await supabase.from("segments")
        .select("*")
        .eq("workshop_id", writingWorkshopId)
        .order("created_at", { ascending: true });

    if (error) {
        console.log(`Error retrieving segments for workshop id ${writingWorkshopId}`, error)
    }

    console.log("SEGMENTSSSS", segments)

    return segments

}
