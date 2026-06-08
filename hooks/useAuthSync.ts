import { supabase } from "@/services/supabase/client";
import { getProfile } from "@/services/supabase/profiles";
import { useAppStore } from '@/store/useAppStore';
import { User } from "@supabase/supabase-js";
import { useEffect } from "react";


/** Side-effect-only: loads the initial session/profile and keeps the store in
 sync with auth changes. Mount exactly once (root layout) — calling it in more
than one place would create duplicate onAuthStateChange subscriptions. **/
export default function useAuthSync() {

  const { initializeGuestId, deleteGuestId, setUser, setProfile, setAuthLoading } = useAppStore()

  useEffect(() => {

    const loadProfile = async (userId: string | undefined) => {
      if (!userId) {
        setProfile(null)
        return
      }
      const profile = await getProfile({ id: userId })
      setProfile(profile)
    }

    const loadGuestId = async (user: User | undefined) => {
      if (!user) {
        initializeGuestId()
      }
      // careful here we don't delete guest_id because it may be used in some exquisite_corpse_participants waiting or active rows!
      // We'll do a transaction to update them
    }

    // initialize
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // load user in app
      setUser(session?.user ?? null)
      // load profile in app
      await loadProfile(session?.user?.id)
      // if no user use guest_id for workshops
      await loadGuestId(session?.user)
      // clear
      setAuthLoading(false)
    })

    // subscribe to changes (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Defer Supabase calls: this callback runs while the auth lock (processLock)
      // is held, so querying directly here can deadlock.
      setTimeout(() => {
        // load profile in app
        loadProfile(session?.user?.id)
        // if no user use guest_id for workshops
        loadGuestId(session?.user)
      }, 0)
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [])
}