CREATE TABLE exquisite_corpse_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id uuid NOT NULL
        REFERENCES writing_workshops(id)
        ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    guest_id uuid,
    CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL),
    participant_id uuid NOT NULL DEFAULT gen_random_uuid(),
    joined_at timestamptz NOT NULL DEFAULT now(),
    state text NOT NULL DEFAULT 'waiting'
        CHECK (state IN ('waiting', 'active', 'done', 'timed_out')),
    cycle integer NOT NULL DEFAULT 0,
    turn_started_at timestamptz,
    turn_deadline timestamptz
);