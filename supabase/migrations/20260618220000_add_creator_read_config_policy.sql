-- Authenticated users creating a PRIVATE workshop hit RLS 42501 on the RETURNING
-- of `insert(config).select(...)`: the only readable-config policies are the
-- anon read (anon-only) and the public-visibility read, so an authenticated
-- creator can't read back their own private config. Mirror the existing update
-- policy so a creator can read the config of workshops they own.

create policy "Creator can read their config"
on exquisite_corpse_config for select
using (
    workshop_id in (
        select id from writing_workshops where created_by = auth.uid()
    )
);
