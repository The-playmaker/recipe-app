import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Clock, ChefHat, Trash2 } from 'lucide-react-native';
import { supabase } from '../lib';


const { width } = Dimensions.get('window');
const isTablet = width >= 768;

type Recipe = {
  id: string;
  name: string;
  category: string;
  image_url: string;
  difficulty: string;
  time_minutes: number;
  ingredients: string[];
  description: string;
  popularity: number;
};

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Hent favoritter sortert på popularitet
  const fetchFavorites = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Recipe>('recipes')
      .select('*')
      .order('popularity', { ascending: false });

    if (error) {
      console.error('Error fetching favorites:', error);
    } else {
      setFavorites(data ?? []);
    }
    setLoading(false);
  };

  // Øk popularitet når en oppskrift brukes
  const incrementPopularity = async (recipeId: string) => {
    // Finn gjeldende popularitet
    const { data, error } = await supabase
      .from('recipes')
      .select('popularity')
      .eq('id', recipeId)
      .single();

    if (error) {
      console.error('Error fetching popularity:', error);
      return;
    }

    const newPopularity = (data?.popularity ?? 0) + 1;

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ popularity: newPopularity })
      .eq('id', recipeId);

    if (updateError) {
      console.error('Error updating popularity:', updateError);
      return;
    }

    // Oppdater lokalt state for å oppdatere UI uten ny hent
    setFavorites((prev) =>
      prev
        .map((recipe) =>
          recipe.id === recipeId ? { ...recipe, popularity: newPopularity } : recipe
        )
        // Sorter på nytt
        .sort((a, b) => b.popularity - a.popularity)
    );
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Laster favoritter...</Text>
      </SafeAreaView>
    );
  }

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Favoritter</Text>
          <Text style={styles.subtitle}>Ingen favoritter enda</Text>
        </View>
        <View style={styles.emptyState}>
          <Heart size={64} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Ingen favoritter enda</Text>
          <Text style={styles.emptySubtitle}>
            Legg til favoritter ved å bruke hjerteikonet på en oppskrift
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favoritter</Text>
        <Text style={styles.subtitle}>{favorites.length} oppskrifter</Text>
      </View>

      <ScrollView style={styles.favoritesContainer} showsVerticalScrollIndicator={false}>
        {favorites.map((recipe) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.favoriteCard}
            onPress={() => incrementPopularity(recipe.id)}
          >
            <Image source={{ uri: recipe.image_url }} style={styles.favoriteImage} />
            <View style={styles.favoriteContent}>
              <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>{recipe.name}</Text>
                <Text style={styles.favoriteCategory}>{recipe.category}</Text>
                <Text style={styles.favoriteDescription}>{recipe.description}</Text>
                <View style={styles.favoriteMeta}>
                  <View style={styles.favoriteMetaItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.favoriteMetaText}>{recipe.time_minutes} min</Text>
                  </View>
                  <View style={styles.favoriteMetaItem}>
                    <ChefHat size={16} color="#6B7280" />
                    <Text style={styles.favoriteMetaText}>{recipe.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.ingredientsPreview}>
                  {recipe.ingredients.join(', ')}
                </Text>
                <Text style={{fontSize: 10, color: '#AAA'}}>Popularity: {recipe.popularity}</Text>
              </View>
              {/* Her kan du ha f.eks. remove-funksjon hvis ønskelig */}
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingTop: 16 },
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
  bottomSpacing: {
    height: 100,
  },
});
