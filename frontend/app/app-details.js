import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import DataTypeIcon from '../src/components/DataTypeIcon';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';
import { getScoreColor, getScoreDescription } from '../src/utils/privacyUtils';
import { API_BASE } from '../src/config';

export default function AppDetailsScreen() {
  const router = useRouter();
  const { app } = useLocalSearchParams();
  const initialParsed = JSON.parse(app);

  const [fullApp, setFullApp] = useState(initialParsed);
  const [loadingFull, setLoadingFull] = useState(false);
  const [fullError, setFullError] = useState(null);

  
  const parsedApp = fullApp;

  const scoreColor = getScoreColor(parsedApp.privacyScore);
  const scoreDescription = getScoreDescription(parsedApp.privacyScore);

  const handlePrivacyPolicyPress = () => {
    if (parsedApp.privacyPolicyUrl) {
      Linking.openURL(parsedApp.privacyPolicyUrl);
    }
  };

  
  const formatDownloads = (downloads) => {
    if (!downloads) return '-';
    
    if (downloads.includes('+')) return downloads;
    
    const num = parseInt(downloads.replace(/,/g, ''));
    if (isNaN(num)) return downloads;
    
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B+';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return downloads + '+';
  };

  // Function to format rating
  const formatRating = (rating) => {
    if (!rating) return '-';
    return parseFloat(rating).toFixed(1);
  };

  // Function to generate app description that aligns with Privacy Insights
  const getAppDescription = () => {
    // Check if we have notes from backend (this is what your backend provides)
    if (parsedApp.notes) {
      return parsedApp.notes;
    }
    
    // Generate a meaningful description that aligns with privacy insights
    const descriptionParts = [];
    
    // Add basic app information
    if (parsedApp.appName || parsedApp.name) {
      descriptionParts.push(`${parsedApp.appName || parsedApp.name} is`);
    } else {
      descriptionParts.push('This app is');
    }
    
    
    if (parsedApp.category) {
      descriptionParts.push(`a ${parsedApp.category.toLowerCase()} application`);
    } else {
      descriptionParts.push('a mobile application');
    }
    
    
    if (parsedApp.developer) {
      descriptionParts.push(`developed by ${parsedApp.developer}`);
    }
    
    
    if (parsedApp.privacyScore !== undefined && parsedApp.privacyScore !== null) {
      if (parsedApp.privacyScore >= 70) {
        descriptionParts.push('with good privacy practices and minimal data collection');
      } else if (parsedApp.privacyScore >= 40) {
        descriptionParts.push('with moderate privacy concerns that users should review');
      } else {
        descriptionParts.push('with significant privacy concerns due to substantial data collection');
      }
      descriptionParts.push(`(score: ${parsedApp.privacyScore}/100)`);
    }
    
    
    if (parsedApp.downloads) {
      descriptionParts.push(`and has been downloaded ${formatDownloads(parsedApp.downloads)} times`);
    }
    
    
    if (parsedApp.privacyPolicyUrl) {
      descriptionParts.push('The app provides a privacy policy for user review');
    } else {
      descriptionParts.push('No specific privacy policy link was found for this application');
    }
    
    
    let description = descriptionParts.join(' ');
    
    
    if (!description.endsWith('.')) {
      description += '.';
    }
    
    
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    return description;
  };

  
  const getDataTypes = () => {
    
    if (parsedApp.dataTypes && parsedApp.dataTypes.length > 0) {
      return parsedApp.dataTypes;
    }
    
    
    const dataTypes = [];
    if (parsedApp.dataSafety && parsedApp.dataSafety.dataCollected) {
      parsedApp.dataSafety.dataCollected.forEach(item => {
        if (item.type && !dataTypes.includes(item.type)) {
          dataTypes.push(item.type);
        }
      });
    }
    
    
    if (parsedApp.dataCollected) {
      parsedApp.dataCollected.forEach(item => {
        if (item.type && !dataTypes.includes(item.type)) {
          dataTypes.push(item.type);
        }
      });
    }
    
    return dataTypes;
  };

  const dataTypes = getDataTypes();

  
  useEffect(() => {
    const needFetch = !parsedApp?.dataSafety || !parsedApp?.dataSafety?.securityPractices || !parsedApp?.dataSafety?.securityPractices?.__llmSummary;
    if (!needFetch) return;

    let cancelled = false;

    const loadFullApp = async () => {
      setLoadingFull(true);
      setFullError(null);
      try {
        const idOrName = parsedApp.packageId || parsedApp.id || parsedApp.appName || parsedApp.name;
        if (!idOrName) throw new Error('No identifier available to fetch full details');
  const res = await fetch(`${API_BASE}/api/app/${encodeURIComponent(idOrName)}`);
        if (!res.ok) throw new Error('Failed to fetch full app details');
        const json = await res.json();
        if (cancelled) return;
        const merged = {
          ...(json.metadata || {}),
          dataSafety: json.dataSafety || parsedApp.dataSafety,
          notes: json.notes || parsedApp.notes
        };
        setFullApp(merged);
      } catch (err) {
        if (!cancelled) setFullError(err.message || 'Error fetching details');
      } finally {
        if (!cancelled) setLoadingFull(false);
      }
    };

    loadFullApp();

    return () => { cancelled = true; };
  }, []);

  
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

  return (
    <SafeAreaView style={styles.container}>
      {}
      {parsedApp?.dataSafety?.securityPractices?.__error && (
        <View style={styles.scrapeErrorBanner}>
          <Text style={styles.scrapeErrorText}>Couldn't fetch privacy details from the policy (extraction failed).</Text>
        </View>
      )}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.appHeader}>
          <View style={styles.iconContainer}>
            {parsedApp.icon ? (
              <Image 
                source={{ uri: parsedApp.icon }} 
                style={styles.appIcon}
                resizeMode="contain"
              />
            ) : (
              <DataTypeIcon type={parsedApp.category?.toLowerCase() || 'social'} size={60} />
            )}
          </View>
          <Text style={styles.appName}>{parsedApp.name || parsedApp.appName}</Text>
          <Text style={styles.developer}>{parsedApp.developer}</Text>
          <Text style={styles.category}>{parsedApp.category || 'SOCIAL'}</Text>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Overview</Text>
          <View style={styles.overviewCardCustom}>
            <View style={styles.detailsListCustom}>
              <View style={styles.detailRowCustom}>
                <Text style={styles.detailLabelCustom}>App Name</Text>
                <Text style={styles.detailValueCustom}>{parsedApp.name || parsedApp.appName || '-'}</Text>
              </View>
              <View style={styles.detailRowCustom}>
                <Text style={styles.detailLabelCustom}>Developer</Text>
                <Text style={styles.detailValueCustom}>{parsedApp.developer || '-'}</Text>
              </View>
              <View style={styles.detailRowCustom}>
                <Text style={styles.detailLabelCustom}>Downloads</Text>
                <Text style={styles.detailValueCustom}>{formatDownloads(parsedApp.downloads) || '-'}</Text>
              </View>
              <View style={styles.detailRowCustom}>
                <Text style={styles.detailLabelCustom}>Rating</Text>
                <Text style={styles.detailValueCustom}>{formatRating(parsedApp.ratingValue || parsedApp.rating) || '-'}</Text>
              </View>
              <View style={styles.detailRowCustom}>
                <Text style={styles.detailLabelCustom}>Category</Text>
                <Text style={styles.detailValueCustom}>{parsedApp.category ? parsedApp.category.toUpperCase() : 'SOCIAL'}</Text>
              </View>
              <View style={styles.detailRowCustom}>
                <Text style={styles.detailLabelCustom}>Privacy Policy</Text>
                <TouchableOpacity onPress={handlePrivacyPolicyPress}>
                  <Text style={[styles.detailValueCustom, styles.privacyPolicyLink]}>
                    {parsedApp.privacyPolicyUrl ? 'View Policy' : 'Not Available'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {}
        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Privacy Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {parsedApp.privacyScore !== undefined && parsedApp.privacyScore !== null ? parsedApp.privacyScore : 'N/A'}
            </Text>
            <Text style={styles.scoreDescription}>
              {parsedApp.privacyScore !== undefined && parsedApp.privacyScore !== null ? scoreDescription : 'Not Rated'}
            </Text>
          </View>
        </View>

        {}
        {dataTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Collected</Text>
            <View style={styles.tagsContainer}>
              {dataTypes.map((dataType, index) => (
                <View key={index} style={styles.tag}>
                  <DataTypeIcon type={dataType.toLowerCase()} size={16} />
                  <Text style={styles.tagText}>{dataType}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Practices</Text>
          <View style={styles.securityCard}>
            {parsedApp.dataSafety?.securityPractices ? (
              <>
                {parsedApp.dataSafety.securityPractices.encryptedInTransit && (
                  <View style={styles.securityItem}>
                    <Icon name="lock-check" size={20} color={colors.success} />
                    <Text style={styles.securityText}>Data encrypted in transit</Text>
                  </View>
                )}
                {parsedApp.dataSafety.securityPractices.secureConnection && (
                  <View style={styles.securityItem}>
                    <Icon name="shield-check" size={20} color={colors.success} />
                    <Text style={styles.securityText}>Secure connection required</Text>
                  </View>
                )}
                {parsedApp.dataSafety.securityPractices.userDataDeletionRequest && (
                  <View style={styles.securityItem}>
                    <Icon name="delete-restore" size={20} color={colors.success} />
                    <Text style={styles.securityText}>User data deletion available</Text>
                  </View>
                )}
              </>
            ) : (
              
              loadingFull ? (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <ActivityIndicator size="small" color={colors.accent} />
                  <Text style={[styles.securityText, { marginTop: 8 }]}>Loading privacy details...</Text>
                </View>
              ) : fullError ? (
                <View style={{ paddingVertical: 12 }}>
                  <Text style={[styles.securityText, { color: colors.error }]}>Could not load privacy details: {fullError}</Text>
                  <TouchableOpacity onPress={() => {
                    
                    setFullApp(initialParsed);
                    setLoadingFull(true);
                    setFullError(null);
                    
                    (async () => {
                      try {
                        const idOrName = parsedApp.packageId || parsedApp.id || parsedApp.appName || parsedApp.name;
                        const res = await fetch(`${API_BASE}/api/app/${encodeURIComponent(idOrName)}`);
                        if (!res.ok) throw new Error('Failed to fetch full app details');
                        const json = await res.json();
                        const merged = {
                          ...(json.metadata || {}),
                          dataSafety: json.dataSafety || parsedApp.dataSafety,
                          notes: json.notes || parsedApp.notes
                        };
                        setFullApp(merged);
                      } catch (err) {
                        setFullError(err.message || 'Error fetching details');
                      } finally { setLoadingFull(false); }
                    })();
                  }} style={{ marginTop: 8 }}>
                    <Text style={[styles.detailValueCustom, { fontSize: 14 }]}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ paddingVertical: 12 }}>
                  <Text style={styles.securityText}>No security practice details available.</Text>
                </View>
              )
            )}
          </View>
          {}
          {loadingFull ? (
            <View style={{ paddingVertical: 12, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : fullError ? (
            <Text style={[styles.securityText, { color: colors.error, marginTop: 8 }]}>Summary not available: {fullError}</Text>
          ) : (
            renderPolicySummary(parsedApp.dataSafety?.securityPractices?.__llmSummary || parsedApp.__llmSummary || parsedApp.securityPractices?.__llmSummary)
          )}
        </View>

        {}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {getAppDescription()}
            </Text>
          </View>
        </View>

        {}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Privacy Insights</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              This app has a privacy score of {parsedApp.privacyScore}/100. 
              {parsedApp.privacyScore >= 70 
                ? ' This indicates good privacy practices with minimal data collection.'
                : parsedApp.privacyScore >= 40
                ? ' This indicates moderate privacy concerns. Consider reviewing what data is collected.'
                : ' This indicates significant privacy concerns. This app collects substantial amounts of user data.'
              }
            </Text>
          </View>
        </View>

        {}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>Recommendations</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {parsedApp.privacyScore >= 70 ? (
                '✅ This app follows good privacy practices. Safe to use with standard precautions.'
              ) : (
                '⚠️ Review app permissions carefully and consider alternatives if privacy is a concern.'
              )}
            </Text>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.heading2,
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  appName: {
    ...typography.heading2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
  },
  developer: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
    fontSize: 16,
  },
  category: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'uppercase',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: 12,
    marginLeft: 8,
    fontSize: 22,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreValue: {
    ...typography.score,
    marginBottom: 8,
    fontSize: 48,
  },
  scoreDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
  overviewCardCustom: {
    backgroundColor: '#23263a',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginBottom: 16,
    position: 'relative',
    minHeight: 300,
    justifyContent: 'center',
  },
  detailsListCustom: {
    marginTop: 0,
  },
  detailRowCustom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#31344b',
    paddingVertical: 18,
    paddingHorizontal: 0,
  },
  detailLabelCustom: {
    color: '#b0b3c7',
    fontSize: 20,
    fontWeight: '400',
    flex: 1,
    textAlign: 'left',
  },
  detailValueCustom: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    flex: 1,
    textAlign: 'right',
    letterSpacing: 0.5,
  },
  privacyPolicyLink: {
    color: '#2de2e6',
    textDecorationLine: 'underline',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  tagText: {
    ...typography.caption,
    color: colors.text,
  },
  securityCard: {
    backgroundColor: '#23263a',
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityText: {
    color: colors.text,
    fontSize: 16,
  },
  
  infoSection: {
    marginBottom: 24,
    marginLeft: 0, 
  },
  infoSectionTitle: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: 12,
    marginLeft: 0, 
    fontSize: 22,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginLeft: 0, 
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    fontSize: 16,
    textAlign: 'left',
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
    fontSize: 14,
    marginBottom: 6,
  },
  scrapeErrorBanner: {
    backgroundColor: '#ffdddd',
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
    paddingVertical: 10,
    paddingHorizontal: 12,
    margin: 12,
    borderRadius: 8,
  },
  scrapeErrorText: {
    color: colors.error,
    ...typography.body,
    fontWeight: '700'
  },
});