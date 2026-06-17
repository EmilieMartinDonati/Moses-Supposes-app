# Concurrency (General rules) 🔒

A transaction (`BEGIN/COMMIT`) guarantees **atomicity** — but on its own it does *not* stop concurrent calls from racing. Atomicity and races are two different problems with two different tools.

## 1. Atomicity → `BEGIN/COMMIT` ⚛️

Everything between `BEGIN` and `COMMIT` either *all* succeeds or *nothing* happens. If any step throws, the whole block rolls back.

**Bank analogy 🏦** — a transfer debits account A and credits account B. We must never debit A without crediting B. Wrap both in a transaction: if the credit fails, the debit is undone too.

**In our app** — `submit_contribution` does three writes in one go:

```sql
-- 20260615105520_submit_contribution_rpc.sql
INSERT INTO contributions (...);                       -- 1. save the text
UPDATE exquisite_corpse_participants SET state='done'; -- 2. mark participant done
PERFORM assign_next_turn(p_workshop_id);               -- 3. promote next player
```

If step 3 throws, steps 1 and 2 roll back too. We never end up with "contribution saved, but nobody promoted to the next turn." 👌

> A plpgsql function joins the caller's transaction — it doesn't open its own. So a failure deep inside `assign_next_turn` rolls back the work `submit_contribution` did before calling it.

## 2. Races → locking 🏃‍♀️🏃

A transaction does **not** prevent two simultaneous calls from both reading "nothing there" and both acting. For that you lock. Which lock depends on **whether the row you're protecting already exists.**

### a. Locking an existing row → `FOR UPDATE`

Use when you know *which* row you're protecting.

**In our app** — a user double-taps "submit". Two calls fire. `submit_contribution` reads the participant row `FOR UPDATE`:

```sql
-- 20260617120749_lock_participant_row_in_submit_contribution.sql
SELECT state INTO v_participant_state
FROM exquisite_corpse_participants
WHERE id = p_participant_id
FOR UPDATE;                                  -- 🔒 second call waits here

IF v_participant_state IS DISTINCT FROM 'active' THEN
  RAISE EXCEPTION 'Participant is not active';
END IF;
```

The second call **blocks** until the first commits, then re-reads the row, sees `done`, and the guard aborts it. ✋ One contribution, not two.

### b. Locking when there's no row yet → `pg_advisory_xact_lock` #️⃣

Use when there's **no single row to grab** — you're inserting a *new* row, or guarding an *existence* check over a set. You invent a key (a hash of the workshop id) and serialize callers on it.

**In our app** — `assign_next_turn` asks *"is anyone already active?"*. That's a question about a **set**, not a known row, so `FOR UPDATE` has nothing to point at:

```sql
-- 20260609205257_assign_next_turn.sql
PERFORM pg_advisory_xact_lock(hashtextextended(p_workshop_id::text, 0)); -- 🔒 per workshop

IF EXISTS (SELECT 1 FROM exquisite_corpse_participants
           WHERE workshop_id = p_workshop_id AND state = 'active')
THEN RETURN; END IF;
-- ... otherwise promote the next waiting participant
```

Two players joining at the exact same millisecond get serialized: the second waits, re-checks, and sees someone is already active. ✋ One active player per workshop.

> Same shape applies to **getting an entry ticket**: we insert the *first* ticket, so there's no row to `FOR UPDATE` → advisory lock (or a unique index) is the fix.

## Cheat sheet 🧠

| Problem | Tool |
|---|---|
| Several writes must all-or-nothing | `BEGIN/COMMIT` ⚛️ |
| Race on a row you can point to by id | `SELECT ... FOR UPDATE` + state guard 🔒 |
| Race on a new row or an existence check | `pg_advisory_xact_lock` (or a unique index) #️⃣ |
