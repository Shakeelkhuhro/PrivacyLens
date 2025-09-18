import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

import AppCard from '../../src/components/AppCard';
import SearchBar from '../../src/components/SearchBar';
import DrawerMenu from '../../src/components/DrawerMenu'; // ADD THIS IMPORT
import { getRecentAnalysis, mockApps } from '../../src/data/mockData';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false); // ADD THIS STATE
  const router = useRouter();

  const recentAnalysis = getRecentAnalysis().slice(0, 3); // Show only first 3
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

  // ADD THESE FUNCTIONS
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleSearchPress = () => {
    console.log('Search pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}> {/* ADD onPress */}
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}> {/* ADD onPress */}
            <Icon name="magnify" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* App Title */}
        <View style={styles.titleContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 80, height: 80, marginBottom: 12 }}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Protecting your digital privacy</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search apps, categories..."
          />
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/ranking')}> {/* ADD onPress */}
            <View style={styles.statIcon}>
              <Icon name="apps" size={24} color={colors.accent} />
            </View>
            <Text style={styles.statValue}>{totalApps}</Text>
            <Text style={styles.statLabel}>Total Apps Analyzed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => router.push('/ranking')}> {/* ADD onPress */}
            <View style={styles.statIcon}>
              <Icon name="alert-circle" size={24} color={colors.error} />
            </View>
            <Text style={styles.statValue}>{dataHungryApps}</Text>
            <Text style={styles.statLabel}>Data Hungry Apps</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Analysis */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analysis</Text>
            <TouchableOpacity onPress={() => router.push('/ranking')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.appList}>
            {recentAnalysis.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onPress={() => handleAppPress(app)}
                showArrow
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* ADD THIS DRAWER MENU COMPONENT AT THE END */}
      <DrawerMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
    </SafeAreaView>
  );
}

// Your existing styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  appTitle: {
    ...typography.heading1,
    color: colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    ...typography.heading1,
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text,
  },
  viewAllText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '600',
  },
  appList: {
    gap: 12,
  },
});