-- in your migration file, replace the policy:
DROP POLICY IF EXISTS "Anyone can create a workshop" ON writing_workshops;

CREATE POLICY "Anyone can create a workshop"
ON writing_workshops FOR INSERT
TO anon, authenticated
WITH CHECK (true);