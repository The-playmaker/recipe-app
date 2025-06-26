import { Stack } from 'expo-router';
import { useFonts as useExpoFonts } from 'expo-font';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useExpoFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading fonts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (fontError) {
    console.error('Font loading error:', fontError);
    return (
      <SafeAreaView>
        <View>
          <Text>Error loading fonts: {fontError.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="drink/[id]" options={{ title: 'Drink Details' }} />
      <Stack.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Stack.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Stack>
  );
}