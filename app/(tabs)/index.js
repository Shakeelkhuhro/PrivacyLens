import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

import AppCard from '../../src/components/AppCard';
import SearchBar from '../../src/components/SearchBar';
import { getRecentAnalysis, mockApps } from '../../src/data/mockData';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const recentAnalysis = getRecentAnalysis();
  const totalApps = mockApps.length;
  const dataHungryApps = mockApps.filter(app => app.privacyScore < 50).length;

  const handleAppPress = (app) => {
    router.push({
      pathname: '/app-details',
      params: { app: JSON.stringify(app) },
    });
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    // TODO: Implement search logic
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="magnify" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* App Title */}
        <Text style={styles.appTitle}>PrivacyLens</Text>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search apps"
        />

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Apps{'\n'}Analyzed</Text>
            <Text style={styles.statValue}>{totalApps}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Top{'\n'}Data Hungry</Text>
            <Text style={styles.statValue}>{dataHungryApps}</Text>
          </View>
        </View>

        {/* Recent Analysis */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Analysis</Text>
          {recentAnalysis.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onPress={() => handleAppPress(app)}
              showArrow
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  menuButton: { padding: 8 },
  searchButton: { padding: 8 },
  appTitle: {
    ...typography.heading1,
    color: colors.text,
    textAlign: 'center',
    marginVertical: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 10,
  },
  statLabel: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'left',
    marginBottom: 8,
  },
  statValue: {
    ...typography.heading1,
    color: colors.text,
    fontSize: 36,
  },
  sectionContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text,
    marginBottom: 16,
  },
});
