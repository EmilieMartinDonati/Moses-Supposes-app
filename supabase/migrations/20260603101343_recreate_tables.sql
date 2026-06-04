drop table if exists writing_workshops cascade;
drop table if exists exquisite_corpse_config cascade;

create table writing_workshops(
    id uuid primary key default gen_random_uuid(),
    title text not null,
    prompt text not null,
    type text not null,
    created_at timestamptz default now(),
    created_by uuid references auth.users(id) on delete set null,
    creator_email text
);

create table exquisite_corpse_config(
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    workshop_id uuid references writing_workshops(id) on delete cascade,
    visibility text not null check (visibility in ('private', 'public')),
    writing_delay integer not null,
    max_sentences integer not null,
    iterations_count integer,
    max_participants integer,
    start_time timestamptz,
    end_time timestamptz,
    constraint private_fields check (
        visibility != 'private' or iterations_count is not null
    ),
    constraint public_fields check (
        visibility != 'public' or (
            max_participants is not null and
            start_time is not null and
            end_time is not null
        )
    )
);