import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="signin" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="role-selection" />
      <Stack.Screen name="callback" />
      <Stack.Screen name="oauth-callback" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
}