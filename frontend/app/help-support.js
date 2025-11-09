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

export default function HelpSupportScreen() {
  const router = useRouter();
  const [expandedFAQs, setExpandedFAQs] = useState({});
  const [helpfulFAQs, setHelpfulFAQs] = useState({});

  const faqItems = [
    {
      id: '1',
      question: 'How does PrivacyLens analyze app privacy?',
      answer: 'PrivacyLens uses advanced algorithms to scan app privacy policies, permissions, and data collection practices. We analyze thousands of data points to provide comprehensive privacy scores and recommendations. All analysis happens locally on your device - no data is sent to our servers.',
      icon: 'magnify',
      color: '#2196F3',
    },
    {
      id: '2',
      question: 'Is my data safe with PrivacyLens?',
      answer: 'Absolutely! PrivacyLens operates with zero data collection. We never collect, store, or transmit any personal information. All processing happens locally on your device, ensuring complete privacy protection.',
      icon: 'shield-check',
      color: '#4CAF50',
    },
    {
      id: '3',
      question: 'How often is the app database updated?',
      answer: 'We update our privacy database daily with new app analyses and policy changes. You can enable auto-update in settings or manually refresh to get the latest privacy information.',
      icon: 'update',
      color: '#FF9800',
    },
    {
      id: '4',
      question: 'Can I request analysis for a specific app?',
      answer: 'Yes! Use the app search feature to request analysis for any app. Our system prioritizes popular and frequently requested apps for comprehensive privacy analysis.',
      icon: 'plus-circle',
      color: '#9C27B0',
    },
    {
      id: '5',
      question: 'What does the privacy score mean?',
      answer: 'The privacy score (0-100) represents an app\'s overall privacy friendliness. Higher scores indicate better privacy practices, transparent data handling, and user control over personal information.',
      icon: 'chart-box',
      color: '#00BCD4',
    },
    {
      id: '6',
      question: 'Does PrivacyLens work offline?',
      answer: 'Partially! Core privacy analysis features work offline once initial data is downloaded. However, database updates and new app scans require internet connection.',
      icon: 'wifi-off',
      color: '#795548',
    },
    {
      id: '7',
      question: 'How accurate are the privacy ratings?',
      answer: 'Our ratings are based on comprehensive analysis of privacy policies, app permissions, and data collection practices. We maintain 99% accuracy through continuous verification and user feedback.',
      icon: 'check-decagram',
      color: '#4CAF50',
    },
    {
      id: '8',
      question: 'Can I compare multiple apps?',
      answer: 'Yes! Use our comparison feature to analyze multiple apps side-by-side. Compare privacy scores, data collection practices, and security features to make informed decisions.',
      icon: 'compare',
      color: '#2196F3',
    }
  ];

  const getHelpQuicklyOptions = [
    {
      icon: 'email',
      title: 'Email Support',
      description: 'Get detailed help from our team',
      color: '#2196F3',
      action: () => contactEmail('support'),
    },
    {
      icon: 'chat',
      title: 'Live Chat',
      description: '24/7 instant support',
      color: '#4CAF50',
      action: () => Alert.alert('Live Chat', 'Our live chat support is available 24/7 for immediate assistance.'),
    },
    {
      icon: 'phone',
      title: 'Call Us',
      description: 'Speak directly with experts',
      color: '#FF9800',
      action: () => Linking.openURL('tel:+1234567890'),
    },
    {
      icon: 'account-group',
      title: 'Community',
      description: 'Join user discussions',
      color: '#9C27B0',
      action: () => Linking.openURL('https://community.privacylens.com'),
    }
  ];

  const supportOptions = [
    {
      icon: 'email',
      title: 'General Support',
      description: 'Get help with any issues',
      color: '#2196F3',
      action: () => contactEmail('support'),
      subtitle: 'Direct email assistance'
    },
    {
      icon: 'bug',
      title: 'Report Bug',
      description: 'Found an issue? Let us know',
      color: '#F44336',
      action: () => contactEmail('bug'),
      subtitle: 'Help us improve'
    },
    {
      icon: 'lightbulb',
      title: 'Feature Request',
      description: 'Suggest new features',
      color: '#FF9800',
      action: () => contactEmail('feature'),
      subtitle: 'Share your ideas'
    },
    {
      icon: 'security',
      title: 'Security Issue',
      description: 'Report security concerns',
      color: '#4CAF50',
      action: () => contactEmail('security'),
      subtitle: 'Confidential handling'
    }
  ];

  const toggleFAQ = (faqId) => {
    setExpandedFAQs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  const markHelpful = (faqId) => {
    setHelpfulFAQs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
    Alert.alert('Thank You', 'Your feedback helps us improve!');
  };

  const shareApp = async () => {
    try {
      await Share.share({
        message: '🔒 Protect your digital privacy with PrivacyLens! \n\nDownload the ultimate app privacy analyzer to make informed decisions about your data security.\n\nhttps://privacylens.com/download',
        title: 'PrivacyLens - App Privacy Analyzer'
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share app');
    }
  };

  const rateApp = () => {
    Alert.alert(
      'Rate PrivacyLens',
      'We value your feedback! Your rating helps us improve and reach more users who care about privacy.',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { 
          text: 'Rate Now', 
          onPress: () => Linking.openURL('https://apps.apple.com/app/privacylens')
        }
      ]
    );
  };

  const contactEmail = (type = 'support') => {
    const email = 'mw051878@gmail.com';
    let subject = 'PrivacyLens Support';
    let body = 'Hello PrivacyLens Team,\n\nI need assistance with:';

    switch (type) {
      case 'bug':
        subject = 'PrivacyLens Bug Report';
        body = 'Hello PrivacyLens Team,\n\nI found a bug:\n\nSteps to reproduce:\n1. \n2. \n3. \n\nExpected behavior:\n\nActual behavior:\n\nDevice info:';
        break;
      case 'feature':
        subject = 'PrivacyLens Feature Request';
        body = 'Hello PrivacyLens Team,\n\nI would like to suggest a new feature:\n\nFeature description:\n\nWhy this would be useful:';
        break;
      case 'security':
        subject = 'PrivacyLens Security Report';
        body = 'Hello PrivacyLens Team,\n\nI want to report a security concern:\n\nDescription:';
        break;
      default:
        subject = 'PrivacyLens Support';
        body = 'Hello PrivacyLens Team,\n\nI need assistance with:';
    }

    Linking.openURL(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`).catch(() => {
      Alert.alert('Error', 'Unable to open email app. Please make sure you have an email client installed.');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={styles.headerIcon}>
            <Icon name="help-circle" size={32} color={colors.accent} />
          </View>
        </View>

        {}
        <View style={styles.privacyNotice}>
          <Icon name="shield-check" size={20} color="#4CAF50" />
          <Text style={styles.privacyText}>
            Your privacy is protected. We don't store any personal data.
          </Text>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help Quickly</Text>
          <View style={styles.getHelpGrid}>
            {getHelpQuicklyOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.getHelpCard}
                onPress={option.action}
              >
                <View style={[styles.getHelpIcon, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.icon} size={28} color={option.color} />
                </View>
                <Text style={styles.getHelpTitle}>{option.title}</Text>
                <Text style={styles.getHelpDescription}>{option.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Direct Email Support</Text>
          <Text style={styles.sectionSubtitle}>
            Contact us directly via email - no forms, no data stored
          </Text>
          
          <View style={styles.supportGrid}>
            {supportOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.supportCard}
                onPress={option.action}
              >
                <View style={[styles.supportIcon, { backgroundColor: option.color + '20' }]}>
                  <Icon name={option.icon} size={28} color={option.color} />
                </View>
                <Text style={styles.supportTitle}>{option.title}</Text>
                <Text style={styles.supportDescription}>{option.description}</Text>
                <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {}
          <View style={styles.emailInfo}>
            <Icon name="email-fast" size={24} color={colors.accent} />
            <View style={styles.emailInfoText}>
              <Text style={styles.emailInfoTitle}>Direct Email Contact</Text>
              <Text style={styles.emailInfoAddress}>mw051878@gmail.com</Text>
              <Text style={styles.emailInfoDescription}>
                All emails are handled directly - no automated systems, no data storage
              </Text>
            </View>
          </View>
        </View>

        {}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Frequently Asked Questions</Text>

          <View style={styles.faqContainer}>
            {faqItems.map((faq) => (
              <View key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => toggleFAQ(faq.id)}
                >
                  <View style={styles.faqHeaderLeft}>
                    <View style={[styles.faqIcon, { backgroundColor: faq.color + '20' }]}>
                      <Icon name={faq.icon} size={20} color={faq.color} />
                    </View>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                  </View>
                  <Icon 
                    name={expandedFAQs[faq.id] ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
                
                {expandedFAQs[faq.id] && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    <View style={styles.faqActions}>
                      <TouchableOpacity 
                        style={styles.helpfulButton}
                        onPress={() => markHelpful(faq.id)}
                      >
                        <Icon 
                          name={helpfulFAQs[faq.id] ? "thumb-up" : "thumb-up-outline"} 
                          size={16} 
                          color={helpfulFAQs[faq.id] ? "#4CAF50" : colors.textSecondary} 
                        />
                        <Text style={[
                          styles.helpfulText,
                          helpfulFAQs[faq.id] && styles.helpfulTextActive
                        ]}>
                          Helpful
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Need More Help?</Text>
          <Text style={styles.footerText}>
            Contact us directly at mw051878@gmail.com for personalized support.
          </Text>
          <Text style={styles.footerSubtext}>
            🔒 No data stored • Complete privacy protection • Direct human response
          </Text>
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
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF20' + '15',
    margin: 20,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  privacyText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '500',
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
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  getHelpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  getHelpCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  getHelpIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  getHelpTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  getHelpDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  supportCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    marginBottom: 12,
  },
  supportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  supportTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  supportDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  supportSubtitle: {
    ...typography.caption,
    color: colors.accent,
    fontSize: 12,
  },
  emailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    gap: 12,
  },
  emailInfoText: {
    flex: 1,
  },
  emailInfoTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  emailInfoAddress: {
    ...typography.body,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 4,
  },
  emailInfoDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  faqContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background + '80',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  faqIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuestion: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    flex: 1,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    paddingLeft: 60,
  },
  faqAnswerText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 12,
  },
  faqActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
    borderRadius: 6,
  },
  helpfulText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  helpfulTextActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.accent,
    textAlign: 'center',
    fontWeight: '500',
  },
});