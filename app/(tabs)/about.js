import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../src/styles/colors';
import { typography } from '../../src/styles/typography';

export default function AboutScreen() {
  const handleLinkPress = (url) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Icon name="shield-check" size={60} color={colors.accent} />
          </View>
          <Text style={styles.appName}>PrivacyLens</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
          <Text style={styles.tagline}>
            Empowering users to make informed privacy decisions
          </Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About PrivacyLens</Text>
          <Text style={styles.description}>
            PrivacyLens is a comprehensive privacy analysis tool that helps users 
            understand and evaluate the privacy practices of mobile applications. 
            Our mission is to promote digital privacy awareness and empower users 
            to make informed decisions about the apps they use.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <Icon name="magnify" size={24} color={colors.accent} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>App Search & Analysis</Text>
                <Text style={styles.featureDescription}>
                  Search and analyze privacy practices of various mobile apps
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Icon name="chart-bar" size={24} color={colors.accent} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Privacy Rankings</Text>
                <Text style={styles.featureDescription}>
                  Compare apps based on their privacy scores and practices
                </Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Icon name="shield-check" size={24} color={colors.accent} />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Detailed Reports</Text>
                <Text style={styles.featureDescription}>
                  Get comprehensive privacy analysis and recommendations
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Privacy Score Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Score Guide</Text>
          <View style={styles.scoreExplanation}>
            <View style={styles.scoreRange}>
              <View style={[styles.scoreDot, { backgroundColor: colors.success }]} />
              <Text style={styles.scoreText}>80-100: Excellent Privacy</Text>
            </View>
            <View style={styles.scoreRange}>
              <View style={[styles.scoreDot, { backgroundColor: colors.accent }]} />
              <Text style={styles.scoreText}>60-79: Good Privacy</Text>
            </View>
            <View style={styles.scoreRange}>
              <View style={[styles.scoreDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.scoreText}>40-59: Moderate Concerns</Text>
            </View>
            <View style={styles.scoreRange}>
              <View style={[styles.scoreDot, { backgroundColor: colors.error }]} />
              <Text style={styles.scoreText}>0-39: Poor Privacy</Text>
            </View>
          </View>
        </View>

        {/* Tech Stack */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Built With</Text>
          <View style={styles.techStack}>
            <View style={styles.techItem}>
              <Text style={styles.techText}>React Native</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techText}>Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techText}>Expo Router</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={styles.techText}>Vector Icons</Text>
            </View>
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact</Text>
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleLinkPress('mailto:support@privacylens.app')}
          >
            <Icon name="email" size={20} color={colors.accent} />
            <Text style={styles.contactText}>support@privacylens.app</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleLinkPress('https://github.com/yourusername/PrivacyLens')}
          >
            <Icon name="github" size={20} color={colors.accent} />
            <Text style={styles.contactText}>View on GitHub</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for digital privacy
          </Text>
          <Text style={styles.footerText}>
            © 2024 PrivacyLens. All rights reserved.
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
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    ...typography.heading1,
    color: colors.text,
    marginBottom: 8,
  },
  version: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  tagline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: 16,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  scoreExplanation: {
    gap: 12,
  },
  scoreRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  scoreText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techItem: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    ...typography.caption,
    color: colors.accent,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactText: {
    ...typography.body,
    color: colors.accent,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});