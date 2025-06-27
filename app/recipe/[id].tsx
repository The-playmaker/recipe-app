import { View, Text, StyleSheet, ScrollView, Image, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Clock, ChefHat, BarChart3, Edit } from 'lucide-react-native';
import { Recipe } from '@/hooks/useRecipes';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const recipeRef = doc(db, 'drinks', id);
        const docSnap = await getDoc(recipeRef);

        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() } as Recipe);
        } else {
          setError('Recipe not found.');
        }
      } catch (e) {
        setError('Failed to fetch recipe.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <SafeAreaView style={styles.centered}><ActivityIndicator size="large" color="#F59E0B" /></SafeAreaView>;
  }

  if (error || !recipe) {
    return <SafeAreaView style={styles.centered}><Text style={styles.errorText}>{error || 'Recipe could not be loaded.'}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen 
        options={{ 
          title: recipe.name,
          headerBackTitle: 'Back',
          // KORRIGERT: Bruker nå en standard TouchableOpacity som fungerer mer pålitelig i headeren.
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push(`/edit-recipe/${id}`)} style={{ padding: 5 }}>
              <Edit size={22} color="#F59E0B" style={{ marginRight: 10 }} />
            </TouchableOpacity>
          ),
        }} 
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.category}>{recipe.category.toUpperCase()}</Text>
          <Text style={styles.title}>{recipe.name}</Text>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}><Clock size={16} color="#6B7280" /><Text style={styles.metaText}>{recipe.time}</Text></View>
            <View style={styles.metaItem}><ChefHat size={16} color="#6B7280" /><Text style={styles.metaText}>{recipe.difficulty}</Text></View>
            <View style={styles.metaItem}><BarChart3 size={16} color="#6B7280" /><Text style={styles.metaText}>{recipe.ingredients.length} ingredients</Text></View>
          </View>

          <Text style={styles.description}>{recipe.description}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {recipe.ingredients.map((ingredient, index) => (
              <Text key={index} style={styles.listItem}>• {ingredient}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {recipe.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.stepNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#DC2626' },
  image: { width: '100%', height: isTablet ? 400 : 250 },
  contentContainer: { padding: 24 },
  category: { fontSize: 12, fontWeight: 'bold', color: '#F59E0B', marginBottom: 8, letterSpacing: 1 },
  title: { fontSize: isTablet ? 36 : 28, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  metaContainer: { flexDirection: 'row', gap: 24, marginBottom: 20, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 14, color: '#6B7280' },
  description: { fontSize: 16, color: '#374151', lineHeight: 24, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: '600', color: '#111827', marginBottom: 16 },
  listItem: { fontSize: 16, color: '#374151', marginBottom: 8, lineHeight: 22 },
  instructionItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 16 },
  stepNumber: { fontSize: 18, fontWeight: 'bold', color: '#F59E0B', width: 24 },
  instructionText: { flex: 1, fontSize: 16, color: '#374151', lineHeight: 24 },
});
