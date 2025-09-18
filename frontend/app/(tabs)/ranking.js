import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppCard from '../../src/components/AppCard';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';
import { mockApps } from '../../src/data/mockData';
import { useRouter } from 'expo-router';

export default function RankingScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('PRIVACY-RESPECTING');

  const privacyRespectingApps = mockApps
    .filter(app => app.privacyScore >= 70)
    .sort((a, b) => b.privacyScore - a.privacyScore);

  const dataHungryApps = mockApps
    .filter(app => app.privacyScore < 70)
    .sort((a, b) => a.privacyScore - b.privacyScore);

  const currentApps =
    activeTab === 'PRIVACY-RESPECTING'
      ? privacyRespectingApps
      : dataHungryApps;

  const handleAppPress = (app) => {
    router.push({
      pathname: '/app-details',
      params: { app: JSON.stringify(app) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ranking</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'DATA-HUNGRY' && styles.activeTab]}
          onPress={() => setActiveTab('DATA-HUNGRY')}
        >
          <Text style={[styles.tabText, activeTab === 'DATA-HUNGRY' && styles.activeTabText]}>
            DATA-HUNGRY
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'PRIVACY-RESPECTING' && styles.activeTab]}
          onPress={() => setActiveTab('PRIVACY-RESPECTING')}
        >
          <Text style={[styles.tabText, activeTab === 'PRIVACY-RESPECTING' && styles.activeTabText]}>
            PRIVACY-RESPECTING
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {currentApps.map((app, index) => (
          <View key={app.id} style={styles.appItemContainer}>
            <AppCard
              app={app}
              onPress={() => handleAppPress(app)}
              showScore={true}
              rank={index + 1}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 25,
    backgroundColor: colors.surface,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appItemContainer: {
    marginBottom: 12,
  },
});