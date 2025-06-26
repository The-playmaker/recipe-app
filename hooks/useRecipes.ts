import { useState, useEffect, useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';

// Definer en type for oppskriftene dine for bedre kodekvalitet
// Oppdatert for å inkludere 'instructions'
export interface Recipe {
  id: string;
  name: string;
  category: string;
  image: string;
  difficulty: string;
  time: string;
  description: string;
  ingredients: string[];
  instructions: string[]; // Lagt til for å støtte add-recipe-skjemaet
  featured?: boolean;
  createdAt?: any; 
  updatedAt?: any;
}

// Funksjon for å fjerne 'id' fra en type, nyttig for 'add' funksjoner
type OmitId<T> = Omit<T, 'id'|'createdAt'|'updatedAt'>;


export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const snapshot = await firestore()
        .collection('drinks')
        .orderBy('createdAt', 'desc')
        .get();
        
      if (snapshot.empty) {
        setRecipes([]);
      } else {
        const recipesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Recipe[];
        setRecipes(recipesData);
      }
    } catch (err) {
      console.error("fetchRecipes error:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  // Funksjon for å legge til en ny oppskrift
  const addRecipe = async (recipe: OmitId<Recipe>) => {
    try {
      const newRecipe = {
        ...recipe,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      const docRef = await firestore().collection('drinks').add(newRecipe);
      
      setRecipes(prev => [{ id: docRef.id, ...newRecipe, createdAt: new Date() } as Recipe, ...prev]);
      return { id: docRef.id, ...newRecipe };
    } catch (err) {
      console.error("addRecipe error:", err);
      setError(err instanceof Error ? err.message : 'Failed to add recipe');
      throw err;
    }
  };

  // Funksjon for å oppdatere en eksisterende oppskrift
  const updateRecipe = async (id: string, updates: Partial<OmitId<Recipe>>) => {
    try {
      const recipeRef = firestore().collection('drinks').doc(id);
      await recipeRef.update({
        ...updates,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      setRecipes(prev => 
        prev.map(recipe => (recipe.id === id ? { ...recipe, ...updates } as Recipe : recipe))
      );
    } catch (err) {
      console.error("updateRecipe error:", err);
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
      throw err;
    }
  };

  // Funksjon for å slette en oppskrift
  const deleteRecipe = async (id: string) => {
    try {
      await firestore().collection('drinks').doc(id).delete();
      setRecipes(prev => prev.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error("deleteRecipe error:", err);
setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      throw err;
    }
  };

  return {
    recipes,
    loading,
    error,
    refetch: fetchRecipes,
    addRecipe,
    updateRecipe,
    deleteRecipe,
  };
}
