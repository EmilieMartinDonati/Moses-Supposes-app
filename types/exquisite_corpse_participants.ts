export type StateType = "waiting" | "active" | "timed_out" | "done"

export type ExquisiteCorpseParticipantType = {
    workshop_id: string,
    user_id?: string,
    guest_id?: string,
    participant_id: string,
    state: StateType,
    cycle: number
}