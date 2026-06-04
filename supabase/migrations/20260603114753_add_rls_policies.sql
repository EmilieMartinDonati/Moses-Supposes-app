-- enable RLS
alter table writing_workshops enable row level security;
alter table exquisite_corpse_config enable row level security;

-- writing_workshops policies
create policy "Anyone can read public workshops"
on writing_workshops for select
using (
    exists (
        select 1 from exquisite_corpse_config
        where workshop_id = writing_workshops.id
        and visibility = 'public'
    )
);

create policy "Creator can read their private workshops"
on writing_workshops for select
using (
    created_by = auth.uid() or
    creator_email = auth.email() or
    exists (
        select 1 from exquisite_corpse_config
        where workshop_id = writing_workshops.id
        and visibility = 'public'
    )
);

create policy "Anyone can create a workshop"
on writing_workshops for insert
with check (true);

create policy "Creator can update their workshop"
on writing_workshops for update
using (created_by = auth.uid());

create policy "Creator can delete their workshop"
on writing_workshops for delete
using (created_by = auth.uid());

-- exquisite_corpse_config policies
create policy "Anyone can read config of public workshops"
on exquisite_corpse_config for select
using (visibility = 'public');

create policy "Anyone can create config"
on exquisite_corpse_config for insert
with check (true);

create policy "Creator can update config"
on exquisite_corpse_config for update
using (
    workshop_id in (
        select id from writing_workshops where created_by = auth.uid()
    )
);