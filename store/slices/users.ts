import { Profile } from '@/services/supabase/profiles'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@supabase/supabase-js'
import * as Crypto from 'expo-crypto'
import { StateCreator } from 'zustand'
import type { AppStore } from '../useAppStore'

export type UsersSlice = {
    // guestId / userId left loose for now: workshop screens pass them to helpers
    // that expect `string`, so tightening them to `string | null` needs those
    // call sites to handle null first. Out of scope for the auth work.
    guestId: any
    userId: any
    user: User | null
    profile: Profile | null
    isAuthLoading: boolean
    initializeGuestId: () => Promise<void>
    setUser: (user: User | null) => Promise<void>
    setProfile: (profile: Profile | null) => void
    setAuthLoading: (isAuthLoading: boolean) => void
}

export const createUsersSlice: StateCreator<AppStore, [], [], UsersSlice> = (set) => ({
    guestId: null,
    userId: null,
    user: null,
    profile: null,
    isAuthLoading: true,
    initializeGuestId: async () => {
        let id = await AsyncStorage.getItem('guest_id')
        if (!id) {
            id = Crypto.randomUUID()
            await AsyncStorage.setItem('guest_id', id)
        }
        set({ guestId: id })
    },
    setUser: async (user: User | null) => {
        set({ user: user})
    },
    setProfile: (profile: Profile | null) => {
        set({ profile })
    },
    setAuthLoading: (isAuthLoading: boolean) => {
        set({ isAuthLoading })
    }
}
)