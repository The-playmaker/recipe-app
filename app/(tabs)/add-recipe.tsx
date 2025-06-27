import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Save, Star } from 'lucide-react-native';
import { useState } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme'; // Importerer theme-hooken

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categories = ['Cocktail', 'Mocktail', 'Coffee', 'Coffee Cocktail', 'Beer', 'Wine', 'Spirits', 'Hot Drinks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function AddRecipeScreen() {
  const { addRecipe } = useRecipes();
  const { colors } = useTheme(); // Henter farger for tema
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    time: '5',
    description: '',
    featured: false,
    ingredients: [''],
    instructions: ['']
  });

  const addIngredient = () => setFormData(prev => ({...prev, ingredients: [...prev.ingredients, '']}));
  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) setFormData(prev => ({...prev, ingredients: prev.ingredients.filter((_, i) => i !== index)}));
  };
  const updateIngredient = (index: number, value: string) => setFormData(prev => ({...prev, ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)}));

  const addInstruction = () => setFormData(prev => ({...prev, instructions: [...prev.instructions, '']}));
  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) setFormData(prev => ({...prev, instructions: prev.instructions.filter((_, i) => i !== index)}));
  };
  const updateInstruction = (index: number, value: string) => setFormData(prev => ({...prev, instructions: prev.instructions.map((inst, i) => i === index ? value : inst)}));

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.time.trim()) {
      Alert.alert('Mangler informasjon', 'Fyll ut navn og tid for oppskriften.');
      return;
    }

    const cleanedIngredients = formData.ingredients.filter(ing => ing.trim());
    const cleanedInstructions = formData.instructions.filter(inst => inst.trim());

    if (cleanedIngredients.length === 0 || cleanedInstructions.length === 0) {
      Alert.alert('Mangler informasjon', 'Legg til minst én ingrediens og én instruksjon.');
      return;
    }

    const recipeToAdd = {
      name: formData.name.trim(),
      category: formData.category,
      image: formData.image,
      difficulty: formData.difficulty,
      time: `${formData.time} min`,
      description: formData.description.trim(),
      featured: formData.featured,
      ingredients: cleanedIngredients,
      instructions: cleanedInstructions
    };

    try {
      setLoading(true);
      await addRecipe(recipeToAdd);
      
      Alert.alert('Suksess!', 'Oppskriften ble lagt til.', [
        { text: 'OK', onPress: () => router.push('/(tabs)/recipes') }
      ]);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert('Feil', 'Kunne ikke legge til oppskriften. Prøv igjen.');
    } finally {
      setLoading(false);
    }
  };

  const dynamicStyles = StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.background },
      header: { borderBottomColor: colors.border },
      title: { color: colors.text },
      subtitle: { color: colors.textSecondary },
      sectionTitle: { color: colors.text },
      label: { color: colors.text },
      input: { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
      pickerContainer: { backgroundColor: colors.card, borderColor: colors.border },
      pickerOptionText: { color: colors.textSecondary },
      activePickerOptionText: { color: '#FFFFFF' },
      removeButton: { backgroundColor: isDarkMode ? '#5B2121' : '#FEE2E2' },
      stepNumberContainer: { backgroundColor: colors.border },
      stepNumberText: { color: colors.textSecondary },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.title, dynamicStyles.title]}>Add New Recipe</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Create a new drink recipe for your team</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Basic Information</Text>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Recipe Name *</Text><TextInput style={[styles.input, dynamicStyles.input]} value={formData.name} onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))} placeholder="e.g., Classic Mojito" placeholderTextColor={colors.textSecondary} /></View>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Description</Text><TextInput style={[styles.input, styles.textArea, dynamicStyles.input]} value={formData.description} onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))} placeholder="Brief description of the drink..." placeholderTextColor={colors.textSecondary} multiline /></View>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Category</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>{categories.map((category) => (<TouchableOpacity key={category} style={[styles.pickerOption, formData.category === category && styles.pickerOptionActive]} onPress={() => setFormData(prev => ({ ...prev, category }))}><Text style={[styles.pickerOptionText, formData.category === category ? dynamicStyles.activePickerOptionText : dynamicStyles.pickerOptionText]}>{category}</Text></TouchableOpacity>))}</ScrollView></View>
          <View style={styles.row}><View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}><Text style={[styles.label, dynamicStyles.label]}>Difficulty</Text><View style={[styles.pickerContainer, { padding: 4 }, dynamicStyles.pickerContainer]}><View style={styles.difficultyOptions}>{difficulties.map((difficulty) => (<TouchableOpacity key={difficulty} style={[styles.difficultyOption, formData.difficulty === difficulty && styles.difficultyOptionActive]} onPress={() => setFormData(prev => ({ ...prev, difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' }))}><Text style={[styles.difficultyOptionText, formData.difficulty === difficulty ? dynamicStyles.activePickerOptionText : dynamicStyles.pickerOptionText]}>{difficulty}</Text></TouchableOpacity>))}</View></View></View><View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}><Text style={[styles.label, dynamicStyles.label]}>Time (minutes)</Text><TextInput style={[styles.input, dynamicStyles.input]} value={formData.time} onChangeText={(text) => setFormData(prev => ({ ...prev, time: text.replace(/[^0-9]/g, '') }))} placeholder="5" placeholderTextColor={colors.textSecondary} keyboardType="numeric" /></View></View>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Image URL</Text><TextInput style={[styles.input, dynamicStyles.input]} value={formData.image} onChangeText={(text) => setFormData(prev => ({ ...prev, image: text }))} placeholder="https://images.pexels.com/..." placeholderTextColor={colors.textSecondary} /></View>
        </View>

        <View style={styles.section}><View style={styles.sectionHeader}><Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Ingredients</Text><TouchableOpacity style={styles.addButton} onPress={addIngredient}><Plus size={20} color={colors.primary} /></TouchableOpacity></View>{formData.ingredients.map((ingredient, index) => (<View key={index} style={styles.listItem}><TextInput style={[styles.input, { flex: 1 }, dynamicStyles.input]} value={ingredient} onChangeText={(text) => updateIngredient(index, text)} placeholder={`Ingredient ${index + 1}`} placeholderTextColor={colors.textSecondary} />{formData.ingredients.length > 1 && (<TouchableOpacity style={[styles.removeButton, dynamicStyles.removeButton]} onPress={() => removeIngredient(index)}><Minus size={20} color="#DC2626" /></TouchableOpacity>)}</View>))}</View>
        <View style={styles.section}><View style={styles.sectionHeader}><Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Instructions</Text><TouchableOpacity style={styles.addButton} onPress={addInstruction}><Plus size={20} color={colors.primary} /></TouchableOpacity></View>{formData.instructions.map((instruction, index) => (<View key={index} style={styles.listItem}><View style={[styles.stepNumberContainer, dynamicStyles.stepNumberContainer]}><Text style={[styles.stepNumberText, dynamicStyles.stepNumberText]}>{index + 1}</Text></View><TextInput style={[styles.input, styles.instructionInput, dynamicStyles.input]} value={instruction} onChangeText={(text) => updateInstruction(index, text)} placeholder={`Step ${index + 1} instructions...`} placeholderTextColor={colors.textSecondary} multiline />{formData.instructions.length > 1 && (<TouchableOpacity style={[styles.removeButton, dynamicStyles.removeButton]} onPress={() => removeInstruction(index)}><Minus size={20} color="#DC2626" /></TouchableOpacity>)}</View>))}</View>
        
        <TouchableOpacity style={[styles.saveButton, loading && styles.saveButtonDisabled]} onPress={handleSave} disabled={loading}>{loading ? <ActivityIndicator color="#FFFFFF" /> : <Save size={20} color="#FFFFFF" />}<Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Recipe'}</Text></TouchableOpacity>
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, paddingTop: 16, borderBottomWidth: 1 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600' },
  addButton: { backgroundColor: '#FFFBEB', borderRadius: 20, padding: 8 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  input: { borderRadius: 12, padding: 14, fontSize: 14, borderWidth: 1 },
  textArea: { height: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row' },
  pickerContainer: { borderRadius: 12, borderWidth: 1, paddingVertical: 4 },
  pickerOption: { paddingHorizontal: 14, paddingVertical: 10, marginHorizontal: 4, borderRadius: 8 },
  pickerOptionActive: { backgroundColor: '#F59E0B' },
  pickerOptionText: { fontSize: 14, fontWeight: '500' },
  difficultyOptions: { flexDirection: 'row' },
  difficultyOption: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 8, marginHorizontal: 2 },
  difficultyOptionActive: { backgroundColor: '#F59E0B' },
  difficultyOptionText: { fontSize: 14, fontWeight: '500' },
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  stepNumberContainer: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: 'bold' },
  instructionInput: { flex: 1, minHeight: 48, textAlignVertical: 'top' },
  removeButton: { borderRadius: 20, padding: 8 },
  saveButton: { backgroundColor: '#F59E0B', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 },
  saveButtonDisabled: { backgroundColor: '#FBBF24' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  bottomSpacing: { height: 100 },
});
