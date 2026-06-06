# Technical specs for Moses Supposes (mobile app)

## Authentification

### Principes : light authentification

We don't want to force user to log in to participate in a workshop, whether public or private, but we still need to track what they do and identify that they are the same person through different interactions.

### Flow

1) User opens app and is not logged in, then joins workshop

- Create anonymous_id = uuid() upon opening app
- When joining a workshop, insert into exquisite_corpse_participants:

```sql
participant_id = uuid()
anonymous_id = anon_123
user_id = NULL
joined_at = now()
state = waiting
```
2) User logs in mid session : UPDATE existing participant row(s) in exquisite_corpse_participants

```sql
anonymous_id = NULL
user_id = auth.uid
```

3) User joins session when already logged in, in exquisite_corpse_participants :

```sql
participant_id = uuid()
anonymous_id = NULL
user_id = auth.uid
joined_at = now()
state = waiting
```

---

## Handling user turns in an exquisite cadaver workshop

### Principles : we use FIFO
```sql
ORDER BY joined_at ASC
WHERE state = 'waiting'
```
### Database

- TABLE exquisite_corpse_participants

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


- FLOW
1) User joins workshop => creation of a new row
2) It's user's turn => status becomes "active"
2) User times out when it's their turn (according to turn_deadline) -> status becomes "timed_out" and new row with new joined_at is created, with status "waiting".
3) User submits -> status becomes "done", if they choose to replay, a new row is created with status "waiting"
4) When workshop closes, all row for this workshop_id are deleted. We set the writing_workshop status to "CLOSED" and use on delete cascade feature.

---

## Push notifs and deep linking