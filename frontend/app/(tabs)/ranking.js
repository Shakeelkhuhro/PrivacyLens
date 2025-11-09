import React, { useState, useEffect } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';


const DATA_HUNGRY_APP_PATTERNS = [
  'instagram', 'facebook', 'snapchat', 'tiktok', 'whatsapp',
  'twitter', 'linkedin', 'amazon', 'alexa', 'paypal', 'google',
  'youtube', 'netflix', 'uber', 'grab', 'foodpanda', 'zoom',
  'telegram', 'wechat', 'messenger'
];

export default function RankingScreen() {
  const router = useRouter();
  const { filter } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('ALL-APPS'); 

  
  const [recentAnalyzed, setRecentAnalyzed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentAnalyzedApps();
  }, []);

  
  useEffect(() => {
    if (filter === 'privacy-respecting') {
      setActiveTab('PRIVACY-RESPECTING');
    } else if (filter === 'data-hungry') {
      setActiveTab('DATA-HUNGRY');
    } else {
      setActiveTab('ALL-APPS'); 
    }
  }, [filter]);

  const loadRecentAnalyzedApps = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('recentAnalyzed');
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          console.log('Loaded from localStorage:', parsedData);
          
          
          const apps = parsedData.map(item => {
            const metadata = item.metadata || item;
            return {
              id: metadata.packageId || metadata.id || Math.random().toString(),
              name: metadata.appName || metadata.name || 'Unknown App',
              developer: metadata.developer || 'Unknown Developer',
              icon: metadata.icon,
              privacyScore: metadata.privacyScore !== undefined ? metadata.privacyScore : null,
              category: metadata.category,
              ...metadata
            };
          });
          
          setRecentAnalyzed(apps);
        } catch (error) {
          console.error('Error parsing recent analyzed apps:', error);
        }
      }
    }
    setLoading(false);
  };

  
  const isDataHungryApp = (app) => {
    if (app.privacyScore !== null && app.privacyScore !== undefined) {
      return Number(app.privacyScore) <= 50;
    }

    // No numeric score -> do not classify
    return false;
  };

  // Categorize apps
  const dataHungryApps = recentAnalyzed
    .filter(app => isDataHungryApp(app))
    .sort((a, b) => (Number(a.privacyScore) || 0) - (Number(b.privacyScore) || 0));

  const privacyRespectingApps = recentAnalyzed
    .filter(app => typeof app.privacyScore === 'number' && Number(app.privacyScore) >= 51)
    .sort((a, b) => (Number(b.privacyScore) || 0) - (Number(a.privacyScore) || 0));

  // All apps sorted by privacy score (best to worst)
  const allApps = recentAnalyzed.sort((a, b) => (b.privacyScore || 0) - (a.privacyScore || 0));

  const currentApps =
    activeTab === 'DATA-HUNGRY' ? dataHungryApps :
    activeTab === 'PRIVACY-RESPECTING' ? privacyRespectingApps :
    allApps;

  const handleAppPress = (app) => {
    router.push({
      pathname: '/app-details',
      params: { app: JSON.stringify(app) },
    });
  };

  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading apps...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
          style={[styles.tab, activeTab === 'ALL-APPS' && styles.activeTab]}
          onPress={() => handleTabChange('ALL-APPS')}
        >
          <Icon 
            name="apps" 
            size={16} 
            color={activeTab === 'ALL-APPS' ? colors.background : colors.accent} 
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'ALL-APPS' && styles.activeTabText]}>
            ALL APPS
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{allApps.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'DATA-HUNGRY' && styles.activeTab]}
          onPress={() => handleTabChange('DATA-HUNGRY')}
        >
          <Icon 
            name="alert-circle" 
            size={16} 
            color={activeTab === 'DATA-HUNGRY' ? colors.background : colors.error} 
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'DATA-HUNGRY' && styles.activeTabText]}>
            DATA-HUNGRY
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{dataHungryApps.length}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'PRIVACY-RESPECTING' && styles.activeTab]}
          onPress={() => handleTabChange('PRIVACY-RESPECTING')}
        >
          <Icon 
            name="shield-check" 
            size={16} 
            color={activeTab === 'PRIVACY-RESPECTING' ? colors.background : colors.success} 
            style={styles.tabIcon}
          />
          <Text style={[styles.tabText, activeTab === 'PRIVACY-RESPECTING' && styles.activeTabText]}>
            PRIVACY-RESPECTING
          </Text>
          <View style={styles.tabBadge}>
            <Text style={styles.tabBadgeText}>{privacyRespectingApps.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTextContainer}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'ALL-APPS' ? 'All Analyzed Apps' :
               activeTab === 'DATA-HUNGRY' ? 'Data Hungry Apps' : 
               'Privacy Respecting Apps'}
            </Text>
            <Text style={styles.sectionSubtitle}>
              {activeTab === 'ALL-APPS' ? 'All apps analyzed sorted by privacy score' :
               activeTab === 'DATA-HUNGRY' ? 'Apps with poor privacy practices and high data collection' :
               'Apps with good privacy practices and minimal data collection'}
            </Text>
          </View>
          <View style={styles.appsCountContainer}>
            <Text style={styles.appsCount}>{currentApps.length}</Text>
            <Text style={styles.appsCountLabel}>apps</Text>
          </View>
        </View>

        {currentApps.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon 
              name={activeTab === 'ALL-APPS' ? "apps" : 
                    activeTab === 'DATA-HUNGRY' ? "shield-off" : "shield-check"} 
              size={64} 
              color={colors.textSecondary} 
            />
            <Text style={styles.emptyStateTitle}>
              {activeTab === 'ALL-APPS' ? 'No Apps Analyzed' :
               activeTab === 'DATA-HUNGRY' ? 'No Data Hungry Apps' : 
               'No Privacy Respecting Apps'}
            </Text>
            <Text style={styles.emptyStateText}>
              {activeTab === 'ALL-APPS' ? 'No apps have been analyzed yet. Search for apps to see their privacy rankings.' :
               activeTab === 'DATA-HUNGRY' ? 'No apps with poor privacy practices found in your recent searches.' :
               'No apps with good privacy practices found in your recent searches.'}
            </Text>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={() => router.push('/')}
            >
              <Icon name="magnify" size={20} color={colors.background} />
              <Text style={styles.searchButtonText}>Search Apps</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.appsList}>
            {currentApps.map((app, index) => (
              <View key={app.id} style={styles.appItemContainer}>
                <AppCard
                  app={app}
                  onPress={() => handleAppPress(app)}
                  showScore={true}
                  rank={index + 1}
                  showDataHungryBadge={isDataHungryApp(app)}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.text,
    fontSize: 24,
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    backgroundColor: colors.surface,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  activeTab: {
    backgroundColor: colors.accent,
  },
  tabIcon: {
    marginRight: 2,
  },
  tabText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: colors.background,
  },
  tabBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 18,
  },
  tabBadgeText: {
    color: colors.background,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  sectionTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: 4,
    fontSize: 18,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  appsCountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
  },
  appsCount: {
    ...typography.heading2,
    color: colors.background,
    fontSize: 20,
    fontWeight: 'bold',
  },
  appsCountLabel: {
    ...typography.caption,
    color: colors.background,
    fontSize: 10,
    opacity: 0.9,
  },
  appsList: {
    paddingHorizontal: 20,
  },
  appItemContainer: {
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyStateTitle: {
    ...typography.heading3,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  searchButtonText: {
    ...typography.button,
    color: colors.background,
    fontWeight: '600',
  },
});