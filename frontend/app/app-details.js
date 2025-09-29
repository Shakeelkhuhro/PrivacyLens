import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import DataTypeIcon from '../src/components/DataTypeIcon';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';
import { getScoreColor, getScoreDescription } from '../src/utils/privacyUtils';

export default function AppDetailsScreen() {
  const router = useRouter();
  const { app } = useLocalSearchParams();
  const parsedApp = JSON.parse(app);
  
  const scoreColor = getScoreColor(parsedApp.privacyScore);
  const scoreDescription = getScoreDescription(parsedApp.privacyScore);

  const handlePrivacyPolicyPress = () => {
    if (parsedApp.privacyPolicyUrl) {
      Linking.openURL(parsedApp.privacyPolicyUrl);
    }
  };

  // Function to format downloads count
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
    
    // Add category information
    if (parsedApp.category) {
      descriptionParts.push(`a ${parsedApp.category.toLowerCase()} application`);
    } else {
      descriptionParts.push('a mobile application');
    }
    
    // Add developer information
    if (parsedApp.developer) {
      descriptionParts.push(`developed by ${parsedApp.developer}`);
    }
    
    // Add privacy score information that aligns with Privacy Insights
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
    
    // Add download information
    if (parsedApp.downloads) {
      descriptionParts.push(`and has been downloaded ${formatDownloads(parsedApp.downloads)} times`);
    }
    
    // Add privacy policy status
    if (parsedApp.privacyPolicyUrl) {
      descriptionParts.push('The app provides a privacy policy for user review');
    } else {
      descriptionParts.push('No specific privacy policy link was found for this application');
    }
    
    // Join all parts into a coherent description
    let description = descriptionParts.join(' ');
    
    // Ensure the description ends with a period
    if (!description.endsWith('.')) {
      description += '.';
    }
    
    // Capitalize the first letter
    description = description.charAt(0).toUpperCase() + description.slice(1);
    
    return description;
  };

  // Function to extract data types from backend dataSafety information
  const getDataTypes = () => {
    // If dataTypes field exists, use it
    if (parsedApp.dataTypes && parsedApp.dataTypes.length > 0) {
      return parsedApp.dataTypes;
    }
    
    // Extract from dataSafety.dataCollected if available
    const dataTypes = [];
    if (parsedApp.dataSafety && parsedApp.dataSafety.dataCollected) {
      parsedApp.dataSafety.dataCollected.forEach(item => {
        if (item.type && !dataTypes.includes(item.type)) {
          dataTypes.push(item.type);
        }
      });
    }
    
    // Extract from dataCollected if available
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

  return (
    <SafeAreaView style={styles.container}>
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

        {/* App Overview Section */}
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

        {/* Privacy Score Section */}
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

        {/* Data Collected Section */}
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

        {/* Security Practices Section */}
        {parsedApp.dataSafety?.securityPractices && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Practices</Text>
            <View style={styles.securityCard}>
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
            </View>
          </View>
        )}

        {/* App Information Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>App Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              {getAppDescription()}
            </Text>
          </View>
        </View>

        {/* Privacy Insights Section */}
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

        {/* Recommendations Section */}
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
  // New styles for the information sections matching the image layout
  infoSection: {
    marginBottom: 24,
    marginLeft: 0, // Remove left margin to align with App Overview
  },
  infoSectionTitle: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: 12,
    marginLeft: 0, // Align with App Overview title
    fontSize: 22,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginLeft: 0, // Remove left margin to align with content
  },
  infoText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    fontSize: 16,
    textAlign: 'left',
  },
});