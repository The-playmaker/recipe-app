import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Clock, ChefHat } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { Recipe } from '@/hooks/useRecipes';
import { router } from 'expo-router';
import { db } from '@/lib/firebase.native';
import { collection, query, where, getDocs, documentId } from 'firebase/firestore';
import { useTheme } from '@/hooks/useTheme'; // Importerer theme-hooken

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  const { colors } = useTheme(); // Henter farger
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (favoritesLoading) {
      return;
    }
    const fetchFavoriteRecipes = async () => {
      if (favorites.size === 0) {
        setFavoriteRecipes([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const favoriteIds = Array.from(favorites);
        const recipesRef = collection(db, 'drinks');
        const q = query(recipesRef, where(documentId(), 'in', favoriteIds));
        const querySnapshot = await getDocs(q);
        const recipesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
        setFavoriteRecipes(recipesData);
      } catch (e) {
        console.error("Failed to fetch favorite recipes:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFavoriteRecipes();
  }, [favorites, favoritesLoading]);

  const dynamicStyles = StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.background },
      text: { color: colors.text },
      textSecondary: { color: colors.textSecondary },
      header: { borderBottomColor: colors.border },
      card: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: '#000' },
      emptyStateIcon: { color: colors.border },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{color: colors.textSecondary, marginTop: 10}}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.title, dynamicStyles.text]}>My Favorites</Text>
        <Text style={[styles.subtitle, dynamicStyles.textSecondary]}>You have {favoriteRecipes.length} favorite recipes</Text>
      </View>

      <ScrollView style={styles.recipesContainer} showsVerticalScrollIndicator={false}>
        {favoriteRecipes.length > 0 ? (
          <View style={styles.recipesGrid}>
            {favoriteRecipes.map((recipe) => (
              <TouchableOpacity key={recipe.id} style={[styles.recipeCard, dynamicStyles.card]} onPress={() => router.push(`/recipe/${recipe.id}`)}>
                <View style={styles.recipeImageContainer}>
                  <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                  <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(recipe.id)}>
                    <Heart size={18} color={'#DC2626'} fill={'#DC2626'} />
                  </TouchableOpacity>
                </View>
                <View style={styles.recipeContent}>
                  <Text style={[styles.recipeName, dynamicStyles.text]} numberOfLines={1}>{recipe.name}</Text>
                  <Text style={styles.recipeCategory}>{recipe.category}</Text>
                  <View style={[styles.recipeMeta, {borderTopColor: colors.border}]}>
                    <View style={styles.recipeMetaItem}><Clock size={14} color={colors.textSecondary} /><Text style={[styles.recipeMetaText, dynamicStyles.textSecondary]}>{recipe.time}</Text></View>
                    <View style={styles.recipeMetaItem}><ChefHat size={14} color={colors.textSecondary} /><Text style={[styles.recipeMetaText, dynamicStyles.textSecondary]}>{recipe.difficulty}</Text></View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Heart size={48} style={dynamicStyles.emptyStateIcon} />
            <Text style={[styles.emptyStateText, dynamicStyles.text]}>No Favorites Yet</Text>
            <Text style={[styles.emptyStateSubtext, dynamicStyles.textSecondary]}>
              Tap the heart icon on a recipe to add it to your favorites.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { padding: 24, paddingTop: 16, borderBottomWidth: 1, },
    title: { fontSize: isTablet ? 32 : 28, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: isTablet ? 18 : 16 },
    recipesContainer: { flex: 1 },
    recipesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 24 },
    recipeCard: { borderRadius: 16, width: isTablet ? (width - 72) / 3 : (width - 64) / 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1 },
    recipeImageContainer: { position: 'relative' },
    recipeImage: { width: '100%', height: 140, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    favoriteButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 6 },
    recipeContent: { padding: 12 },
    recipeName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
    recipeCategory: { fontSize: 11, fontWeight: '500', color: '#F59E0B', marginBottom: 8 },
    recipeMeta: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 8 },
    recipeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    recipeMetaText: { fontSize: 11 },
    emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, paddingTop: 100 },
    emptyStateText: { marginTop: 16, fontSize: 18, fontWeight: '600' },
    emptyStateSubtext: { marginTop: 8, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
