create table contributions(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id uuid NOT NULL REFERENCES writing_workshops(id) on delete cascade,
    participant_id uuid REFERENCES exquisite_corpse_participants(id) on delete set null,
    user_id uuid REFERENCES auth.users(id) on delete set null,
    guest_id uuid DEFAULT null,
    display_name text DEFAULT null,
    avatar_seed text DEFAULT null,
    content text NOT NULL,
    state text NOT NULL DEFAULT 'submitted',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);