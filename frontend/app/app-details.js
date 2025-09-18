import React from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
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

  const handleViewDetails = () => {
    router.push({
      pathname: '/privacy-dashboard',
      params: { app: JSON.stringify(parsedApp) },
    });
  };

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
            <DataTypeIcon type={parsedApp.icon} size={60} />
          </View>
          <Text style={styles.appName}>{parsedApp.name}</Text>
          <Text style={styles.developer}>{parsedApp.developer}</Text>
          <Text style={styles.category}>{parsedApp.category}</Text>
        </View>

        <View style={styles.scoreSection}>
          <Text style={styles.sectionTitle}>Privacy Score</Text>
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {parsedApp.privacyScore}
            </Text>
            <Text style={styles.scoreDescription}>{scoreDescription}</Text>
          </View>
        </View>

        {parsedApp.dataTypes && parsedApp.dataTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Collected</Text>
            <View style={styles.tagsContainer}>
              {parsedApp.dataTypes.map((dataType, index) => (
                <View key={index} style={styles.tag}>
                  <DataTypeIcon type={dataType.toLowerCase()} size={16} />
                  <Text style={styles.tagText}>{dataType}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {parsedApp.privacyDescription || parsedApp.shortDescription}
          </Text>
        </View>

        <TouchableOpacity style={styles.detailsButton} onPress={handleViewDetails}>
          <Text style={styles.detailsButtonText}>VIEW DETAILED ANALYSIS</Text>
          <Icon name="chevron-right" size={20} color={colors.text} />
        </TouchableOpacity>
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
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    ...typography.heading2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  developer: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  category: {
    ...typography.caption,
    color: colors.accent,
    textTransform: 'uppercase',
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
  },
  scoreDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
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
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginVertical: 20,
    gap: 8,
  },
  detailsButtonText: {
    ...typography.button,
    color: colors.text,
  },
});