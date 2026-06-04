CREATE POLICY "Anon can read workshops"
ON writing_workshops FOR SELECT
TO anon
USING (true);