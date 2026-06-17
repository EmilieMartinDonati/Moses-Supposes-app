type BaseConfig = {
    id: string,
    visibility: string,
    writing_delay: number,
    max_sentences: number,
    workshop_id: string,
    created_by?: string
}

type PrivateExquisiteCorpseConfig = BaseConfig & {
    iterations_count: number,
    creator_email: string,
}

type PublicExquisiteCorpseConfig = BaseConfig & {
    max_participants: number,
    start_time: number,
    end_time: number
}

export type ExquisiteCorpseConfig = PrivateExquisiteCorpseConfig | PublicExquisiteCorpseConfig