CREATE TABLE profiles(
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_optin boolean DEFAULT false
);