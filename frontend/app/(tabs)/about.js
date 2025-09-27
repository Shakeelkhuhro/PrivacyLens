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
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const features = [
    {
      icon: 'magnify',
      title: 'Smart App Search',
      description: 'Instantly search and analyze privacy practices of thousands of mobile apps',
      color: colors.accent,
    },
    {
      icon: 'chart-line',
      title: 'Privacy Rankings',
      description: 'Compare apps side-by-side with our comprehensive privacy scoring system',
      color: colors.success,
    },
    {
      icon: 'shield-check-outline',
      title: 'Detailed Analysis',
      description: 'Get in-depth privacy reports with actionable recommendations',
      color: colors.warning,
    },
    {
      icon: 'bell-alert',
      title: 'Privacy Alerts',
      description: 'Stay informed about privacy policy changes and security updates',
      color: colors.error,
    },
  ];

  const stats = [
    { number: '1000+', label: 'Apps Analyzed' },
    { number: '50K+', label: 'Users Protected' },
    { number: '99.9%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Monitoring' },
  ];

  const teamMembers = [
    { name: 'Privacy Engineers', icon: 'shield-account', count: '5+' },
    { name: 'Security Experts', icon: 'security', count: '3+' },
    { name: 'UI/UX Designers', icon: 'palette', count: '2+' },
    { name: 'Data Scientists', icon: 'chart-box', count: '4+' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <Icon name="shield-check" size={70} color={colors.accent} />
            <View style={styles.logoGlow} />
          </View>
          <Text style={styles.appName}>PrivacyLens</Text>
          <View style={styles.versionBadge}>
            <Text style={styles.version}>v1.0.0</Text>
          </View>
          <Text style={styles.tagline}>
            🔒 Empowering digital privacy for everyone
          </Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.expandableHeader}
            onPress={() => toggleSection('mission')}
          >
            <Icon name="target" size={24} color={colors.accent} />
            <Text style={styles.sectionTitle}>Our Mission</Text>
            {/* ADDED RIGHT SIDE ICON */}
            <View style={styles.rightIconContainer}>
              <Icon name="rocket-launch" size={20} color={colors.accent} />
            </View>
            <Icon 
              name={expandedSection === 'mission' ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          {expandedSection === 'mission' && (
            <View style={styles.expandableContent}>
              <Text style={styles.description}>
                In an era where digital privacy is under constant threat, PrivacyLens stands as your guardian. 
                We believe that privacy is a fundamental right, not a luxury. Our mission is to democratize 
                privacy knowledge, making it accessible and actionable for everyone.
              </Text>
              <Text style={styles.description}>
                Through cutting-edge analysis and user-friendly design, we're building a world where 
                privacy-conscious decisions are the norm, not the exception.
              </Text>
            </View>
          )}
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Icon name={feature.icon} size={28} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Score Guide */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.expandableHeader}
            onPress={() => toggleSection('scoring')}
          >
            <Icon name="speedometer" size={24} color={colors.accent} />
            <Text style={styles.sectionTitle}>Privacy Scoring</Text>
            {/* ADDED RIGHT SIDE ICON */}
            <View style={styles.rightIconContainer}>
              <Icon name="chart-bar" size={20} color={colors.accent} />
            </View>
            <Icon 
              name={expandedSection === 'scoring' ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          {expandedSection === 'scoring' && (
            <View style={styles.expandableContent}>
              <Text style={styles.description}>
                Our proprietary scoring algorithm evaluates apps across multiple privacy dimensions:
              </Text>
              <View style={styles.scoreGuide}>
                <View style={styles.scoreItem}>
                  <View style={[styles.scoreDot, { backgroundColor: colors.success }]} />
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreRange}>80-100</Text>
                    <Text style={styles.scoreLabel}>Excellent Privacy</Text>
                    <Text style={styles.scoreDesc}>Minimal data collection, strong encryption</Text>
                  </View>
                </View>
                <View style={styles.scoreItem}>
                  <View style={[styles.scoreDot, { backgroundColor: colors.accent }]} />
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreRange}>60-79</Text>
                    <Text style={styles.scoreLabel}>Good Privacy</Text>
                    <Text style={styles.scoreDesc}>Reasonable practices with minor concerns</Text>
                  </View>
                </View>
                <View style={styles.scoreItem}>
                  <View style={[styles.scoreDot, { backgroundColor: colors.warning }]} />
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreRange}>40-59</Text>
                    <Text style={styles.scoreLabel}>Moderate Concerns</Text>
                    <Text style={styles.scoreDesc}>Some privacy issues, review carefully</Text>
                  </View>
                </View>
                <View style={styles.scoreItem}>
                  <View style={[styles.scoreDot, { backgroundColor: colors.error }]} />
                  <View style={styles.scoreInfo}>
                    <Text style={styles.scoreRange}>0-39</Text>
                    <Text style={styles.scoreLabel}>Poor Privacy</Text>
                    <Text style={styles.scoreDesc}>Significant concerns, consider alternatives</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Our Team</Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <Icon name={member.icon} size={32} color={colors.accent} />
                <Text style={styles.teamCount}>{member.count}</Text>
                <Text style={styles.teamRole}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Technology Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Built With</Text>
          <View style={styles.techStack}>
            {['React Native', 'Expo', 'Node.js', 'Machine Learning', 'TypeScript', 'GraphQL'].map((tech, index) => (
              <View key={index} style={styles.techBadge}>
                <Text style={styles.techText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact & Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 Get in Touch</Text>
          <View style={styles.contactGrid}>
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => handleLinkPress('mailto:support@privacylens.app')}
            >
              <Icon name="email" size={24} color={colors.accent} />
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactDesc}>support@privacylens.app</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => handleLinkPress('https://github.com/yourusername/PrivacyLens')}
            >
              <Icon name="github" size={24} color={colors.accent} />
              <Text style={styles.contactTitle}>GitHub</Text>
              <Text style={styles.contactDesc}>Contribute & Report Issues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => handleLinkPress('https://twitter.com/privacylens')}
            >
              <Icon name="twitter" size={24} color={colors.accent} />
              <Text style={styles.contactTitle}>Twitter</Text>
              <Text style={styles.contactDesc}>Latest Updates</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactCard}
              onPress={() => handleLinkPress('https://privacylens.app/docs')}
            >
              <Icon name="book-open" size={24} color={colors.accent} />
              <Text style={styles.contactTitle}>Documentation</Text>
              <Text style={styles.contactDesc}>API & Guides</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Text style={styles.footerTitle}>Privacy First, Always</Text>
            <Text style={styles.footerText}>
              Made with ❤️ by privacy advocates for a safer digital world
            </Text>
            <Text style={styles.copyright}>
              © 2024 PrivacyLens. All rights reserved.
            </Text>
          </View>
          <View style={styles.footerLogos}>
            <Icon name="shield-check" size={20} color={colors.accent} />
            <Icon name="lock" size={20} color={colors.accent} />
            <Icon name="eye-off" size={20} color={colors.accent} />
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
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    elevation: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent,
    opacity: 0.1,
  },
  appName: {
    ...typography.heading1,
    color: colors.text,
    marginBottom: 12,
    fontSize: 36,
  },
  versionBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  version: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 26,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flexBasis: '48%',
    maxWidth: '48%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  // ADDED RIGHT ICON CONTAINER STYLE
  rightIconContainer: {
    marginLeft: 'auto',
    marginRight: 12,
    backgroundColor: colors.accent + '20',
    padding: 6,
    borderRadius: 8,
  },
  expandableContent: {
    paddingLeft: 36,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    flex: 1,
    marginLeft: 8,
    marginBottom: 12,
    fontSize: 22,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 18,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  scoreGuide: {
    gap: 16,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  scoreDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 4,
  },
  scoreInfo: {
    flex: 1,
  },
  scoreRange: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  scoreLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  scoreDesc: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  teamCard: {
    flexBasis: '48%',
    maxWidth: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  teamCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.accent,
    marginVertical: 4,
  },
  teamRole: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: colors.accent + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent + '30',
  },
  techText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  contactCard: {
    flexBasis: '48%',
    maxWidth: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  contactTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginVertical: 8,
  },
  contactDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  footerContent: {
    alignItems: 'center',
    marginBottom: 16,
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
  },
  copyright: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  footerLogos: {
    flexDirection: 'row',
    gap: 16,
  },
});