import { Stack } from 'expo-router';
import { ThemeProvider } from '@/hooks/useTheme';

// Denne komponenten er nå roten av hele appen din.
// ThemeProvider her sørger for at alle sider under får tilgang til temaet.
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
