import { supabase } from "./client";

/* ----------------------------------------------------------------
---------------------------- GET ----------------------------------
---------------------------------------------------------------- */

export async function countPresencesByWorkshopId({ writingWorkshopId }: { writingWorkshopId: string }) {

    const { count, error } = await supabase
        .from("presences")
        .select("*", { count: "exact", head: true })
        .eq("writing_workshop_id", writingWorkshopId)

    if (error) {
        console.error("Error counting presences:", error);
    }

    return count;
}


/* ----------------------------------------------------------------
---------------------------- CREATE -------------------------------
---------------------------------------------------------------- */

/**
 * Create a presence record in the `presences` table.
 *
 * @param params - The presence creation parameters.
 * @param params.writingWorkshopId - Optional workshop ID to associate with the presence.
 * @returns The inserted presence row.
 * @throws If the Supabase insert operation fails.
 */
export async function createPresence({ writingWorkshopId }: { writingWorkshopId: string }) {

    const payload: { user_id?: string; writing_workshop_id: string; guest_id?: string } = { writing_workshop_id: writingWorkshopId };

    let guestId, userId = null;

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        guestId = crypto.randomUUID();
    }
    else {
        userId = user.id;
    }

    if (!!userId) payload.user_id = userId;
    if (!!guestId) payload.guest_id = guestId;

    const { data, error } = await supabase.from("presences").insert(payload).select("*").single();
    if (error) {
        console.error("Error creating presence:", error);
        throw error;
    }

    // Store the presence ID in local storage for later updates and deletion
    localStorage.setItem('presenceId', data.id);

    return data;

}




/* ----------------------------------------------------------------
---------------------------- UPDATE -------------------------------
---------------------------------------------------------------- */

/* ----------------------------------------------------------------
---------------------------- DELETE -------------------------------
---------------------------------------------------------------- */

export async function deletePresence({ presenceId }: { presenceId: string }) {

    const { error } = await supabase
        .from("presences")
        .delete()
        .eq("id", presenceId);

    if (error) {
        console.error(`error on deleting presence for presenceId ${presenceId}`, error)
        throw error
    }
}