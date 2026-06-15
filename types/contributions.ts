export type StatusType = "draft" | "submitted"

export type ContributionType = {
    id: string,
    workshop_id: string,
    participant_id: string,
    user_id: string | null,
    guest_id: string | null,
    display_name: string | null,
    avatar_seed: string | null,
    content: string,
    state: StatusType,
    created_at: string,
    updated_at: string
}