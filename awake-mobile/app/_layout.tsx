import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { Colors } from '@/lib/tokens'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.background },
          headerShadowVisible: false,
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { fontWeight: '600', color: Colors.textPrimary },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" redirect />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="send" options={{ title: 'Send Money', presentation: 'modal' }} />
        <Stack.Screen name="receive" options={{ title: 'Receive', presentation: 'modal' }} />
        <Stack.Screen name="savings" options={{ title: 'Smart Savings' }} />
        <Stack.Screen name="convert" options={{ title: 'Convert' }} />
        <Stack.Screen name="card" options={{ title: 'My Card' }} />
        <Stack.Screen name="transactions" options={{ title: 'Transactions' }} />
        <Stack.Screen name="support" options={{ title: 'Support Center' }} />
      </Stack>
    </SafeAreaProvider>
  )
}
