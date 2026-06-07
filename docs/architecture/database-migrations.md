#  Migrations (Production Guide)

We use the Supabase CLI to manage database migrations.  
All migrations are stored in `supabase/migrations` and are applied in order.

This guide describes safe, production-ready patterns for schema changes.

---

# Golden Rules

- Never modify the database directly in the Supabase dashboard (except emergencies)
- Never edit migrations that have already been applied in shared environments
- Always create new migrations for schema changes
- Prefer backward-compatible changes
- Use multi-step migrations for breaking changes (expand → migrate → contract)
- Test locally before deploying

---

# Standard Workflow

## 1. Create a migration file

```bash
supabase migration new descriptive_name
```

this will create a new file in supabase/migrations/<timestamp>_your_migration_name.sql

## 2. Edit the generated file

Example :
```sql
ALTER TABLE users ADD COLUMN is_active boolean DEFAULT true;
```

## 3. Test locally

```bash
supabase start
supabase db reset
```

## 4. Deploy to production

```bash
supabase link --project-ref <project_ref>
supabase db push
```

# 🧠 Safe Migration Patterns

## ➕ 1. Add a column (safe)

```sql
ALTER TABLE users ADD COLUMN is_active boolean DEFAULT true;
```

**Why it is safe:**
- Backward compatible
- Existing rows automatically get default value

**TODO:**
- [ ] Add column
- [ ] Update backend usage
- [ ] Backfill data if needed
- [ ] Deploy migration

---

## ✏️ 2. Rename a column (safe approach)

Avoid direct rename in production.

**Step 1 — Add new column**
```sql
ALTER TABLE users ADD COLUMN full_name_new text;
```

**Step 2 — Backfill data**
```sql
UPDATE users SET full_name_new = full_name;
```

**Step 3 — Deploy application using new column**

**Step 4 — Drop old column (later migration)**
```sql
ALTER TABLE users DROP COLUMN full_name;
```

**Step 5 — Rename final column**
```sql
ALTER TABLE users RENAME COLUMN full_name_new TO full_name;
```

**TODO:**
- [ ] Add new column
- [ ] Backfill data
- [ ] Update application
- [ ] Remove old column later

---

## 🔁 3. Move a field to another table

_Example: `users.company_name` → `companies` table_

**Step 1 — Create new table**
```sql
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text
);
```

**Step 2 — Add reference column**
```sql
ALTER TABLE users ADD COLUMN company_id uuid;
```

**Step 3 — Backfill data**
```sql
INSERT INTO companies (name)
SELECT DISTINCT company_name FROM users;
```

```sql
UPDATE users u
SET company_id = c.id
FROM companies c
WHERE u.company_name = c.name;
```

**Step 4 — Update application to use `company_id`**

**Step 5 — Remove old column (later migration)**
```sql
ALTER TABLE users DROP COLUMN company_name;
```

**TODO:**
- [ ] Create target table
- [ ] Add relation column
- [ ] Backfill data
- [ ] Update application
- [ ] Drop old column later

---

## 🔒 4. Add constraint (careful)

_Example: unique email_

```sql
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

> ⚠️ **Risk:** May fail if duplicates exist.

**Safe approach:**

**Step 1 — Clean data**
```sql
DELETE FROM users a
USING users b
WHERE a.id < b.id
AND a.email = b.email;
```

**Step 2 — Add constraint**
```sql
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

**TODO:**
- [ ] Validate data
- [ ] Clean duplicates
- [ ] Add constraint
- [ ] Monitor production

---

## 🧨 5. Remove column (dangerous)

```sql
ALTER TABLE users DROP COLUMN age;
```

> ⚠️ **This is destructive:**
> - Data is permanently deleted
> - Cannot be recovered unless backed up

**Safe production pattern:**

**Step 1 — Rename column to signal deprecation**
```sql
ALTER TABLE users RENAME COLUMN age TO age_deprecated;
```

This makes the intent visible to the team and surfaces any remaining usages in the codebase before data is lost.

**Step 2 — Remove usage in application**

**Step 3 — Deploy application update**

**Step 4 — Wait for rollout**

**Step 5 — Drop column in a separate migration**
```sql
ALTER TABLE users DROP COLUMN age_deprecated;
```

**TODO:**
- [ ] Rename column to `age_deprecated`
- [ ] Remove field from code
- [ ] Deploy app
- [ ] Wait for rollout
- [ ] Drop column safely
