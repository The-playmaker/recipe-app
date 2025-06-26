import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coffee, Wine, Sparkles, TrendingUp } from 'lucide-react-native';
// Importer firestore!
import firestore from '@react-native-firebase/firestore';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

// Hjelpeobjekt for å koble kategorinavn til riktig ikonkomponent
const categoryIcons = {
  Cocktails: Wine,
  'Coffee Drinks': Coffee,
  Mocktails: Sparkles,
  Trending: TrendingUp,
};

// --- ENESTE DEFINISJON AV HomeScreen ---
export default function HomeScreen() {
  // 1. STATE-VARIABLER FOR DATA OG LASTING
  const [featuredDrinks, setFeaturedDrinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, popular: 0, new: 0 });
  const [loading, setLoading] = useState(true);

  // 2. LOGIKK FOR Å HENTE DATA FRA FIREBASE
  useEffect(() => {
    const fetchDataFromFirestore = async () => {
      try {
        // Hent kategorier
        const categoriesSnapshot = await firestore().collection('categories').get();
        const categoriesData = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Hent 'featured' drinker
        const drinksSnapshot = await firestore().collection('drinks').where('featured', '==', true).get();
        const drinksData = drinksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Hent totalt antall drinker for statistikk
        const allDrinksSnapshot = await firestore().collection('drinks').get();
        const totalDrinks = allDrinksSnapshot.size;

        // Oppdater state med dataen fra databasen
        setCategories(categoriesData);
        setFeaturedDrinks(drinksData);
        // Setter de andre stats-verdiene hardkodet for nå
        setStats({ total: totalDrinks, popular: 12, new: 8 });

      } catch (error) {
        console.error("Klarte ikke å hente data fra Firestore:", error);
      } finally {
        // Skjul laste-indikatoren uansett om det feilet eller ikke
        setLoading(false);
      }
    };

    fetchDataFromFirestore();
  }, []); // Tom array betyr at denne effekten kun kjører én gang

  // 3. VIS EN LASTE-INDIKATOR MENS DATA HENTES
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F59E0B" />
        <Text style={styles.loadingText}>Henter oppskrifter...</Text>
      </SafeAreaView>
    );
  }

  // 4. VISNING (JSX) SOM BRUKER DATA FRA STATE
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Drinks & Recipes</Text>
          <Text style={styles.subtitle}>Professional drink recipes for your team</Text>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => {
              // Fikset: Henter riktig ikonkomponent fra categoryIcons-objektet
              const IconComponent = categoryIcons[category.name] || Sparkles; 
              return (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <IconComponent size={24} color="#FFFFFF" />
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryCount}>{category.count} recipes</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Featured Drinks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Drinks</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
            <View style={styles.featuredContainer}>
              {featuredDrinks.map((drink) => (
                <TouchableOpacity key={drink.id} style={styles.featuredCard}>
                  <Image source={{ uri: drink.image }} style={styles.featuredImage} />
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredName}>{drink.name}</Text>
                    <Text style={styles.featuredCategory}>{drink.category}</Text>
                    <View style={styles.featuredMeta}>
                      <Text style={styles.featuredDifficulty}>{drink.difficulty}</Text>
                      <Text style={styles.featuredTime}>{drink.time}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <View style={styles.statsContainer}>
            {/* Fikset: Bruker nå 'stats' fra state-variabelen */}
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Recipes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.popular}</Text>
              <Text style={styles.statLabel}>Most Popular</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.new}</Text>
              <Text style={styles.statLabel}>New This Week</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 5. STYLESHEET
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6B7280',
    fontFamily: 'Inter-Regular',
  },
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
    // fontFamily: 'Inter-Bold', // Sjekk at du har lagt til custom fonts i prosjektet
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    // fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 20,
    // fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    minWidth: isTablet ? 160 : 140,
    flex: isTablet ? 0 : 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: isTablet ? 16 : 14,
    // fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: isTablet ? 14 : 12,
    // fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  featuredContainer: {
    flexDirection: 'row',
    paddingLeft: 24,
    gap: 16,
  },
  featuredCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: isTablet ? 280 : 240,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden', // Sikrer at skyggen ikke blir kuttet
  },
  featuredImage: {
    width: '100%',
    height: isTablet ? 180 : 160,
  },
  featuredContent: {
    padding: 16,
  },
  featuredName: {
    fontSize: isTablet ? 18 : 16,
    // fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featuredCategory: {
    fontSize: isTablet ? 14 : 12,
    // fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#F59E0B',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  featuredDifficulty: {
    fontSize: isTablet ? 14 : 12,
    // fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  featuredTime: {
    fontSize: isTablet ? 14 : 12,
    // fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: isTablet ? 28 : 24,
    // fontFamily: 'Inter-Bold',
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    // fontFamily: 'Inter-Medium',
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
