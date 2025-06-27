import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase.native';
import { collection, getDocs, query, where, orderBy, addDoc, serverTimestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';

export interface Recipe {
  id: string;
  name: string;
  category: string;
  image: string;
  difficulty: string;
  time: string;
  description: string;
  ingredients: string[];
  instructions: string[]; // Nå inkludert
  featured?: boolean;
  createdAt?: any; 
  updatedAt?: any;
}

type OmitId<T> = Omit<T, 'id'|'createdAt'|'updatedAt'>;

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async (category: string = 'All') => {
    try {
      setLoading(true);
      setError(null);
      
      const drinksCollection = collection(db, 'drinks');
      let q;

      if (category === 'All') {
        q = query(drinksCollection, orderBy('createdAt', 'desc'));
      } else {
        q = query(drinksCollection, where('category', '==', category), orderBy('createdAt', 'desc'));
      }
      
      const snapshot = await getDocs(q);
      const recipesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Recipe[];
      setRecipes(recipesData);

    } catch (err) {
      console.error("fetchRecipes error:", err);
      if (err.code === 'failed-precondition') {
          setError('Database needs an index. Please check the Firebase console for a link to create it.');
      } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // addRecipe er nå tilpasset for å ta imot et komplett, men ID-løst objekt
  const addRecipe = async (recipe: OmitId<Recipe>) => {
    try {
      const newRecipe = { ...recipe, createdAt: serverTimestamp() };
      const docRef = await addDoc(collection(db, 'drinks'), newRecipe);
      
      // Hent data på nytt for å se den nye oppskriften øverst i listen
      fetchRecipes(); 
      return { id: docRef.id, ...newRecipe };
    } catch (err) {
      console.error("addRecipe error:", err);
      setError(err instanceof Error ? err.message : 'Failed to add recipe');
      throw err;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<OmitId<Recipe>>) => {
    try {
      const recipeRef = doc(db, 'drinks', id);
      await updateDoc(recipeRef, { ...updates, updatedAt: serverTimestamp() });
      setRecipes(prev => prev.map(r => (r.id === id ? { ...r, ...updates } as Recipe : r)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update recipe');
      throw err;
    }
  };
  
  const deleteRecipe = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'drinks', id));
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete recipe');
      throw err;
    }
  };

  return {
    recipes, loading, error, fetchRecipes, addRecipe, updateRecipe, deleteRecipe,
  };
}
