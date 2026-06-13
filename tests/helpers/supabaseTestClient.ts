import { createClient } from "@supabase/supabase-js"

// Node-safe Supabase client for integration tests.
// No React Native imports (no AsyncStorage / AppState), and it uses the
// service_role key so seeds bypass RLS and can hit auth.admin.* APIs.
const url = process.env.SUPABASE_TEST_URL
const serviceRoleKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
    throw new Error(
        "Missing SUPABASE_TEST_URL / SUPABASE_TEST_SERVICE_ROLE_KEY.\n" +
        "Run `supabase start`, then copy the API URL + service_role key into .env.test"
    )
}

export const supabase = createClient(url, serviceRoleKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
})
