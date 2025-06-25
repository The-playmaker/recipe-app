import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Bruk Lucide React for web, Lucide React Native for native
// For enkelhet: vi bruker bare tekstikon her, bytt ut med egne ikoner når du får det til
const IconPlaceholder = ({ name }: { name: string }) => (
  <View style={styles.settingIcon}>
    <Text>{name}</Text>
  </View>
);

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const settingsData = [
    {
      section: 'App Preferences',
      items: [
        {
          iconName: 'Bell',
          title: 'Notifications',
          subtitle: 'Get alerts for new recipes',
          type: 'toggle',
          value: notifications,
          onToggle: setNotifications,
        },
        {
          iconName: 'Palette',
          title: 'Dark Mode',
          subtitle: 'Switch to dark theme',
          type: 'toggle',
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          iconName: 'Download',
          title: 'Auto Sync',
          subtitle: 'Automatically sync recipes',
          type: 'toggle',
          value: autoSync,
          onToggle: setAutoSync,
        },
      ],
    },
    {
      section: 'Support',
      items: [
        {
          iconName: 'HelpCircle',
          title: 'Help & Support',
          subtitle: 'Get help with the app',
          type: 'navigation',
        },
        {
          iconName: 'Info',
          title: 'About',
          subtitle: 'App version and info',
          type: 'navigation',
        },
      ],
    },
  ];

  const appStats = [
    { label: 'Total Recipes', value: '67' },
    { label: 'Favorites', value: '12' },
    { label: 'Categories', value: '8' },
    { label: 'Last Updated', value: 'Today' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Statistics</Text>
          <View style={styles.statsGrid}>
            {appStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {settingsData.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.settingsGroup}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[styles.settingItem, itemIndex === section.items.length - 1 && styles.settingItemLast]}
                >
                  <IconPlaceholder name={item.iconName} />
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={styles.settingControl}>
                    {item.type === 'toggle' && (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: '#F59E0B' }}
                        thumbColor="#FFFFFF"
                      />
                    )}
                    {item.type === 'navigation' && <Text style={{ color: '#9CA3AF' }}>›</Text>}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>Drinks & Recipes</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Professional drink recipes for hospitality teams. Built with React Native and Expo.
            </Text>
          </View>
        </View>

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
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: isTablet ? 140 : 120,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isTablet ? 12 : 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
  },
  settingControl: {
    marginLeft: 16,
  },
  appInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appName: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: isTablet ? 14 : 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 100,
  },
});
