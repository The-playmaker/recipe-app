import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Coffee, Wine, Sparkles, TrendingUp } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const featuredDrinks = [
  {
    id: 1,
    name: 'Classic Mojito',
    category: 'Cocktail',
    image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    time: '5 min'
  },
  {
    id: 2,
    name: 'Espresso Martini',
    category: 'Coffee Cocktail',
    image: 'https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Medium',
    time: '3 min'
  },
  {
    id: 3,
    name: 'Virgin Piña Colada',
    category: 'Mocktail',
    image: 'https://images.pexels.com/photos/1304540/pexels-photo-1304540.jpeg?auto=compress&cs=tinysrgb&w=800',
    difficulty: 'Easy',
    time: '4 min'
  }
];

const categories = [
  { id: 1, name: 'Cocktails', icon: Wine, color: '#DC2626', count: 24 },
  { id: 2, name: 'Coffee Drinks', icon: Coffee, color: '#92400E', count: 18 },
  { id: 3, name: 'Mocktails', icon: Sparkles, color: '#0F766E', count: 15 },
  { id: 4, name: 'Trending', icon: TrendingUp, color: '#7C3AED', count: 8 }
];

export default function HomeScreen() {
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
              const IconComponent = category.icon;
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>67</Text>
              <Text style={styles.statLabel}>Total Recipes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Most Popular</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>New This Week</Text>
            </View>
          </View>
        </View>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isTablet ? 22 : 20,
    fontFamily: 'Inter-SemiBold',
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
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
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
  },
  featuredImage: {
    width: '100%',
    height: isTablet ? 180 : 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featuredContent: {
    padding: 16,
  },
  featuredName: {
    fontSize: isTablet ? 18 : 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  featuredCategory: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featuredDifficulty: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  featuredTime: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 14 : 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
});
