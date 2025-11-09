import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

import AppCard from '../../src/components/AppCard';
import SearchBar from '../../src/components/SearchBar';
import DrawerMenu from '../../src/components/DrawerMenu';
import { API_BASE } from '../../src/config';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [showStats, setShowStats] = useState(true);

  const [recentAnalyzed, setRecentAnalyzed] = useState([]);
  const [initialized, setInitialized] = useState(false);


  const isDataHungryApp = (app) => {
    // Only classify as data-hungry when we have a numeric score
    if (app && app.privacyScore !== null && app.privacyScore !== undefined) {
      const score = Number(app.privacyScore);
      if (!Number.isNaN(score)) return score <= 50;
    }

    // No numeric score -> do not classify
    return false;
  };

  // Calculate stats from recentAnalyzed
  const totalAppsAnalyzed = recentAnalyzed.length;
  const dataHungryApps = recentAnalyzed.filter(app => isDataHungryApp(app.metadata));
  const dataHungryAppsCount = dataHungryApps.length;
  const privacyRespectingAppsCount = recentAnalyzed.filter(app =>
    typeof app.metadata.privacyScore === 'number' && Number(app.metadata.privacyScore) >= 51
  ).length;

  // Load from localStorage on mount (web only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('recentAnalyzed');
      if (stored) {
        try {
          const parsedData = JSON.parse(stored);
          setRecentAnalyzed(parsedData);
        } catch (error) {
          console.error('Error loading recent analyzed apps:', error);
        }
      }
    }
    setInitialized(true);
  }, []);

  
  const addToRecentAnalyzed = (newAppData) => {
    if (!newAppData || !newAppData.metadata) return;

    setRecentAnalyzed(prev => {
      const existingIndex = prev.findIndex(
        a => a.metadata.packageId === newAppData.metadata.packageId
      );
      
      let updated;
      
      if (existingIndex !== -1) {
        
        updated = prev.filter((_, index) => index !== existingIndex);
        
        updated = [newAppData, ...updated];
      } else {
        
        updated = [newAppData, ...prev].slice(0, 10);
      }
      
      
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem('recentAnalyzed', JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
      }
      
      return updated;
    });
  };

  const fetchAppData = async (query) => {
    setLoading(true);
    setError(null);
    setAppData(null);
    try {
    const response = await fetch(`${API_BASE}/api/app/${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('App not found or backend error');
      const data = await response.json();
      
      console.log('Backend response:', data); 
      
      
      
      
      const normalizedScore = (data && data.metadata && data.metadata.privacyScore) != null
        ? data.metadata.privacyScore
        : (data && data.privacyScore) != null
          ? data.privacyScore
          : null;

      const enhancedData = {
        ...data,
        metadata: {
          ...(data.metadata || {}),
          
          privacyScore: normalizedScore !== null ? (Number.isNaN(Number(normalizedScore)) ? null : Number(normalizedScore)) : null
        }
      };
      
      console.log('Enhanced app data:', enhancedData); 
      
      setAppData(enhancedData);
      addToRecentAnalyzed(enhancedData);
      setShowStats(false);
      
      const scrapingError = (enhancedData?.dataSafety?.securityPractices && enhancedData.dataSafety.securityPractices.__error) || null;
      if (scrapingError) {
        setError("Couldn't fetch privacy details (extraction failed)");
      }
      
      
      const finalScore = enhancedData?.metadata?.privacyScore;
      if (typeof finalScore === 'number') {
        if (finalScore <= 50) {
          router.push({ pathname: '/ranking', params: { filter: 'data-hungry' } });
        } else if (finalScore >= 51) {
          router.push({ pathname: '/ranking', params: { filter: 'privacy-respecting' } });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch app data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) fetchAppData(searchQuery.trim());
  };

  
  const handleClearAnalysis = () => {
    setAppData(null);
    setShowStats(true);
    setError(null);
    setLoading(false);
    setSearchQuery('');
  };

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleAppPress = (app) => {
    router.push({ pathname: '/app-details', params: { app: JSON.stringify(app) } });
  };

  
  const renderPolicySummary = (raw) => {
    if (!raw) return null;
    
    let parts = [];
    if (Array.isArray(raw)) {
      parts = raw.map(s => ('' + s).trim()).filter(Boolean).slice(0,4);
    } else if (typeof raw === 'string') {
      parts = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0,4);
    }

    if (parts.length === 0) return null;

    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Privacy details (summary)</Text>
        {parts.map((line, i) => (
          <Text key={i} style={styles.summaryText} numberOfLines={2}>• {line}</Text>
        ))}
      </View>
    );
  };

  
  const navigateToDataHungryApps = () => {
    router.push({
      pathname: '/ranking',
      params: { filter: 'data-hungry' }
    });
  };

  const navigateToPrivacyRespectingApps = () => {
    router.push({
      pathname: '/ranking',
      params: { filter: 'privacy-respecting' }
    });
  };

  const navigateToAllApps = () => {
    router.push('/ranking');
  };

  
  const clearRecentAnalyzed = () => {
    setRecentAnalyzed([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('recentAnalyzed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Icon name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchSubmit}>
            <Icon name="magnify" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {}
        <View style={styles.titleContainer}>
          <Image
            source={require('../../assets/r-bg.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>Protecting your digital privacy</Text>
        </View>

        {}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search apps, categories..."
            onSubmit={handleSearchSubmit}
          />
        </View>

        {}
        {loading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={styles.loadingText}>Loading app data...</Text>
            </View>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleClearAnalysis} style={styles.tryAgainButton}>
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {appData && !showStats ? (
          <View style={styles.searchResultsContainer}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>Search Results</Text>
              <TouchableOpacity onPress={handleClearAnalysis}>
                <Icon name="close" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <AppCard
              app={{
                id: appData.metadata.packageId,
                name: appData.metadata.appName,
                developer: appData.metadata.developer,
                icon: appData.metadata.icon,
                privacyScore: appData.metadata.privacyScore, 
                isDataHungry: isDataHungryApp(appData.metadata)
              }}
              onPress={() => {
                router.push({
                  pathname: '/app-details',
                  params: { app: JSON.stringify(appData.metadata) },
                });
              }}
              showArrow={true}
            />
            
            {}
            {appData.metadata.privacyScore !== undefined && appData.metadata.privacyScore !== null ? (
              isDataHungryApp(appData.metadata) ? (
                <View style={styles.dataHungryWarning}>
                  <Icon name="alert" size={20} color={colors.error} />
                  <Text style={styles.dataHungryWarningText}>
                    This app is data-hungry. Privacy Score: {appData.metadata.privacyScore}/100
                  </Text>
                </View>
              ) : (
                <View style={styles.privacyRespectingWarning}>
                  <Icon name="shield-check" size={20} color={colors.success} />
                  <Text style={styles.privacyRespectingWarningText}>
                    This app is privacy-respecting. Privacy Score: {appData.metadata.privacyScore}/100
                  </Text>
                </View>
              )
            ) : (
              <View style={styles.noScoreWarning}>
                <Icon name="help-circle" size={20} color={colors.textSecondary} />
                <Text style={styles.noScoreWarningText}>
                  Privacy score not available from backend analysis.
                </Text>
              </View>
            )}
            {}
            {appData?.dataSafety?.securityPractices?.__llmSummary && (
              renderPolicySummary(appData.dataSafety.securityPractices.__llmSummary)
            )}
          </View>
        ) : (
          <View>
            {}
            <View style={styles.statsContainer}>
              {}
              <TouchableOpacity 
                style={styles.statCard} 
                onPress={navigateToAllApps}
                disabled={totalAppsAnalyzed === 0}
              >
                <View style={styles.statIcon}>
                  <Icon name="apps" size={24} color={totalAppsAnalyzed > 0 ? colors.accent : colors.textSecondary} />
                </View>
                <Text style={styles.statValue}>{totalAppsAnalyzed}</Text>
                <Text style={styles.statLabel}>Total Apps Analyzed</Text>
              </TouchableOpacity>
              
              {}
              <TouchableOpacity 
                style={[
                  styles.statCard, 
                  dataHungryAppsCount > 0 && styles.dataHungryStatCard
                ]} 
                onPress={navigateToDataHungryApps}
                disabled={dataHungryAppsCount === 0}
              >
                <View style={styles.statIcon}>
                  <Icon name="alert-circle" size={24} color={dataHungryAppsCount > 0 ? colors.error : colors.textSecondary} />
                </View>
                <Text style={[
                  styles.statValue,
                  dataHungryAppsCount > 0 && styles.dataHungryStatValue
                ]}>
                  {dataHungryAppsCount}
                </Text>
                <Text style={styles.statLabel}>Data Hungry Apps</Text>
              </TouchableOpacity>

              {}
              <TouchableOpacity 
                style={[
                  styles.statCard, 
                  privacyRespectingAppsCount > 0 && styles.privacyRespectingStatCard
                ]} 
                onPress={navigateToPrivacyRespectingApps}
                disabled={privacyRespectingAppsCount === 0}
              >
                <View style={styles.statIcon}>
                  <Icon name="shield-check" size={24} color={privacyRespectingAppsCount > 0 ? colors.success : colors.textSecondary} />
                </View>
                <Text style={[
                  styles.statValue,
                  privacyRespectingAppsCount > 0 && styles.privacyRespectingStatValue
                ]}>
                  {privacyRespectingAppsCount}
                </Text>
                <Text style={styles.statLabel}>Privacy Respecting</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Analysis</Text>
            <View style={styles.sectionHeaderActions}>
              {recentAnalyzed.length > 0 && (
                <TouchableOpacity onPress={clearRecentAnalyzed} style={styles.clearButton}>
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              )}
              {}
              <TouchableOpacity onPress={navigateToAllApps}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.recentAppsInfo}>
            <Text style={styles.recentAppsInfoText}>
              Showing {Math.min(recentAnalyzed.length, 10)} most recent apps analyzed
              {recentAnalyzed.length > 0 && (
                ` • Real privacy scores from backend analysis`
              )}
            </Text>
          </View>
          
          <View style={styles.appList}>
            {!initialized ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : recentAnalyzed.length === 0 ? (
              <Text style={styles.noAnalysisText}>No apps analyzed yet. Search for an app to begin.</Text>
            ) : (
              recentAnalyzed.slice(0, 10).map((app, idx) => (
                <AppCard
                  key={app.metadata.packageId || idx}
                  app={{
                    id: app.metadata.packageId,
                    name: app.metadata.appName,
                    developer: app.metadata.developer,
                    privacyScore: app.metadata.privacyScore, 
                    icon: app.metadata.icon,
                    isDataHungry: isDataHungryApp(app.metadata),
                    ...app.metadata
                  }}
                  onPress={() => handleAppPress(app.metadata)}
                  showArrow
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
      <DrawerMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
      />
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
  summaryContainer: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    borderColor: colors.border,
    borderWidth: 1,
  },
  summaryTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 6,
  },
  summaryText: {
    ...typography.body,
    color: colors.text,
    fontSize: 13,
    marginBottom: 2,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchResultsTitle: {
    ...typography.heading2,
    color: colors.text,
  },
  dataHungryWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  dataHungryWarningText: {
    color: colors.error,
    fontSize: 14,
    flex: 1,
  },
  privacyRespectingWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  privacyRespectingWarningText: {
    color: colors.success,
    fontSize: 14,
    flex: 1,
  },
  noScoreWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  noScoreWarningText: {
    color: colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 120,
  },
  dataHungryStatCard: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  privacyRespectingStatCard: {
    borderColor: colors.success,
    borderWidth: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    ...typography.heading1,
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dataHungryStatValue: {
    color: colors.error,
  },
  privacyRespectingStatValue: {
    color: colors.success,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontSize: 12,
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
  sectionHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
  },
  clearButtonText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  viewAllText: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '600',
  },
  recentAppsInfo: {
    marginBottom: 12,
  },
  recentAppsInfoText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    fontStyle: 'italic',
  },
  appList: {
    gap: 12,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 31, 54, 0.7)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#23263a',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 18,
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  errorText: {
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  tryAgainButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tryAgainText: {
    color: colors.background,
    fontWeight: '600',
  },
  noAnalysisText: {
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
});