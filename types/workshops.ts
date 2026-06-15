
export type WorkshopType = "exquisite_corpse" | "contest" | "assignement"
export type VisibilityType = "private" | "public"

export type WritingWorkshopType = {
    id: string,
    title: string,
    prompt: string,
    type: WorkshopType,
    created_at: string,
    updated_at: string,
    created_by: string | null,
    created_email: string | null
}