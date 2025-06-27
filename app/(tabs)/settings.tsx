import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Palette, Download, Info, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';
import { useRecipes } from '@/hooks/useRecipes'; 
import { useFavorites } from '@/hooks/useFavorites';
import { useTheme } from '@/hooks/useTheme'; // Importerer theme-hooken
import { db } from '@/lib/firebase.native';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from 'react';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SettingsScreen() {
  const { recipes, loading: recipesLoading } = useRecipes();
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategoriesCount = async () => {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        setCategoriesCount(categoriesSnapshot.size);
      } catch (error) {
        console.error("Failed to fetch category count:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategoriesCount();
  }, []);

  const isLoading = recipesLoading || loadingCategories || favoritesLoading;

  const appStats = [
    { label: 'Total Recipes', value: isLoading ? '...' : recipes.length.toString() },
    { label: 'Favorites', value: isLoading ? '...' : favorites.size.toString() },
    { label: 'Categories', value: isLoading ? '...' : categoriesCount.toString() },
    { label: 'Last Updated', value: 'Today' }
  ];

  const settingsData = [
    {
      section: 'App Preferences',
      items: [
        { icon: Palette, title: 'Dark Mode', subtitle: isDarkMode ? 'On' : 'Off', type: 'toggle', value: isDarkMode, onToggle: toggleTheme },
        { icon: Bell, title: 'Notifications', subtitle: 'Coming soon', type: 'disabled' },
        { icon: Download, title: 'Auto Sync', subtitle: 'Coming soon', type: 'disabled' }
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: HelpCircle, title: 'Help & Support', type: 'navigation' },
        { icon: Info, title: 'About', type: 'navigation' }
      ]
    }
  ];
  
  const dynamicStyles = StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.background },
      headerText: { color: colors.text },
      subtitleText: { color: colors.textSecondary },
      sectionTitle: { color: colors.text },
      card: { backgroundColor: colors.card, borderColor: colors.border },
      statValue: { color: colors.primary },
      settingItem: { borderBottomColor: colors.border },
      settingIconContainer: { backgroundColor: colors.background },
      settingIcon: { color: colors.textSecondary },
      settingTitle: { color: colors.text },
      settingSubtitle: { color: colors.textSecondary },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, dynamicStyles.headerText]}>Settings</Text>
        <Text style={[styles.subtitle, dynamicStyles.subtitleText]}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>App Statistics</Text>
          <View style={styles.statsGrid}>
            {appStats.map((stat, index) => (
              <View key={index} style={[styles.statCard, dynamicStyles.card]}>
                <Text style={[styles.statValue, dynamicStyles.statValue]}>{stat.value}</Text>
                <Text style={[styles.statLabel, dynamicStyles.subtitleText]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {settingsData.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>{section.section}</Text>
            <View style={[styles.settingsGroup, dynamicStyles.card]}>
              {section.items.map((item, itemIndex) => {
                const IconComponent = item.icon;
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[styles.settingItem, dynamicStyles.settingItem, itemIndex === section.items.length - 1 && styles.settingItemLast]}
                    disabled={item.type === 'disabled'}
                    onPress={item.type === 'toggle' ? item.onToggle : undefined}
                  >
                    <View style={[styles.settingIconContainer, dynamicStyles.settingIconContainer]}><IconComponent size={20} style={dynamicStyles.settingIcon} /></View>
                    <View style={styles.settingContent}>
                      <Text style={[styles.settingTitle, dynamicStyles.settingTitle]}>{item.title}</Text>
                      <Text style={[styles.settingSubtitle, dynamicStyles.settingSubtitle]}>{item.subtitle}</Text>
                    </View>
                    <View style={styles.settingControl}>
                      {item.type === 'toggle' && <Switch value={item.value} onValueChange={item.onToggle} trackColor={{ false: '#E5E7EB', true: colors.primary }} thumbColor="#FFFFFF" />}
                      {item.type === 'navigation' && <ChevronRight size={20} color={colors.textSecondary} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, paddingTop: 16 },
  title: { fontSize: isTablet ? 32 : 28, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: isTablet ? 18 : 16 },
  content: { flex: 1, paddingHorizontal: 24 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: isTablet ? 20 : 18, fontWeight: '600', marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { borderRadius: 12, padding: 16, alignItems: 'center', minWidth: isTablet ? 140 : 120, flex: 1, borderWidth: 1 },
  statValue: { fontSize: isTablet ? 24 : 20, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: isTablet ? 12 : 11 },
  settingsGroup: { borderRadius: 16, borderWidth: 1 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  settingItemLast: { borderBottomWidth: 0 },
  settingIconContainer: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  settingContent: { flex: 1 },
  settingTitle: { fontSize: isTablet ? 16 : 14, fontWeight: '600', marginBottom: 2 },
  settingSubtitle: { fontSize: isTablet ? 14 : 12 },
  settingControl: { marginLeft: 16 },
});
