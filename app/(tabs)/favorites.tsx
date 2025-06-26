import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Clock, ChefHat, Trash2 } from 'lucide-react-native';
import { useState } from 'react';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const initialFavorites = [
  {
    id: 1,
    name: 'Classic Mojito',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    time: '5 min',
    ingredients: ['White rum', 'Fresh mint', 'Lime juice', 'Sugar', 'Soda water'],
    description: 'A refreshing Cuban cocktail with fresh mint and lime.'
  },
  {
    id: 3,
    name: 'Virgin Piña Colada',
    category: 'Mocktail',
    image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    time: '4 min',
    ingredients: ['Pineapple juice', 'Coconut cream', 'Ice', 'Pineapple wedge'],
    description: 'A tropical non-alcoholic drink perfect for any time of day.'
  },
  {
    id: 6,
    name: 'Cucumber Mint Cooler',
    category: 'Mocktail',
    image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    time: '3 min',
    ingredients: ['Cucumber', 'Fresh mint', 'Lime juice', 'Honey', 'Sparkling water'],
    description: 'A refreshing cucumber-based drink with fresh mint.'
  }
];

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState(initialFavorites);

  const removeFavorite = (recipeId: number) => {
    setFavorites(prevFavorites =>
      prevFavorites.filter(recipe => recipe.id !== recipeId)
    );
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favorite Recipes</Text>
          <Text style={styles.subtitle}>Your bookmarked drinks</Text>
        </View>
        <View style={styles.emptyState}>
          <Heart size={64} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySubtitle}>
            Add recipes to your favorites by tapping the heart icon
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Favorite Recipes</Text>
        <Text style={styles.subtitle}>{favorites.length} saved recipes</Text>
      </View>

      {/* Favorites List */}
      <ScrollView style={styles.favoritesContainer} showsVerticalScrollIndicator={false}>
        {favorites.map((recipe) => (
          <TouchableOpacity key={recipe.id} style={styles.favoriteCard}>
            <Image source={{ uri: recipe.image }} style={styles.favoriteImage} />
            <View style={styles.favoriteContent}>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>{recipe.name}</Text>
                <Text style={styles.favoriteCategory}>{recipe.category}</Text>
                <Text style={styles.favoriteDescription}>{recipe.description}</Text>
                <View style={styles.favoriteMeta}>
                  <View style={styles.favoriteMetaItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.favoriteMetaText}>{recipe.time}</Text>
                  </View>
                  <View style={styles.favoriteMetaItem}>
                    <ChefHat size={16} color="#6B7280" />
                    <Text style={styles.favoriteMetaText}>{recipe.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.ingredientsPreview}>
                  {recipe.ingredients.join(', ')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFavorite(recipe.id)}
              >
                <Trash2 size={20} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    fontSize: isTablet ? 24 : 20,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  favoritesContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoriteImage: {
    width: isTablet ? 140 : 120,
    height: isTablet ? 140 : 120,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  favoriteContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteInfo: {
    flex: 1,
    padding: 16,
  },
  favoriteName: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  favoriteCategory: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginBottom: 8,
  },
  favoriteDescription: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  favoriteMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  favoriteMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteMetaText: {
    fontSize: isTablet ? 12 : 11,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ingredientsPreview: {
    fontSize: isTablet ? 12 : 10,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 16,
  },
  removeButton: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacing: {
    height: 100,
  },
});