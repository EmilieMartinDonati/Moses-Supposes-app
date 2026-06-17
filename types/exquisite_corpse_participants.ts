export type StateType = "waiting" | "active" | "timed_out" | "done"

export type ExquisiteCorpseParticipantType = {
    id: string,
    workshop_id: string,
    user_id?: string,
    guest_id?: string,
    participant_id?: string, // to deprecate
    state: StateType,
    cycle: number
}