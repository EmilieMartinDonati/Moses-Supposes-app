CREATE OR REPLACE FUNCTION get_exquisite_corpse_ticket(
    p_workshop_id uuid,
    p_user_id uuid,
    p_guest_id uuid
)
RETURNS public.exquisite_corpse_participants
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    last_cycle   integer;
    new_cycle    integer;
    v_id         uuid;
    v_participant public.exquisite_corpse_participants;
BEGIN

    PERFORM pg_advisory_xact_lock(hashtextextended(p_workshop_id::text, 0));

    SELECT * INTO v_participant
    FROM public.exquisite_corpse_participants
    WHERE workshop_id = p_workshop_id
      AND state IN ('waiting', 'active')
      AND ( (p_user_id IS NOT NULL AND user_id = p_user_id)
         OR (p_guest_id IS NOT NULL AND guest_id = p_guest_id) )
    ORDER BY joined_at ASC
    LIMIT 1;

    IF FOUND THEN
        RETURN v_participant;
    END IF;


    SELECT cycle INTO last_cycle
    FROM public.exquisite_corpse_participants
    WHERE workshop_id = p_workshop_id
      AND state IN ('done', 'timed_out')
      AND ( (p_user_id IS NOT NULL AND user_id = p_user_id)
         OR (p_guest_id IS NOT NULL AND guest_id = p_guest_id) )
    ORDER BY cycle DESC
    LIMIT 1;

    IF last_cycle IS NULL THEN
        new_cycle := 0;
    ELSE
        new_cycle := last_cycle + 1;
    END IF;

    INSERT INTO public.exquisite_corpse_participants (
        workshop_id, state, participant_id, cycle, user_id, guest_id
    )
    VALUES (
        p_workshop_id, 'waiting', gen_random_uuid(), new_cycle, p_user_id, p_guest_id
    )
    RETURNING id INTO v_id;

    PERFORM public.assign_next_turn(p_workshop_id);

    SELECT * INTO v_participant
    FROM public.exquisite_corpse_participants
    WHERE id = v_id;

    RETURN v_participant;
END;
$$;