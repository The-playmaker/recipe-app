import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase'; // Importerer vår nye, robuste db-instans
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
  instructions: string[];
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
    // KORRIGERT: Sjekker om databasen er klar før vi gjør noe.
    if (!db) {
      setError("Database is not connected. Check Firebase config.");
      setLoading(false);
      return;
    }

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
          setError('Database needs an index. Check Firebase console.');
      } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const addRecipe = async (recipe: OmitId<Recipe>) => {
    if (!db) {
      console.error("Cannot add recipe, DB not connected.");
      throw new Error("Database not connected.");
    }
    // ... resten av funksjonen er den samme ...
    try {
      const newRecipe = { ...recipe, createdAt: serverTimestamp() };
      const docRef = await addDoc(collection(db, 'drinks'), newRecipe);
      fetchRecipes(); 
      return { id: docRef.id, ...newRecipe };
    } catch (err) {
      console.error("addRecipe error:", err);
      throw err;
    }
  };

  const updateRecipe = async (id: string, updates: Partial<OmitId<Recipe>>) => {
    if (!db) {
      console.error("Cannot update recipe, DB not connected.");
      throw new Error("Database not connected.");
    }
    try {
      const recipeRef = doc(db, 'drinks', id);
      await updateDoc(recipeRef, { ...updates, updatedAt: serverTimestamp() });
      // Optionally, call fetchRecipes() or update local state directly
      // For simplicity and to ensure data consistency, we'll refetch.
      await fetchRecipes(); // Refetch all recipes or the specific category if needed
      // If you want to update local state directly for performance:
      // setRecipes(prevRecipes =>
      //   prevRecipes.map(recipe =>
      //     recipe.id === id ? { ...recipe, ...updates, updatedAt: new Date() } : recipe
      //   )
      // );
    } catch (err) {
      console.error("updateRecipe error:", err);
      throw err; // Re-throw the error to be caught by the calling component
    }
  };
  
  const deleteRecipe = async (id: string) => {
    if (!db) {
      console.error("Cannot delete recipe, DB not connected.");
      throw new Error("Database not connected.");
    }
    try {
      const recipeRef = doc(db, 'drinks', id);
      await deleteDoc(recipeRef);
      // Optionally, call fetchRecipes() or update local state directly
      // For simplicity and to ensure data consistency, we'll refetch.
      await fetchRecipes(); // Refetch all recipes or the specific category if needed
      // If you want to update local state directly for performance:
      // setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== id));
    } catch (err) {
      console.error("deleteRecipe error:", err);
      throw err; // Re-throw the error to be caught by the calling component
    }
  };

  return {
    recipes, loading, error, fetchRecipes, addRecipe, updateRecipe, deleteRecipe,
  };
}
