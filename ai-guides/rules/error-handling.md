# Error Handling

Moses Supposes has no backend. Error handling lives in **three layers**:

1. **Services** (`services/supabase/*`) — raw Supabase calls. Return `{ data, error }`. Never throw, log, or wrap.
2. **Action helpers** (`actions/*`) — orchestration. On a service `error`, `throw new ActionError(...)`. No `try/catch` — let it propagate.
3. **Entry action** (user-triggered) — the single `try/catch`. Shows the message and logs the event.

Golden rule: **throw or handle — never swallow.**

---

## Layer 1 — Services

Thin, dumb, single-purpose. One service function = one Supabase call.

Rules:
- Return the native Supabase `{ data, error }`.
- **Never** `try/catch`, **never** `console.error`, **never** wrap or return `null`/`undefined` to hide an error.
- **Never** chain calls. Chaining belongs in an action or an RPC.

```ts
// services/supabase/profiles.ts
export const getProfile = ({ id }: { id: string }) =>
    supabase.from("profiles").select("*").eq("id", id).maybeSingle()
// returns { data, error }
```

---

## False errors (`.maybeSingle()` vs `.single()`)

A *false error* is a normal, expected outcome that the query reports as an
`error`. The classic case: "no row found" when no row is the correct answer
(a first-time user, an empty history). Forcing the action to handle that as a
failure is wrong — it isn't one.

`.single()` treats 0 rows as an error. `.maybeSingle()` treats 0 rows as
`data: null` and only errors on a *real* problem (e.g. >1 row, a DB fault).

| rows | `.single()` | `.maybeSingle()` |
|---|---|---|
| 0 | `error` | `data: null` |
| 1 | `data` | `data` |
| >1 | `error` | `error` |

Use `.single()` only when a missing row genuinely *is* an error. When absence
is a valid result, use `.maybeSingle()` so the action branches on `data`, not
on a fake error.

```ts
// "have they participated before?" — no row is a valid answer, not an error
export const getLastExquisiteCorpseParticipationFromUser = ({ ... }) =>
    supabase.from("exquisite_corpse_participants").select("*")
        .eq(...).or(...).order(...).limit(1).maybeSingle()
```

---

## Layer 2 — Action helpers

Orchestration functions: they chain services and business logic for an entry
action. They are **not** directly user-triggered.

Rules:
- **No `try/catch`.** Let errors propagate to the entry action.
- Check each service's `error`; on failure, `throw new ActionError(...)`.
- Return plain data on success — no `{ data, error }` re-wrapping.

```ts
const { data, error } = await insertExquisiteCorpseParticipant({ payload })
if (error) throw new ActionError("insert_participant", "Impossible de rejoindre l'atelier", { cause: error })
return data
```

---

## ActionError

The wrapping happens **here, in the helper** — not in the service. The service
is generic and doesn't know the business "stage" or the user message; the
caller does.

`ActionError` carries three things:
- `stage` — where in the chain it broke (for logging).
- `userMessage` — what to show the user.
- `cause` — the original Supabase error (`code`, `message`) for the events table.

```ts
// actions/errors.ts
export class ActionError extends Error {
    constructor(
        public stage: string,
        public userMessage: string,
        options?: { cause?: unknown }
    ) {
        super(stage, options)
        this.name = "ActionError"
    }
}
```

---

## Layer 3 — Entry action

The user boundary — one per user gesture. The **only** place with a
`try/catch`. The `catch`:
- shows `e.userMessage` (snackbar / inline alert),
- logs `e.stage` + `e.cause` (→ events table, see `observability.md`).

```ts
// actions/writingWorkshops.ts
try {
    await getExquisiteCorpseTicket({ workshopId })   // helpers throw; we don't check
    NavigationActions.goToSingleWorkshopView(workshopId)
} catch (e) {
    if (e instanceof ActionError) {
        console.error(`[${e.stage}]`, e.cause)   // → log / events table
        // showSnackbar(e.userMessage)
    } else {
        console.error("Unexpected error joining workshop", e)
        // showSnackbar("Une erreur est survenue")
    }
}
```

---

## Two kinds of error → two destinations

| Error | Example | Shown to user |
|---|---|---|
| **Expected / actionable** | wrong password, session full, missing field | translated message in snackbar/alert |
| **Unexpected** | RPC race, constraint violation, network blip | generic "something went wrong" message |

Every failure shows the user *something*. The diagnostic detail of the
unexpected ones goes to the audit log — see `observability.md`.

---

## Composite logic & RPCs

When logic needs several DB calls, it does **not** go in a service. It goes:

- in an **action helper** (chain thin services — Layer 2), or
- in an **RPC** (when the steps must be atomic — e.g. join, submit).

A plpgsql function is already one transaction: if any statement raises,
Postgres rolls the whole thing back. So RPCs do **not** need a generic
`try/catch`. Add an `EXCEPTION` block only to:

- write a failure row to the `events` table (see `observability.md`), or
- raise a friendly code: `RAISE EXCEPTION '...' USING ERRCODE = '...'`.
