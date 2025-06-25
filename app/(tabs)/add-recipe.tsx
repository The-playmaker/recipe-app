import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Save, Image as ImageIcon } from 'lucide-react-native';
import { useState } from 'react';
import { useRecipes } from '@/hooks/useRecipes';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categories = ['Cocktail', 'Mocktail', 'Coffee', 'Coffee Cocktail', 'Beer', 'Wine', 'Spirits', 'Hot Drinks'];
const difficulties = ['Easy', 'Medium', 'Hard'];

export default function AddRecipeScreen() {
  const { addRecipe } = useRecipes();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cocktail',
    image_url: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    time_minutes: 5,
    description: '',
    is_featured: false,
    ingredients: [''],
    instructions: ['']
  });

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, i) => i === index ? value : ingredient)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index)
      }));
    }
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((instruction, i) => i === index ? value : instruction)
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a recipe name');
      return;
    }

    if (formData.ingredients.some(ingredient => !ingredient.trim())) {
      Alert.alert('Error', 'Please fill in all ingredients');
      return;
    }

    if (formData.instructions.some(instruction => !instruction.trim())) {
      Alert.alert('Error', 'Please fill in all instructions');
      return;
    }

    try {
      setLoading(true);
      await addRecipe({
        ...formData,
        ingredients: formData.ingredients.filter(ingredient => ingredient.trim()),
        instructions: formData.instructions.filter(instruction => instruction.trim())
      });
      
      Alert.alert('Success', 'Recipe added successfully!', [
        { text: 'OK', onPress: () => router.push('/recipes') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Add New Recipe</Text>
        <Text style={styles.subtitle}>Create a new drink recipe for your team</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipe Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="e.g., Classic Mojito"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Brief description of the drink..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.pickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.pickerOption,
                        formData.category === category && styles.pickerOptionActive
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, category }))}
                    >
                      <Text style={[
                        styles.pickerOptionText,
                        formData.category === category && styles.pickerOptionTextActive
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Difficulty</Text>
              <View style={styles.pickerContainer}>
                <View style={styles.difficultyOptions}>
                  {difficulties.map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      style={[
                        styles.difficultyOption,
                        formData.difficulty === difficulty && styles.difficultyOptionActive
                      ]}
                      onPress={() => setFormData(prev => ({ ...prev, difficulty: difficulty as 'Easy' | 'Medium' | 'Hard' }))}
                    >
                      <Text style={[
                        styles.difficultyOptionText,
                        formData.difficulty === difficulty && styles.difficultyOptionTextActive
                      ]}>
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Time (minutes)</Text>
              <TextInput
                style={styles.input}
                value={formData.time_minutes.toString()}
                onChangeText={(text) => setFormData(prev => ({ ...prev, time_minutes: parseInt(text) || 0 }))}
                placeholder="5"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              value={formData.image_url}
              onChangeText={(text) => setFormData(prev => ({ ...prev, image_url: text }))}
              placeholder="https://images.pexels.com/..."
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>

          {formData.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.listItem}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={ingredient}
                onChangeText={(text) => updateIngredient(index, text)}
                placeholder={`Ingredient ${index + 1}`}
                placeholderTextColor="#9CA3AF"
              />
              {formData.ingredients.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeIngredient(index)}
                >
                  <Minus size={20} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <TouchableOpacity style={styles.addButton} onPress={addInstruction}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>

          {formData.instructions.map((instruction, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.instructionInput]}
                value={instruction}
                onChangeText={(text) => updateInstruction(index, text)}
                placeholder={`Step ${index + 1} instructions...`}
                placeholderTextColor="#9CA3AF"
                multiline
              />
              {formData.instructions.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeInstruction(index)}
                >
                  <Minus size={20} color="#DC2626" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Save size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save Recipe'}
          </Text>
        </TouchableOpacity>

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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: isTablet ? 16 : 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
  },
  pickerOptionActive: {
    backgroundColor: '#F59E0B',
  },
  pickerOptionText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  pickerOptionTextActive: {
    color: '#FFFFFF',
  },
  difficultyOptions: {
    flexDirection: 'row',
    padding: 4,
  },
  difficultyOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 2,
  },
  difficultyOptionActive: {
    backgroundColor: '#F59E0B',
  },
  difficultyOptionText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  difficultyOptionTextActive: {
    color: '#FFFFFF',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  stepNumberText: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  instructionInput: {
    flex: 1,
    minHeight: 48,
    textAlignVertical: 'top',
  },
  removeButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 16,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  bottomSpacing: {
    height: 100,
  },
});