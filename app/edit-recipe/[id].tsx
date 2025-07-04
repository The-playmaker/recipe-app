import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Save, Star } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRecipes, Recipe } from '@/hooks/useRecipes';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { db } from '@/lib/firebase'; // Changed from firebase.native
import { doc, getDoc } from 'firebase/firestore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categories = ['Cocktail', 'Mocktail', 'Coffee', 'Coffee Cocktail', 'Beer', 'Wine', 'Spirits', 'Hot Drinks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateRecipe } = useRecipes();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Recipe>>({
    name: '',
    category: 'Cocktail',
    image: '',
    difficulty: 'Easy',
    time: '5',
    description: '',
    featured: false,
    ingredients: [''],
    instructions: ['']
  });

  useEffect(() => {
    if (!id) return;
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        const recipeRef = doc(db, 'drinks', id);
        const docSnap = await getDoc(recipeRef);

        if (docSnap.exists()) {
          const recipeData = docSnap.data() as Recipe;
          setFormData({
              ...recipeData,
              time: recipeData.time.replace(/[^0-9]/g, ''), // Fjerner " min" for redigering
          });
        } else {
          setError('Recipe not found');
        }
      } catch (e) {
        setError('Failed to load recipe data');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipeData();
  }, [id]);


  const addIngredient = () => setFormData(prev => ({...prev, ingredients: [...(prev.ingredients || []), '']}));
  const removeIngredient = (index: number) => {
    if (formData.ingredients && formData.ingredients.length > 1) setFormData(prev => ({...prev, ingredients: prev.ingredients.filter((_, i) => i !== index)}));
  };
  const updateIngredient = (index: number, value: string) => setFormData(prev => ({...prev, ingredients: prev.ingredients?.map((ing, i) => i === index ? value : ing)}));

  const addInstruction = () => setFormData(prev => ({...prev, instructions: [...(prev.instructions || []), '']}));
  const removeInstruction = (index: number) => {
    if (formData.instructions && formData.instructions.length > 1) setFormData(prev => ({...prev, instructions: prev.instructions.filter((_, i) => i !== index)}));
  };
  const updateInstruction = (index: number, value: string) => setFormData(prev => ({...prev, instructions: prev.instructions?.map((inst, i) => i === index ? value : inst)}));

  const handleSave = async () => {
    if (!id) return;

    if (!formData.name?.trim() || !formData.time?.trim()) {
      Alert.alert('Mangler informasjon', 'Fyll ut navn og tid for oppskriften.');
      return;
    }
    
    const recipeToUpdate = {
        name: formData.name.trim(),
        category: formData.category,
        image: formData.image,
        difficulty: formData.difficulty,
        time: `${formData.time} min`,
        description: formData.description?.trim(),
        featured: formData.featured,
        ingredients: formData.ingredients?.filter(ing => ing.trim()) || [],
        instructions: formData.instructions?.filter(inst => inst.trim()) || [],
    };

    try {
      setSaving(true);
      await updateRecipe(id, recipeToUpdate);
      
      Alert.alert('Suksess!', 'Oppskriften ble oppdatert.', [
        // KORRIGERT: Bruker nå navigate for en mer pålitelig navigering til fanen.
        { text: 'OK', onPress: () => router.navigate('/(tabs)/recipes') }
      ]);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert('Feil', 'Kunne ikke oppdatere oppskriften. Prøv igjen.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
      return <SafeAreaView style={styles.container}><ActivityIndicator size="large" color="#F59E0B" /></SafeAreaView>
  }
  if (error) {
      return <SafeAreaView style={styles.container}><Text style={{color: 'red', textAlign: 'center'}}>{error}</Text></SafeAreaView>
  }

  return (
    <SafeAreaView style={styles.container}>
        <Stack.Screen options={{title: `Edit: ${formData.name}`}}/>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Recipe</Text>
        <Text style={styles.subtitle}>Update details for {formData.name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.inputGroup}><Text style={styles.label}>Recipe Name *</Text><TextInput style={styles.input} value={formData.name} onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))} /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Description</Text><TextInput style={[styles.input, styles.textArea]} value={formData.description} onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))} multiline /></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Category</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerContainer}>{categories.map((category) => (<TouchableOpacity key={category} style={[styles.pickerOption, formData.category === category && styles.pickerOptionActive]} onPress={() => setFormData(prev => ({ ...prev, category }))}><Text style={[styles.pickerOptionText, formData.category === category && styles.pickerOptionTextActive]}>{category}</Text></TouchableOpacity>))}</ScrollView></View>
          <View style={styles.row}><View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}><Text style={styles.label}>Difficulty</Text><View style={[styles.pickerContainer, { padding: 4 }]}><View style={styles.difficultyOptions}>{difficulties.map((difficulty) => (<TouchableOpacity key={difficulty} style={[styles.difficultyOption, formData.difficulty === difficulty && styles.difficultyOptionActive]} onPress={() => setFormData(prev => ({ ...prev, difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' }))}><Text style={[styles.difficultyOptionText, formData.difficulty === difficulty && styles.difficultyOptionTextActive]}>{difficulty}</Text></TouchableOpacity>))}</View></View></View><View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}><Text style={styles.label}>Time (minutes)</Text><TextInput style={styles.input} value={formData.time} onChangeText={(text) => setFormData(prev => ({ ...prev, time: text.replace(/[^0-9]/g, '') }))} keyboardType="numeric" /></View></View>
          <View style={styles.inputGroup}><Text style={styles.label}>Image URL</Text><TextInput style={styles.input} value={formData.image} onChangeText={(text) => setFormData(prev => ({ ...prev, image: text }))} /></View>
          
          <View style={styles.featuredRow}>
            <View style={styles.featuredTextContainer}>
              <Star size={20} color="#F59E0B" style={{marginRight: 8}}/>
              <Text style={styles.label}>Feature on Home Screen</Text>
            </View>
            <Switch
              trackColor={{ false: "#E5E7EB", true: "#FBBF24" }}
              thumbColor={formData.featured ? "#F59E0B" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => setFormData(prev => ({ ...prev, featured: value }))}
              value={formData.featured}
            />
          </View>
        </View>

        <View style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Ingredients</Text><TouchableOpacity style={styles.addButton} onPress={addIngredient}><Plus size={20} color="#F59E0B" /></TouchableOpacity></View>{formData.ingredients?.map((ingredient, index) => (<View key={index} style={styles.listItem}><TextInput style={[styles.input, { flex: 1 }]} value={ingredient} onChangeText={(text) => updateIngredient(index, text)} />{formData.ingredients && formData.ingredients.length > 1 && (<TouchableOpacity style={styles.removeButton} onPress={() => removeIngredient(index)}><Minus size={20} color="#DC2626" /></TouchableOpacity>)}</View>))}</View>
        <View style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Instructions</Text><TouchableOpacity style={styles.addButton} onPress={addInstruction}><Plus size={20} color="#F59E0B" /></TouchableOpacity></View>{formData.instructions?.map((instruction, index) => (<View key={index} style={styles.listItem}><View style={styles.stepNumber}><Text style={styles.stepNumberText}>{index + 1}</Text></View><TextInput style={[styles.input, styles.instructionInput]} value={instruction} onChangeText={(text) => updateInstruction(index, text)} multiline />{formData.instructions && formData.instructions.length > 1 && (<TouchableOpacity style={styles.removeButton} onPress={() => removeInstruction(index)}><Minus size={20} color="#DC2626" /></TouchableOpacity>)}</View>))}</View>
        
        <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#FFFFFF" /> : <Save size={20} color="#FFFFFF" />}
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Update Recipe'}</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { padding: 24, paddingTop: 16, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#111827' },
  addButton: { backgroundColor: '#FFFBEB', borderRadius: 20, padding: 8 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, fontSize: 14, color: '#111827', borderWidth: 1, borderColor: '#E5E7EB' },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  pickerContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', paddingVertical: 4 },
  pickerOption: { paddingHorizontal: 14, paddingVertical: 10, marginHorizontal: 4, borderRadius: 8 },
  pickerOptionActive: { backgroundColor: '#F59E0B' },
  pickerOptionText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  pickerOptionTextActive: { color: '#FFFFFF' },
  difficultyOptions: { flexDirection: 'row' },
  difficultyOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, marginHorizontal: 2 },
  difficultyOptionActive: { backgroundColor: '#F59E0B' },
  difficultyOptionText: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  difficultyOptionTextActive: { color: '#FFFFFF' },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  stepNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: 'bold', color: '#6B7280' },
  instructionInput: { flex: 1, minHeight: 48, textAlignVertical: 'top' },
  removeButton: { backgroundColor: '#FEE2E2', borderRadius: 20, padding: 8 },
  saveButton: { backgroundColor: '#F59E0B', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 },
  saveButtonDisabled: { backgroundColor: '#FBBF24' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  bottomSpacing: { height: 100 },
  featuredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
  },
  featuredTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
