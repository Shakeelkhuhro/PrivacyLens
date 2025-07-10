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

export default function PrivacyDashboardScreen() {
  const router = useRouter();
  const { app } = useLocalSearchParams();
  const parsedApp = JSON.parse(app);
  
  const scoreColor = getScoreColor(parsedApp.privacyScore);
  const scoreDescription = getScoreDescription(parsedApp.privacyScore);

  const overviewData = [
    { label: 'Developer', value: parsedApp.developer },
    { label: 'Category', value: parsedApp.category },
    { label: 'Data Types', value: `${parsedApp.dataTypes?.length || 0} types` },
    { label: 'Last Updated', value: parsedApp.lastUpdated || 'Unknown' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Analysis</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Overview</Text>
          <View style={styles.overviewContainer}>
            {overviewData.map((item, index) => (
              <View key={index} style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>{item.label}</Text>
                <Text style={styles.overviewValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Score</Text>
          <View style={styles.scoreCard}>
            <View style={styles.scoreCircle}>
              <Text style={[styles.scoreText, { color: scoreColor }]}>
                {parsedApp.privacyScore}
              </Text>
              <Text style={styles.scoreMax}>/100</Text>
            </View>
            <Text style={styles.scoreDescription}>{scoreDescription}</Text>
          </View>
        </View>

        {/* Data Types Grid */}
        {parsedApp.dataTypes && parsedApp.dataTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Collection</Text>
            <View style={styles.dataTypesGrid}>
              {parsedApp.dataTypes.map((dataType, index) => (
                <View key={index} style={styles.dataTypeItem}>
                  <DataTypeIcon type={dataType.toLowerCase()} size={32} />
                  <Text style={styles.dataTypeText}>{dataType}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Privacy Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Insights</Text>
          <View style={styles.insightsCard}>
            <Text style={styles.insightsText}>
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

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.recommendationsCard}>
            {parsedApp.privacyScore >= 70 ? (
              <Text style={styles.recommendationText}>
                ✅ This app follows good privacy practices. Safe to use with standard precautions.
              </Text>
            ) : (
              <Text style={styles.recommendationText}>
                ⚠️ Review app permissions carefully and consider alternatives if privacy is a concern.
              </Text>
            )}
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
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    marginBottom: 12,
  },
  overviewContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  overviewLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  overviewValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  scoreMax: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  scoreDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  dataTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataTypeItem: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    minWidth: 100,
  },
  dataTypeText: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
    marginTop: 8,
  },
  insightsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  insightsText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  recommendationsCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  recommendationText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});