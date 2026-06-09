BEGIN;

INSERT INTO segments (
  workshop_id,
  participant_id,
  user_id,
  guest_id,
  display_name,
  avatar_seed,
  content,
  status,
  visibility
)
VALUES (
  p_workshop_id,
  p_participant_id,
  p_user_id,
  p_guest_id,
  p_display_name,
  p_avatar_seed,
  p_content,
  'submitted',
  'public'
);

UPDATE exquisite_corpse_participants
SET state = 'done'
WHERE id = p_participant_id;

PERFORM assign_next_turn(p_workshop_id);

COMMIT;
