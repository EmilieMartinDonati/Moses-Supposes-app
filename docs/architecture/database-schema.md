# Database specs for Moses Supposes and known limitations

## Public tables list

- profiles

- writing_workshops
- exquisite_corpse_config
- workshop_access
- exquisite_corpse_participants
- segments (or contributions)

## profiles 

the user layer where we store UX info on the users (auth.users, the supabase table dedicated to authentification, contains registering and roles informations to the exclusion of anything else)

| column_name     | data_type   | is_nullable | column_default    | specs                               |
| --------------- | ----------- | ----------- | ----------------- | ----------------------------------- |
| id              | uuid        | NO          | gen_random_uuid() | PK                                  |
| user_id         | uuid        | NO          | null              | FK                                  |
| email_optin     | boolean     | NO          | false             |                                     |



## writing_workshops

This collection is fairly light-weight to anticipate on the situation where there will be other types of workshops

| column_name   | data_type                | is_nullable | column_default    | specs
| ------------- | ------------------------ | ----------- | ----------------- | -----------------------------------------
| id            | uuid                     | NO          | gen_random_uuid() |
| title         | text                     | NO          | null              |
| prompt        | text                     | NO          | null              | first sentence of exquisite cadaver for ex
| type          | text                     | NO          | null              | eg exquisite_cadaver | contest | educative exercise
| created_at    | timestamp with time zone | YES         | now()             |
| created_by    | uuid                     | YES         | null              | only if creator is logged in 
| creator_email | text                     | YES         | null              | mandatory if private workshop


NB : 
Nature of title and prompt depends on type of workshop

## exquisite_corpse_config 

This is used to handle exquisite_corpse parameters, the nature of the fields depends on whether the visibility is public or private

| column_name      | data_type                | is_nullable | column_default    | specs
| ---------------- | ------------------------ | ----------- | ----------------- | --------------------------------------------------
| id               | uuid                     | NO          | gen_random_uuid() |
| created_at       | timestamp with time zone | YES         | now()             |
| workshop_id      | uuid                     | YES         | null              | reference to writing_workshop
| visibility       | text                     | NO          | null              | private or public
| writing_delay    | integer                  | NO          | null              | in seconds, to avoid that a user blocks a workshop
| max_sentences    | integer                  | NO          | null              | per turn
| iterations_count | integer                  | YES         | null              | for private workshop only
| max_participants | integer                  | YES         | null              | for public workshop only
| start_time       | timestamp with time zone | YES         | null              | for public workshop only
| end_time         | timestamp with time zone | YES         | null              | for public workshop only


## workshop_access

| column_name   | data_type                | is_nullable | column_default    |
| ------------- | ------------------------ | ----------- | ----------------- |
| id            | uuid                     | NO          | gen_random_uuid() |
| workshop_id   | uuid                     | YES         | null              |
| type          | text                     | YES         | null              |
| code          | text                     | YES         | null              |
| email         | text                     | YES         | null              |
| created_at    | timestamp with time zone | YES         | now()             |
| whatsapp_link | text                     | YES         | null              |

NB : we could remove whatsapp_link as code can be shared by whatsapp, email does not make sense and will be removed

## exquisite_corpse_participants

| column_name     | data_type   | is_nullable | column_default    | specs                               |
| --------------- | ----------- | ----------- | ----------------- | ----------------------------------- |
| id              | uuid        | NO          | gen_random_uuid() | PK                                  |
| workshop_id     | uuid        | NO          | null              | FK                                  |
| user_id         | uuid        | YES         | null              |                                     |
| guest_id        | uuid        | YES         | null              |                                     |
| participant_id  | uuid        | NO          | null.             |                                     |
| joined_at       | timestamptz | NO          | now()             | FIFO key                            |
| state           | text        | NO          | 'waiting'         | waiting | active | done | timed_out |
| cycle           | int         | NO          | 0                 | replay counter                      |
| turn_started_at | timestamptz | YES         | null              | start timestamp                     |
| turn_deadline   | timestamptz | YES         | null              | config-based timeout                |
| created_at      | timestamptz | NO          | now()             |                                     |
| updated_at      | timestamptz | NO          | now()             |                                     |

## segments or contributions

the final product, in the case of an exquisite corpse, it will be segments, but it can also be an entire text

| column_name    | data_type   | is_nullable | column_default    | specs                                             |
| -------------- | ----------- | ----------- | ----------------- | ------------------------------------------------- |
| id.            | uuid        | NO          | gen_random_uuid() | Primary key                                       |
| workshop_id    | uuid        | NO          | null              | FK → writing_workshops.id                         |
| participant_id | uuid        | YES         | null              | Technical trace to participant cycle              |
| user_id        | uuid        | YES         | null              | Snapshot of logged-in user at submission time     |
| anonymous_id   | uuid        | YES         | null              | Snapshot of anonymous identity at submission time |
| display_name   | text        | NO          | null              | Snapshot of name shown in final story             |
| avatar_seed    | text        | NO          | null              | Stable anonymous avatar / symbol seed             |
| content        | text        | NO          | null              | Segment text                                      |
| status         | text        | NO          | null              | "draft" or "submitted"                            |
| visibility     | text        | NO          | null              | "private" or "public"                             |
| created_at     | timestamptz | NO          | now()             | Submission timestamp                              |

---

## Known issues

- The visbility field could be on writing_workshops directly, as it will concern other types of writing_workshops too. The fact that it is on exquisite_corpse_config
- The same goes for end_time and start_time which could be on writing_workshops directly even if those fields are not mandatory
- The config table are problematic, will I have a new config collection for each type of workshops ?

