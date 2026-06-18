CREATE OR REPLACE FUNCTION handle_workshops_to_close()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.writing_workshops w
    SET status = 'closed'
    FROM public.exquisite_corpse_config c
    WHERE c.workshop_id = w.id
      AND c.visibility = 'public'
      AND now() >= c.end_time
      AND w.status = 'published';
END;
$$;

-- Run every 20 minutes
SELECT cron.schedule(
    'close_workshops',
    '*/20 * * * *',
    'SELECT handle_workshops_to_close()'
);