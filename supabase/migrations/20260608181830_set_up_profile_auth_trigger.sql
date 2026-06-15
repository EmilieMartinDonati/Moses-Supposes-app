create or replace function public.create_profile()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email_optin)
  values (
    new.id,
    coalesce(
      (new.raw_user_meta_data->>'email_optin')::boolean,
      false
    )
  );

  return new;
end;
$$;

create trigger create_profile_trigger
after insert on auth.users
for each row
execute function public.create_profile();

/** careful here, must be changed with the new created_at and updated_at fields !