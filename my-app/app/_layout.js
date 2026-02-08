import AuthContextProvider from '../context/AuthContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* This stays here so the app knows where to go */}
      </Stack>
    </AuthContextProvider>
  );
}