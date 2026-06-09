create extension if not exists moddatetime schema extensions;

alter table profiles add column created_at timestamptz;
update profiles p set created_at = u.created_at
    from auth.users u where u.id = p.id;
alter table profiles alter column created_at set not null,
                     alter column created_at set default now();

alter table profiles add column updated_at timestamptz;
update profiles set updated_at = created_at;
alter table profiles alter column updated_at set not null,
                     alter column updated_at set default now();

alter table writing_workshops add column updated_at timestamptz;
update writing_workshops set updated_at = created_at;
alter table writing_workshops alter column updated_at set not null,
                              alter column updated_at set default now();

alter table exquisite_corpse_participants add column updated_at timestamptz;
update exquisite_corpse_participants set updated_at = joined_at;
alter table exquisite_corpse_participants alter column updated_at set not null,
                                          alter column updated_at set default now();

create trigger handle_updated_at before update on profiles
    for each row execute function extensions.moddatetime(updated_at);

create trigger handle_updated_at before update on writing_workshops
    for each row execute function extensions.moddatetime(updated_at);

create trigger handle_updated_at before update on exquisite_corpse_participants
    for each row execute function extensions.moddatetime(updated_at);



