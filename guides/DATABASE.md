# Database specs for Moses Supposes and known limitations

## Tables list

- users

- writing_workshops
- exquisite_corpse_config
- workshop_access

- segments

## users

## writing_workshops

This collection is fairly light-weight to anticipate on the situation where there will be other types of workshops

| column_name   | data_type                | is_nullable | column_default    | specs
| ------------- | ------------------------ | ----------- | ----------------- | -----------------------------------------
| id            | uuid                     | NO          | gen_random_uuid() |
| title         | text                     | NO          | null              |
| prompt        | text                     | NO          | null              | first sentence of exquisite cadaver for ex
| type          | text                     | NO          | null              | eg exquisite_cadaver or contest
| created_at    | timestamp with time zone | YES         | now()             |
| created_by    | uuid                     | YES         | null              | only if creator is logged in 
| creator_email | text                     | YES         | null              | mandatory if private workshop


NB : 
Nature of title and prompt depends on type of workshop

## exquisite_corpse_config 

This is used to handle exquisite_corpse parameters, the nature of the fields vary depending on whether the visibility is public or private

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

## segments

The story for a workshop ordered

| column_name | data_type                | is_nullable | column_default    |
| ----------- | ------------------------ | ----------- | ----------------- |
| id          | uuid                     | NO          | gen_random_uuid() |
| workshop_id | uuid                     | YES         | null              |
| text        | text                     | YES         | null              |
| guest_id    | uuid                     | YES         | null              |
| user_id     | uuid                     | YES         | null              |
| round       | integer                  | YES         | null              |
| position    | integer                  | YES         | null              |
| created_at  | timestamp with time zone | YES         | now()             |

## Known issues

- The visbility field could be on writing_workshops directly, as it will concern other types of writing_workshops too. The fact that it is on exquisite_corpse_config
- The same goes for end_time and start_time which could be on writing_workshops directly even if those fields are not mandatory
- The config table are problematic, will I have a new config collection for each type of workshops ?

