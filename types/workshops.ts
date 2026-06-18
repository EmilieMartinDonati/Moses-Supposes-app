
export type WorkshopType = "exquisite_corpse" | "contest" | "assignement"
export type VisibilityType = "private" | "public"
export type WorkshopStatus = "draft" | "published" | "closed" | "archived"

export type WritingWorkshopType = {
    id: string,
    title: string,
    prompt: string,
    type: WorkshopType,
    created_at: string,
    updated_at: string,
    created_by: string | null,
    created_email: string | null,
    status: WorkshopStatus
}

export type OnlineParticipant = {
    participant_id: string,
    joined_at: string,
    avatar_seed: string | null,
    display_name: string | null,
    workshop_id: string,
    presence_ref: string
}