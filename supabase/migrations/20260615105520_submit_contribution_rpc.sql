CREATE OR REPLACE FUNCTION submit_contribution(
  p_workshop_id uuid,
  p_content text,
  p_state text,
  p_display_name text,
  p_avatar_seed text,
  p_user_id uuid DEFAULT NULL,
  p_guest_id uuid DEFAULT NULL,
  p_participant_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$

DECLARE
  v_participant_state text;

BEGIN

IF p_participant_id IS NOT NULL THEN
  SELECT state INTO v_participant_state
  FROM public.exquisite_corpse_participants
  WHERE id = p_participant_id;

  IF v_participant_state IS DISTINCT FROM 'active' THEN
    RAISE EXCEPTION 'Participant is not active (state: %)', v_participant_state;
  END IF;
END IF;

INSERT INTO public.contributions (
  workshop_id,
  participant_id,
  user_id,
  guest_id,
  display_name,
  avatar_seed,
  content,
  state
)
VALUES (
  p_workshop_id,
  p_participant_id,
  p_user_id,
  p_guest_id,
  p_display_name,
  p_avatar_seed,
  p_content,
  p_state
);

IF p_participant_id IS NOT NULL THEN
    UPDATE public.exquisite_corpse_participants
    SET state = 'done'
    WHERE id = p_participant_id;

    PERFORM public.assign_next_turn(p_workshop_id);
END IF;

END;
$$;
