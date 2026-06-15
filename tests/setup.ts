import { vi } from "vitest"

// Replace the React-Native supabase client (imports react-native / AsyncStorage,
// which can't be parsed/loaded in Node) with the node-safe service-role client.
// vi.mock keys on the RESOLVED module, so both `@/services/supabase/client`
// and the relative `./client` import inside the services folder are covered.
vi.mock("@/services/supabase/client", async () => {
    const { supabase } = await import("./helpers/supabaseTestClient")
    return { supabase }
})

// expo-crypto is a native module; map randomUUID to Node's global crypto.
vi.mock("expo-crypto", () => ({
    randomUUID: () => crypto.randomUUID(),
}))

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: { getItem: vi.fn(), setItem: vi.fn(), removeItem: vi.fn() },
}))