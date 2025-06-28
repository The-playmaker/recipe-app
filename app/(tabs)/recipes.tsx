import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Clock, ChefHat, Heart, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRecipes, Recipe } from '@/hooks/useRecipes';
import { useFavorites } from '@/hooks/useFavorites';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/useTheme'; // Importerer theme-hooken

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categories = ['All', 'Cocktail', 'Mocktail', 'Coffee', 'Coffee Cocktail', 'Beer', 'Wine', 'Spirits', 'Hot Drinks'];

export default function RecipesScreen() {
  const { colors } = useTheme(); // Henter farger for Dark Mode
  const { category: initialCategory } = useLocalSearchParams<{ category: string }>();
  const { recipes, loading, error, deleteRecipe, fetchRecipes } = useRecipes();
  const { favorites, toggleFavorite, loading: favoritesLoading } = useFavorites();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    fetchRecipes(selectedCategory);
  }, [selectedCategory, fetchRecipes]);

  const filteredRecipes = recipes.filter((recipe: Recipe) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesIngredients = recipe.ingredients?.some(ing => ing.toLowerCase().includes(searchLower)) || false;
    return recipe.name.toLowerCase().includes(searchLower) || matchesIngredients;
  });

  const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
    Alert.alert('Delete Recipe', `Are you sure you want to delete "${recipeName}"?`, [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => deleteRecipe(recipeId) }]);
  };

  // Lager dynamiske stiler som endrer seg med temaet
  const dynamicStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    loadingText: { color: colors.textSecondary },
    errorText: { color: '#DC2626' },
    errorSubtext: { color: colors.textSecondary },
    header: { borderBottomColor: colors.border },
    title: { color: colors.text },
    subtitle: { color: colors.textSecondary },
    searchBar: { backgroundColor: colors.card, borderColor: colors.border },
    searchInput: { color: colors.text },
    categoriesContainer: { borderBottomColor: colors.border },
    categoryChip: { backgroundColor: colors.card, borderColor: colors.border },
    categoryChipText: { color: colors.textSecondary },
    categoryChipTextActive: { color: '#FFFFFF' },
    recipeCard: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: '#000' },
    recipeName: { color: colors.text },
    recipeDescription: { color: colors.textSecondary },
    recipeMeta: { borderTopColor: colors.border },
    recipeMetaText: { color: colors.textSecondary },
    ingredientsCount: { color: colors.textSecondary, borderTopColor: colors.border },
    emptyStateText: { color: colors.textSecondary },
    emptyStateSubtext: { color: colors.textSecondary }
  });

  if (loading || favoritesLoading) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, dynamicStyles.loadingText]}>Loading recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, dynamicStyles.errorText]}>Error: {error}</Text>
          <Text style={[styles.errorSubtext, dynamicStyles.errorSubtext]}>Please check your connection and index.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.title, dynamicStyles.title]}>Recipe Collection</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>{filteredRecipes.length} recipes available</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, dynamicStyles.searchBar]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput style={[styles.searchInput, dynamicStyles.searchInput]} placeholder="Search recipes or ingredients..." value={searchQuery} onChangeText={setSearchQuery} placeholderTextColor={colors.textSecondary} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.categoriesContainer, dynamicStyles.categoriesContainer]}>
        {categories.map((category) => (
          <TouchableOpacity key={category} style={[styles.categoryChip, dynamicStyles.categoryChip, selectedCategory === category && styles.categoryChipActive]} onPress={() => setSelectedCategory(category)}>
            <Text style={[styles.categoryChipText, selectedCategory === category ? dynamicStyles.categoryChipTextActive : dynamicStyles.categoryChipText]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.recipesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={[styles.recipeCard, dynamicStyles.recipeCard]} onPress={() => router.push(`/recipe/${recipe.id}`)}>
              <View style={styles.recipeImageContainer}>
                <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                <TouchableOpacity style={styles.favoriteButton} onPress={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}><Heart size={18} color={favorites.has(recipe.id) ? '#DC2626' : colors.textSecondary} fill={favorites.has(recipe.id) ? '#DC2626' : 'transparent'} /></TouchableOpacity>
                <View style={styles.actionButtons}><TouchableOpacity style={styles.actionButton} onPress={(e) => { e.stopPropagation(); router.push(`/edit-recipe/${recipe.id}`); }}><Edit size={16} color={colors.primary} /></TouchableOpacity><TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={(e) => { e.stopPropagation(); handleDeleteRecipe(recipe.id, recipe.name); }}><Trash2 size={16} color="#DC2626" /></TouchableOpacity></View>
              </View>
              <View style={styles.recipeContent}>
                <Text style={[styles.recipeName, dynamicStyles.recipeName]} numberOfLines={1}>{recipe.name}</Text>
                <Text style={styles.recipeCategory}>{recipe.category}</Text>
                <Text style={[styles.recipeDescription, dynamicStyles.recipeDescription]} numberOfLines={2}>{recipe.description}</Text>
                <View style={[styles.recipeMeta, dynamicStyles.recipeMeta]}><View style={styles.recipeMetaItem}><Clock size={14} color={colors.textSecondary} /><Text style={[styles.recipeMetaText, dynamicStyles.recipeMetaText]}>{recipe.time}</Text></View><View style={styles.recipeMetaItem}><ChefHat size={14} color={colors.textSecondary} /><Text style={[styles.recipeMetaText, dynamicStyles.recipeMetaText]}>{recipe.difficulty}</Text></View></View>
                <Text style={[styles.ingredientsCount, dynamicStyles.ingredientsCount]}>{recipe.ingredients?.length || 0} ingredients</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {filteredRecipes.length === 0 && !loading && (
          <View style={styles.emptyState}><Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>No recipes found</Text><Text style={[styles.emptyStateSubtext, dynamicStyles.emptyStateSubtext]}>Try adjusting your filters.</Text></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Generelle stiler som ikke avhenger av tema
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  header: { padding: 24, paddingTop: 16, borderBottomWidth: 1 },
  title: { fontSize: isTablet ? 32 : 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: isTablet ? 18 : 16 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, gap: 12, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, paddingVertical: 10 },
  categoriesContainer: { paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, flexGrow: 0 },
  categoryChip: { 
    borderRadius: 20, 
    paddingHorizontal: 12, // Endret fra 14
    paddingVertical: 6,    // Endret fra 7
    marginRight: 8,        // Endret fra 10
    borderWidth: 1 
  },
  categoryChipActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  categoryChipText: { 
    fontSize: 12,          // Endret fra 13
    fontWeight: '500' 
  },
  recipesContainer: { flex: 1 },
  recipesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 24 },
  recipeCard: { borderRadius: 16, width: isTablet ? (width - 72) / 3 : (width - 64) / 2, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1 },
  recipeImageContainer: { position: 'relative' },
  recipeImage: { width: '100%', height: 140, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  favoriteButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 20, padding: 6 },
  actionButtons: { position: 'absolute', bottom: 8, right: 8, flexDirection: 'row', gap: 8 },
  actionButton: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 16, padding: 6 },
  deleteButton: { backgroundColor: '#FEE2E2' },
  recipeContent: { padding: 12 },
  recipeName: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  recipeCategory: { fontSize: 11, fontWeight: '500', color: '#F59E0B', marginBottom: 8 },
  recipeDescription: { fontSize: 12, marginBottom: 8, lineHeight: 16, height: 32 },
  recipeMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, borderTopWidth: 1, paddingTop: 8 },
  recipeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  recipeMetaText: { fontSize: 11 },
  ingredientsCount: { fontSize: 11, textAlign: 'center', paddingTop: 6, marginTop: 6, borderTopWidth: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyStateText: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14 },
});
