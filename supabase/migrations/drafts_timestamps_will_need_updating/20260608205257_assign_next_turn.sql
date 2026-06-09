CREATE OR REPLACE FUNCTION assign_next_turn(p_workshop_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
    next_participant_id uuid;
    found_writing_delay integer;
BEGIN

    -- 1. If someone is already active, do nothing
    IF EXISTS (
        SELECT 1
        FROM exquisite_corpse_participants
        WHERE workshop_id = p_workshop_id
          AND state = 'active'
    ) THEN
        RETURN;
    END IF;

    -- 2. Pick next eligible participant in FIFO order
    SELECT id
    INTO next_participant_id
    FROM exquisite_corpse_participants
    WHERE workshop_id = p_workshop_id
      AND state = 'waiting'
    ORDER BY joined_at ASC
    FOR UPDATE SKIP LOCKED
    LIMIT 1;

    -- 3. If no one is waiting, stop
    IF next_participant_id IS NULL THEN
        RETURN;
    END IF;

    -- 4. Get workshop config
    SELECT writing_delay
    INTO found_writing_delay
    FROM exquisite_corpse_config
    WHERE workshop_id = p_workshop_id
    LIMIT 1;

    -- fallback safety
    IF found_writing_delay IS NULL THEN
        found_writing_delay := 120;
    END IF;

    -- 5. Promote participant to active
    UPDATE exquisite_corpse_participants
    SET state = 'active',
        turn_started_at = now(),
        turn_deadline = now() + (found_writing_delay * interval '1 second')
    WHERE id = next_participant_id;

END;
$$;

