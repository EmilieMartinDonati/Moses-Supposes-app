import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { supabase } from '@/services/supabase/client';
import { getProfile } from '@/services/supabase/profiles';
import { useAppStore } from '@/store/useAppStore';
import { useEffect } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const { initializeGuestId, setUser, setProfile, setAuthLoading } = useAppStore()

  useEffect(() => {
    initializeGuestId()
  }, [])

  useEffect(() => {
    const loadProfile = async (userId: string | undefined) => {
      setProfile(userId ? await getProfile({ id: userId }) : null)
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null)
      await loadProfile(session?.user?.id)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      // Defer Supabase calls: this callback runs while the auth lock (processLock)
      // is held, so querying directly here can deadlock.
      setTimeout(() => { loadProfile(session?.user?.id) }, 0)
    })

    return () => subscription.unsubscribe()
  }, [])


  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.light.mainBeige } }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
