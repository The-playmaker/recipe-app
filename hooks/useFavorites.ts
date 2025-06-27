import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_STORAGE_KEY = '@RecipeApp:favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Laster favoritter fra lokal lagring når hooken starter
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites !== null) {
          setFavorites(new Set(JSON.parse(storedFavorites)));
        }
      } catch (e) {
        console.error('Failed to load favorites.', e);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // Lagrer favoritter til lokal lagring hver gang de endres
  const saveFavorites = async (newFavorites: Set<string>) => {
    try {
      const jsonValue = JSON.stringify(Array.from(newFavorites));
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save favorites.', e);
    }
  };

  // Funksjon for å legge til/fjerne en favoritt
  const toggleFavorite = useCallback((recipeId: string) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      // Lagre de nye favorittene
      saveFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  return { favorites, toggleFavorite, loading };
}
