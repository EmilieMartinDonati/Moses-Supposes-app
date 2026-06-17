CREATE OR REPLACE FUNCTION handle_timedout_participants()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    r record;
BEGIN
    -- Time out every active participant whose deadline has passed, in one atomic
    -- UPDATE. If a concurrent submit_contribution commits 'done' first
    -- this UPDATE re-evaluates and skips the row
    -- because we want to avoid that state can be timed_out after being done.
    FOR r IN
        UPDATE public.exquisite_corpse_participants
        SET state = 'timed_out'
        WHERE state = 'active'
          AND turn_deadline <= now()
        RETURNING workshop_id
    LOOP
        PERFORM public.assign_next_turn(r.workshop_id);
    END LOOP;
END;
$$;

-- '15 seconds' scheduling works bc pg_cron >= 1.5.
SELECT cron.schedule(
    'handle_timedout_exquisite_corpse_participants',
    '15 seconds',
    'SELECT handle_timedout_participants()'
);
