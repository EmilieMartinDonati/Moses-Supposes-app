CREATE OR REPLACE FUNCTION delete_participants()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    DELETE FROM public.exquisite_corpse_participants r
    WHERE r.workshop_id = NEW.id;

    RETURN NULL;
END;
$$;

CREATE TRIGGER delete_participants_trigger
AFTER UPDATE OF status ON public.writing_workshops
FOR EACH ROW
WHEN (NEW.status = 'closed' AND OLD.status IS DISTINCT FROM 'closed')
EXECUTE FUNCTION delete_participants();