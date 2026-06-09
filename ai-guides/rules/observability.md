# Observability

Moses Supposes has no server, so we have no server logs to debug or audit
critical user actions. Our replacement is an **`events` table** in the
database that records what happened, when, and whether it succeeded.

This is both our **audit trail** and our **post-deploy debugger**.
(Tests are handled separately, in their own session.)

---

## The `events` table

A row is written for each critical action: who did it, on what, and the outcome.

Suggested shape (refine when we create the migration):

| column | meaning |
|---|---|
| `id` | uuid |
| `type` | event name, e.g. `"join_exquisite_corpse"` |
| `user_id` / `guest_id` | who triggered it |
| `workshop_id` | the target workshop |
| `status` | `"success"` or `"error"` |
| `detail` | error code/message when status is `error` |
| `_created_at` | timestamp |

---

## Where to write the event

**Inside the RPC** for atomic flows. The event row then commits or rolls
back *with* the action — we can never get "it logged but didn't happen"
or "it happened but didn't log".

```sql
-- inside an RPC, on the success path
INSERT INTO events (type, user_id, workshop_id, status)
VALUES ('join_exquisite_corpse', p_user_id, p_workshop_id, 'success');
```

For critical actions that are **not** RPCs, write the event from the
**action layer** instead (in the same `try` for success, in the `catch`
for failure).

---

## Critical actions to log first

Start with these two. Add others later as needed.

- **Join exquisite corpse** — getting a ticket + `assign_next_turn`.
- **Submit contribution** — `submit_contribution`.

---

## Why not just rely on tests?

Tests and logs cover different failure spaces:

- **Tests** catch *known* failures *before* deploy (logic, ordering, races we anticipate).
- **Events log** shows what *actually* happened with *real users* — the
  *unknown* failures and races that only appear under production load.

We need both eventually. The `events` table comes first because it is also
our audit trail and our only window into production.
