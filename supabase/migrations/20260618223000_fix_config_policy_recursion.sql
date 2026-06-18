-- Fix infinite recursion (42P17) from the previous "Creator can read their config"
-- policy: its subquery on writing_workshops re-triggered writing_workshops' SELECT
-- policies, which read exquisite_corpse_config, looping back into this policy.
--
-- A SECURITY DEFINER function bypasses RLS inside its body, so the ownership check
-- no longer re-enters writing_workshops' policies and the cycle is broken.

drop policy if exists "Creator can read their config" on exquisite_corpse_config;

create or replace function public.is_workshop_creator(wid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
    select exists (
        select 1 from writing_workshops
        where id = wid and created_by = auth.uid()
    );
$$;

create policy "Creator can read their config"
on exquisite_corpse_config for select
using (is_workshop_creator(workshop_id));
