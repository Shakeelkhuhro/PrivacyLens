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
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState(null);

  const handleLinkPress = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const menuItems = [
    { 
      icon: 'shield-account', 
      name: 'Privacy Guide', 
      onPress: () => router.push('/privacy-guide'),
      color: '#4CAF50',
      iconColor: '#4CAF50'
    },
    { 
      icon: 'cog', 
      name: 'Settings', 
      onPress: () => router.push('/settings'),
      color: '#2196F3',
      iconColor: '#2196F3'
    },
    { 
      icon: 'help-circle', 
      name: 'Help & Support', 
      onPress: () => router.push('/help-support'),
      color: '#FF9800',
      iconColor: '#FF9800'
    },
  ];

  const features = [
    {
      icon: 'magnify',
      title: 'Smart App Search',
      description: 'Instantly search and analyze privacy practices of thousands of mobile apps',
      color: '#2196F3',
      iconColor: '#2196F3',
    },
    {
      icon: 'chart-line',
      title: 'Privacy Rankings',
      description: 'Compare apps side-by-side with our comprehensive privacy scoring system',
      color: '#4CAF50',
      iconColor: '#4CAF50',
    },
    {
      icon: 'shield-check',
      title: 'Detailed Analysis',
      description: 'Get in-depth privacy reports with actionable recommendations',
      color: '#FF9800',
      iconColor: '#FF9800',
    },
    {
      icon: 'bell-alert',
      title: 'Privacy Alerts',
      description: 'Stay informed about privacy policy changes and security updates',
      color: '#F44336',
      iconColor: '#F44336',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Apps Analyzed', icon: 'apps', iconColor: '#4CAF50' },
    { number: '50K+', label: 'Users Protected', icon: 'account-group', iconColor: '#2196F3' },
    { number: '99.9%', label: 'Accuracy Rate', icon: 'chart-donut', iconColor: '#FF9800' },
    { number: '24/7', label: 'Monitoring', icon: 'eye', iconColor: '#F44336' },
  ];

  const teamMembers = [
    { name: 'Privacy Engineers', icon: 'shield-account', count: '5+', color: '#4CAF50', iconColor: '#4CAF50' },
    { name: 'Security Experts', icon: 'security', count: '3+', color: '#2196F3', iconColor: '#2196F3' },
    { name: 'UI/UX Designers', icon: 'palette', count: '2+', color: '#00BCD4', iconColor: '#00BCD4' },
    { name: 'Data Scientists', icon: 'chart-box', count: '4+', color: '#FF9800', iconColor: '#FF9800' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {}
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

        {}
        <View style={[styles.section, styles.quickActionsSection]}>
          <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuCard}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Icon name={item.icon} size={28} color={item.iconColor} />
                </View>
                <Text style={styles.menuText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {}
        <View style={[styles.section, styles.statsSection]}>
          <Text style={styles.sectionTitle}>📊 Our Impact</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.iconColor + '20' }]}>
                  <Icon name={stat.icon} size={24} color={stat.iconColor} />
                </View>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {}
        <View style={[styles.section, styles.featuresSection]}>
          <Text style={styles.sectionTitle}>✨ Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <Icon name={feature.icon} size={28} color={feature.iconColor} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {}
        <View style={[styles.section, styles.teamSection]}>
          <Text style={styles.sectionTitle}>👥 Our Team</Text>
          <View style={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamCard}>
                <View style={[styles.teamIcon, { backgroundColor: member.color + '20' }]}>
                  <Icon name={member.icon} size={32} color={member.iconColor} />
                </View>
                <Text style={styles.teamCount}>{member.count}</Text>
                <Text style={styles.teamRole}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {}
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
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
    fontWeight: 'bold',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  quickActionsSection: {
    marginBottom: 40,
  },
  statsSection: {
    marginBottom: 40,
  },
  featuresSection: {
    marginBottom: 40,
  },
  teamSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  menuCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  menuText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    elevation: 2,
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
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  teamCard: {
    flexBasis: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  teamIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
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
  footer: {
    backgroundColor: colors.surface,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
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