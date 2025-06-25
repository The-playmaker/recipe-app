import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  Clock,
  ChefHat,
  Heart,
  CreditCard as Edit,
  Trash2,
} from 'lucide-react-native';
import { router } from 'expo-router';
import supabase from '@/lib/supabase'; // Importer din supabase klient korrekt

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categories = [
  'All',
  'Cocktail',
  'Mocktail',
  'Coffee',
  'Coffee Cocktail',
  'Beer',
  'Wine',
  'Spirits',
  'Hot Drinks',
];

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Hent oppskrifter fra Supabase
  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecipes(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const deleteRecipe = async (recipeId: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('recipes').delete().eq('id', recipeId);

      if (error) throw error;

      // Oppdater liste etter sletting
      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err) {
      Alert.alert('Error', 'Failed to delete recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some((ingredient: string) =>
        ingredient.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (recipeId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  };

  const handleDeleteRecipe = (recipeId: string, recipeName: string) => {
    Alert.alert(
      'Delete Recipe',
      `Are you sure you want to delete "${recipeName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteRecipe(recipeId),
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading recipes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubtext}>Please check your database connection</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recipe Collection</Text>
        <Text style={styles.subtitle}>{filteredRecipes.length} recipes available</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes or ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#6B7280"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipes Grid */}
      <ScrollView style={styles.recipesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <View style={styles.recipeImageContainer}>
                <Image source={{ uri: recipe.image_url }} style={styles.recipeImage} />
                <TouchableOpacity style={styles.favoriteButton} onPress={() => toggleFavorite(recipe.id)}>
                  <Heart
                    size={18}
                    color={favorites.has(recipe.id) ? '#DC2626' : '#6B7280'}
                    fill={favorites.has(recipe.id) ? '#DC2626' : 'transparent'}
                  />
                </TouchableOpacity>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => router.push(`/edit-recipe/${recipe.id}`)}>
                    <Edit size={16} color="#F59E0B" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteRecipe(recipe.id, recipe.name)}
                  >
                    <Trash2 size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.recipeContent}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeCategory}>{recipe.category}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {recipe.description}
                </Text>
                <View style={styles.recipeMeta}>
                  <View style={styles.recipeMetaItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.recipeMetaText}>{recipe.time_minutes} min</Text>
                  </View>
                  <View style={styles.recipeMetaItem}>
                    <ChefHat size={14} color="#6B7280" />
                    <Text style={styles.recipeMetaText}>{recipe.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.ingredientsCount}>{recipe.ingredients.length} ingredients</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {filteredRecipes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No recipes found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search or category filter</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 16,
  },
  title: {
    fontSize: isTablet ? 32 : 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  categoryChipActive: {
    backgroundColor: '#F59E0B',
  },
  categoryChipText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  recipesContainer: {
    paddingHorizontal: 24,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  recipeCard: {
    width: isTablet ? (width - 96) / 3 : (width - 72) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 24,
  },
  recipeImageContainer: {
    position: 'relative',
    height: isTablet ? 200 : 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFFCC',
    borderRadius: 20,
    padding: 6,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#FFFFFFCC',
    borderRadius: 16,
    padding: 6,
  },
  deleteButton: {
    backgroundColor: '#FFF0F0',
  },
  recipeContent: {
    padding: 16,
  },
  recipeName: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  recipeMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  recipeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeMetaText: {
    fontSize: isTablet ? 12 : 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ingredientsCount: {
    fontSize: isTablet ? 12 : 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  emptyState: {
    marginTop: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});
