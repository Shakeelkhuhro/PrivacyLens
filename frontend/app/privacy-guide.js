import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';

export default function PrivacyGuideScreen() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});
  const [completedGuides, setCompletedGuides] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const markGuideComplete = (sectionId) => {
    setCompletedGuides(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const shareGuide = async (section) => {
    try {
      await Share.share({
        message: `Check out this privacy guide from PrivacyLens: ${section.title}\n\n${section.content}\n\nDownload PrivacyLens to learn more about digital privacy!`,
        title: section.title
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share guide');
    }
  };

  const guideSections = [
    {
      id: '1',
      icon: 'shield-key',
      title: 'Understanding Privacy Policies',
      color: '#4CAF50',
      content: 'Learn how to read and understand privacy policies. Look for data collection practices, third-party sharing, and your rights as a user.',
      tips: [
        'Look for "Data Collection" sections',
        'Check third-party sharing policies',
        'Understand your opt-out rights',
        'Review data retention periods'
      ]
    },
    {
      id: '2',
      icon: 'lock',
      title: 'App Permissions',
      color: '#2196F3',
      content: 'Understand what app permissions mean and why apps request access to your camera, location, contacts, and other sensitive data.',
      tips: [
        'Only grant necessary permissions',
        'Review permissions regularly',
        'Use permission managers',
        'Understand permission implications'
      ]
    },
    {
      id: '3',
      icon: 'cookie',
      title: 'Cookies & Tracking',
      color: '#FF9800',
      content: 'Learn about cookies, tracking technologies, and how to manage them to protect your online privacy.',
      tips: [
        'Clear cookies regularly',
        'Use browser privacy settings',
        'Enable Do Not Track',
        'Use tracking protection'
      ]
    },
    {
      id: '4',
      icon: 'wifi',
      title: 'Secure Browsing',
      color: '#9C27B0',
      content: 'Tips for secure browsing including using VPNs, avoiding public Wi-Fi for sensitive transactions, and recognizing secure websites.',
      tips: [
        'Look for HTTPS in URLs',
        'Avoid public Wi-Fi for banking',
        'Use VPN for privacy',
        'Verify website security'
      ]
    },
    {
      id: '5',
      icon: 'database',
      title: 'Data Management',
      color: '#F44336',
      content: 'How to manage your digital footprint, delete old accounts, and control what information companies have about you.',
      tips: [
        'Delete unused accounts',
        'Use data removal services',
        'Regular privacy checkups',
        'Monitor data breaches'
      ]
    },
    {
      id: '6',
      icon: 'bell',
      title: 'Privacy Settings',
      color: '#00BCD4',
      content: 'Step-by-step guides for configuring privacy settings on popular platforms and devices.',
      tips: [
        'Review social media privacy',
        'Configure device permissions',
        'Enable two-factor auth',
        'Set up privacy screens'
      ]
    }
  ];

  const quickTips = [
    {
      icon: 'check-circle',
      text: 'Always review app permissions before installing',
      color: '#4CAF50'
    },
    {
      icon: 'check-circle',
      text: 'Use two-factor authentication when available',
      color: '#4CAF50'
    },
    {
      icon: 'check-circle',
      text: 'Regularly update your apps and devices',
      color: '#4CAF50'
    },
    {
      icon: 'check-circle',
      text: 'Be cautious with public Wi-Fi networks',
      color: '#4CAF50'
    },
    {
      icon: 'check-circle',
      text: 'Use strong, unique passwords for each account',
      color: '#4CAF50'
    }
  ];

  const openExternalResource = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open resource');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Privacy Guide</Text>
          <View style={styles.headerIcon}>
            <Icon name="shield-account" size={32} color={colors.accent} />
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Your Privacy Journey Starts Here</Text>
          <Text style={styles.heroSubtitle}>
            Learn how to protect your digital privacy with our comprehensive guides and tips
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Guides Completed: {Object.values(completedGuides).filter(Boolean).length}/{guideSections.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(Object.values(completedGuides).filter(Boolean).length / guideSections.length) * 100}%` 
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Quick Privacy Tips</Text>
          <View style={styles.tipsContainer}>
            {quickTips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Icon name={tip.icon} size={20} color={tip.color} />
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Guide Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📚 Privacy Guides</Text>
          <View style={styles.guideContainer}>
            {guideSections.map((section) => (
              <View key={section.id} style={styles.guideCard}>
                <TouchableOpacity
                  style={styles.guideHeader}
                  onPress={() => toggleSection(section.id)}
                >
                  <View style={styles.guideHeaderLeft}>
                    <View style={[styles.guideIcon, { backgroundColor: section.color + '20' }]}>
                      <Icon name={section.icon} size={24} color={section.color} />
                    </View>
                    <Text style={styles.guideTitle}>{section.title}</Text>
                    {completedGuides[section.id] && (
                      <Icon name="check-circle" size={20} color="#4CAF50" />
                    )}
                  </View>
                  <Icon 
                    name={expandedSections[section.id] ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
                
                {expandedSections[section.id] && (
                  <View style={styles.guideContent}>
                    <Text style={styles.guideText}>{section.content}</Text>
                    
                    <View style={styles.tipsList}>
                      <Text style={styles.tipsTitle}>Key Tips:</Text>
                      {section.tips.map((tip, index) => (
                        <View key={index} style={styles.tipListItem}>
                          <Icon name="check" size={16} color={section.color} />
                          <Text style={styles.tipListText}>{tip}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.guideActions}>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={() => markGuideComplete(section.id)}
                      >
                        <Icon 
                          name={completedGuides[section.id] ? "check" : "check-circle-outline"} 
                          size={16} 
                          color="#4CAF50" 
                        />
                        <Text style={styles.completeButtonText}>
                          {completedGuides[section.id] ? 'Completed' : 'Mark Complete'}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.shareButton]}
                        onPress={() => shareGuide(section)}
                      >
                        <Icon name="share" size={16} color="#2196F3" />
                        <Text style={styles.shareButtonText}>Share Guide</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Additional Resources</Text>
          <View style={styles.resourcesGrid}>
            <TouchableOpacity 
              style={styles.resourceCard}
              onPress={() => openExternalResource('https://gdpr-info.eu')}
            >
              <Icon name="book-open" size={32} color="#2196F3" />
              <Text style={styles.resourceTitle}>Privacy Laws</Text>
              <Text style={styles.resourceDesc}>GDPR, CCPA, and more</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resourceCard}
              onPress={() => openExternalResource('https://privacyguides.org')}
            >
              <Icon name="toolbox" size={32} color="#4CAF50" />
              <Text style={styles.resourceTitle}>Privacy Tools</Text>
              <Text style={styles.resourceDesc}>Recommended apps</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resourceCard}
              onPress={() => openExternalResource('https://ssd.eff.org')}
            >
              <Icon name="video" size={32} color="#FF9800" />
              <Text style={styles.resourceTitle}>Security Guides</Text>
              <Text style={styles.resourceDesc}>Step-by-step tutorials</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.resourceCard}
              onPress={() => openExternalResource('https://haveibeenpwned.com')}
            >
              <Icon name="alert-octagon" size={32} color="#F44336" />
              <Text style={styles.resourceTitle}>Data Breaches</Text>
              <Text style={styles.resourceDesc}>Check your accounts</Text>
            </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    ...typography.heading3,
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcon: {
    padding: 8,
  },
  heroSection: {
    padding: 20,
    backgroundColor: colors.surface,
    margin: 20,
    borderRadius: 16,
    elevation: 2,
  },
  heroTitle: {
    ...typography.heading2,
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipsContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  guideContainer: {
    gap: 12,
  },
  guideCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  guideHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  guideIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  guideContent: {
    marginTop: 16,
  },
  guideText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  tipsList: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  tipListText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  guideActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  completeButton: {
    backgroundColor: '#4CAF20' + '20',
    borderWidth: 1,
    borderColor: '#4CAF50' + '40',
  },
  shareButton: {
    backgroundColor: '#2196F3' + '20',
    borderWidth: 1,
    borderColor: '#2196F3' + '40',
  },
  completeButtonText: {
    ...typography.caption,
    color: '#4CAF50',
    fontWeight: '600',
  },
  shareButtonText: {
    ...typography.caption,
    color: '#2196F3',
    fontWeight: '600',
  },
  resourcesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  resourceCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    marginBottom: 12,
  },
  resourceTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  resourceDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});