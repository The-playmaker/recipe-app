import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coffee, Wine, Sparkles, TrendingUp } from 'lucide-react-native';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/useTheme'; // Importerer theme-hooken

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const categoryIcons = {
  Cocktails: Wine,
  'Coffee Drinks': Coffee,
  Mocktails: Sparkles,
  Trending: TrendingUp,
};

// Har kun én 'export default' på toppnivå
export default function HomeScreen() {
  const { colors } = useTheme(); // Henter farger og temastatus
  const [featuredDrinks, setFeaturedDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, popular: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesSnapshot, featuredDrinksSnapshot, allDrinksSnapshot] = await Promise.all([
          getDocs(collection(db, 'categories')),
          getDocs(query(collection(db, 'drinks'), where('featured', '==', true))),
          getDocs(collection(db, 'drinks'))
        ]);
        
        const allDrinksData = allDrinksSnapshot.docs.map(doc => doc.data());
        const featuredDrinksData = featuredDrinksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const categoriesData = categoriesSnapshot.docs.map(doc => {
            const category = { id: doc.id, ...doc.data() };
            const count = allDrinksData.filter(drink => drink.category === category.name).length;
            return { ...category, count };
        });
        
        setCategories(categoriesData);
        setFeaturedDrinks(featuredDrinksData);
        setStats({ total: allDrinksSnapshot.size, popular: 0, new: 0 }); 

      } catch (error) {
        console.error("Klarte ikke å hente data for Hjem-siden:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lager dynamiske stiler som endrer seg med temaet
  const dynamicStyles = StyleSheet.create({
      container: { flex: 1, backgroundColor: colors.background },
      text: { color: colors.text },
      textSecondary: { color: colors.textSecondary },
      card: { backgroundColor: colors.card, borderColor: colors.border },
      featuredCard: { backgroundColor: colors.card, borderColor: colors.border, shadowColor: '#000' },
  });

  if (loading) {
    return <SafeAreaView style={dynamicStyles.container}><ActivityIndicator style={{flex: 1}} size="large" color={colors.primary} /></SafeAreaView>;
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <Text style={[styles.title, dynamicStyles.text]}>Drinks & Recipes</Text>
            <Text style={[styles.subtitle, dynamicStyles.textSecondary]}>Welcome to your team's recipe book</Text>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Featured Drinks</Text>
          {featuredDrinks.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 8 }}>
              {featuredDrinks.map((drink) => (
                <TouchableOpacity key={drink.id} style={[styles.featuredCard, dynamicStyles.featuredCard]} onPress={() => router.push(`/recipe/${drink.id}`)}>
                  <Image source={{ uri: drink.image }} style={styles.featuredImage} />
                  <View style={styles.featuredContent}><Text style={[styles.featuredName, dynamicStyles.text]} numberOfLines={1}>{drink.name}</Text><Text style={styles.featuredCategory}>{drink.category}</Text></View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <Text style={[styles.emptyText, dynamicStyles.textSecondary]}>No featured drinks yet.</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              const IconComponent = categoryIcons[category.name] || Sparkles; 
              return (
                <TouchableOpacity 
                  key={category.id} 
                  style={[styles.categoryCard, dynamicStyles.card]}
                  onPress={() => router.push({ pathname: '/(tabs)/recipes', params: { category: category.name }})}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}><IconComponent size={24} color="#FFFFFF" /></View>
                  <Text style={[styles.categoryName, dynamicStyles.text]}>{category.name}</Text>
                  <Text style={[styles.categoryCount, dynamicStyles.textSecondary]}>{category.count} recipes</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, dynamicStyles.text]}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, dynamicStyles.card]}><Text style={styles.statNumber}>{stats.total}</Text><Text style={[styles.statLabel, dynamicStyles.textSecondary]}>Total Recipes</Text></View>
            <View style={[styles.statCard, dynamicStyles.card]}><Text style={styles.statNumber}>{stats.popular}</Text><Text style={[styles.statLabel, dynamicStyles.textSecondary]}>Most Popular</Text></View>
            <View style={[styles.statCard, dynamicStyles.card]}><Text style={styles.statNumber}>{stats.new}</Text><Text style={[styles.statLabel, dynamicStyles.textSecondary]}>New This Week</Text></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Generelle stiler som ikke avhenger av tema
const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  title: { fontSize: isTablet ? 32 : 28, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: isTablet ? 18 : 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16, paddingHorizontal: 24 },
  emptyText: { paddingHorizontal: 24 },
  featuredCard: { borderRadius: 16, width: isTablet ? 220 : 180, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 5, marginRight: 16, borderWidth: 1 },
  featuredImage: { width: '100%', height: 120, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
  featuredContent: { padding: 12 },
  featuredName: { fontSize: 14, fontWeight: '600' },
  featuredCategory: { fontSize: 12, color: '#F59E0B', marginTop: 4 },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 16 },
  categoryCard: { borderRadius: 16, padding: 16, alignItems: 'center', minWidth: isTablet ? 160 : 140, flex: 1, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1 },
  categoryIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  categoryName: { fontSize: 14, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  categoryCount: { fontSize: 12 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 24, gap: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#F59E0B', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
});
