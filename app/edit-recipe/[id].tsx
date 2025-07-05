import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Save, Star } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRecipes, Recipe } from '@/hooks/useRecipes';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useTheme } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categories = ['Cocktail', 'Mocktail', 'Coffee', 'Coffee Cocktail', 'Beer', 'Wine', 'Spirits', 'Hot Drinks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { updateRecipe } = useRecipes();
  const { colors, isDarkMode } = useTheme();
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
    if (!id || !db) return;
    const fetchRecipeData = async () => {
      try {
        setLoading(true);
        const recipeRef = doc(db, 'drinks', id);
        const docSnap = await getDoc(recipeRef);

        if (docSnap.exists()) {
          const recipeData = docSnap.data() as Recipe;
          setFormData({
              ...recipeData,
              time: recipeData.time.replace(/[^0-9]/g, ''),
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

  const handleFormChange = (field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleListItemChange = (list: 'ingredients' | 'instructions', index: number, value: string) => {
    setFormData(prev => {
        const newList = [...(prev[list] || [])];
        newList[index] = value;
        return { ...prev, [list]: newList };
    });
  };

  const addListItem = (list: 'ingredients' | 'instructions') => {
    setFormData(prev => ({ ...prev, [list]: [...(prev[list] || []), ''] }));
  };

  const removeListItem = (list: 'ingredients' | 'instructions', index: number) => {
    if (formData[list] && formData[list]!.length > 1) {
        setFormData(prev => ({ ...prev, [list]: prev[list]!.filter((_, i) => i !== index) }));
    }
  };

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
        // KORRIGERT: Bruker nå en mer robust navigasjonsmetode.
        { 
          text: 'OK', 
          onPress: () => {
            console.log("OK button pressed, navigating to /recipes");
            router.navigate('/(tabs)/recipes');
          }
        }
      ]);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert('Feil', 'Kunne ikke oppdatere oppskriften. Prøv igjen.');
    } finally {
      setSaving(false);
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
      featuredRow: { backgroundColor: colors.card, borderColor: colors.border },
  });

  if (loading) {
      return <SafeAreaView style={dynamicStyles.container}><ActivityIndicator style={{flex: 1}} size="large" color={colors.primary} /></SafeAreaView>
  }
  if (error) {
      return <SafeAreaView style={dynamicStyles.container}><Text style={{color: 'red', textAlign: 'center'}}>{error}</Text></SafeAreaView>
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
        <Stack.Screen options={{title: `Edit: ${formData.name}`, headerStyle: {backgroundColor: colors.card}, headerTintColor: colors.text }}/>
      <View style={[styles.header, dynamicStyles.header]}>
        <Text style={[styles.title, dynamicStyles.title]}>Edit Recipe</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitle]}>Update details for {formData.name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Basic Information</Text>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Recipe Name *</Text><TextInput style={[styles.input, dynamicStyles.input]} value={formData.name} onChangeText={(text) => handleFormChange('name', text)} placeholderTextColor={colors.textSecondary} /></View>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Description</Text><TextInput style={[styles.input, styles.textArea, dynamicStyles.input]} value={formData.description} onChangeText={(text) => handleFormChange('description', text)} multiline placeholderTextColor={colors.textSecondary} /></View>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Category</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>{categories.map((category) => (<TouchableOpacity key={category} style={[styles.pickerOption, formData.category === category && styles.pickerOptionActive]} onPress={() => handleFormChange('category', category)}><Text style={[styles.pickerOptionText, formData.category === category ? dynamicStyles.activePickerOptionText : dynamicStyles.pickerOptionText]}>{category}</Text></TouchableOpacity>))}</ScrollView></View>
          <View style={styles.row}><View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}><Text style={[styles.label, dynamicStyles.label]}>Difficulty</Text><View style={[styles.pickerContainer, { padding: 4 }, dynamicStyles.pickerContainer]}><View style={styles.difficultyOptions}>{difficulties.map((difficulty) => (<TouchableOpacity key={difficulty} style={[styles.difficultyOption, formData.difficulty === difficulty && styles.difficultyOptionActive]} onPress={() => handleFormChange('difficulty', difficulty as 'Easy' | 'Medium' | 'Hard' )}><Text style={[styles.difficultyOptionText, formData.difficulty === difficulty ? dynamicStyles.activePickerOptionText : dynamicStyles.pickerOptionText]}>{difficulty}</Text></TouchableOpacity>))}</View></View></View><View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}><Text style={[styles.label, dynamicStyles.label]}>Time (minutes)</Text><TextInput style={[styles.input, dynamicStyles.input]} value={formData.time} onChangeText={(text) => handleFormChange('time', text.replace(/[^0-9]/g, ''))} keyboardType="numeric" placeholderTextColor={colors.textSecondary} /></View></View>
          <View style={styles.inputGroup}><Text style={[styles.label, dynamicStyles.label]}>Image URL</Text><TextInput style={[styles.input, dynamicStyles.input]} value={formData.image} onChangeText={(text) => handleFormChange('image', text)} placeholderTextColor={colors.textSecondary} /></View>
          <View style={[styles.featuredRow, dynamicStyles.featuredRow]}><View style={styles.featuredTextContainer}><Star size={20} color={colors.primary} style={{marginRight: 8}}/><Text style={[styles.label, dynamicStyles.label]}>Feature on Home Screen</Text></View><Switch trackColor={{ false: "#E5E7EB", true: colors.primary }} thumbColor={"#FFFFFF"} onValueChange={(value) => handleFormChange('featured', value)} value={formData.featured} /></View>
        </View>

        <View style={styles.section}><View style={styles.sectionHeader}><Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Ingredients</Text><TouchableOpacity style={styles.addButton} onPress={() => addListItem('ingredients')}><Plus size={20} color={colors.primary} /></TouchableOpacity></View>{formData.ingredients?.map((ingredient, index) => (<View key={index} style={styles.listItem}><TextInput style={[styles.input, { flex: 1 }, dynamicStyles.input]} value={ingredient} onChangeText={(text) => handleListItemChange('ingredients', index, text)} placeholderTextColor={colors.textSecondary} />{formData.ingredients && formData.ingredients.length > 1 && (<TouchableOpacity style={[styles.removeButton, dynamicStyles.removeButton]} onPress={() => removeListItem('ingredients', index)}><Minus size={20} color="#DC2626" /></TouchableOpacity>)}</View>))}</View>
        <View style={styles.section}><View style={styles.sectionHeader}><Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Instructions</Text><TouchableOpacity style={styles.addButton} onPress={() => addListItem('instructions')}><Plus size={20} color={colors.primary} /></TouchableOpacity></View>{formData.instructions?.map((instruction, index) => (<View key={index} style={styles.listItem}><View style={[styles.stepNumberContainer, dynamicStyles.stepNumberContainer]}><Text style={[styles.stepNumberText, dynamicStyles.stepNumberText]}>{index + 1}</Text></View><TextInput style={[styles.input, styles.instructionInput, dynamicStyles.input]} value={instruction} onChangeText={(text) => handleListItemChange('instructions', index, text)} multiline placeholderTextColor={colors.textSecondary} />{formData.instructions && formData.instructions.length > 1 && (<TouchableOpacity style={[styles.removeButton, dynamicStyles.removeButton]} onPress={() => removeListItem('instructions', index)}><Minus size={20} color="#DC2626" /></TouchableOpacity>)}</View>))}</View>
        
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
  listItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  stepNumberContainer: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 14, fontWeight: 'bold' },
  instructionInput: { flex: 1, minHeight: 48, textAlignVertical: 'top' },
  removeButton: { borderRadius: 20, padding: 8 },
  saveButton: { backgroundColor: '#F59E0B', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 },
  saveButtonDisabled: { backgroundColor: '#FBBF24' },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  bottomSpacing: { height: 100 },
  featuredRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, padding: 16, borderWidth: 1, marginTop: 8, },
  featuredTextContainer: { flexDirection: 'row', alignItems: 'center', },
});
