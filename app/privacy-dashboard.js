import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';
import { getScoreColor, getScoreDescription } from '../src/utils/privacyUtils';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PrivacyDashboardScreen() {
  const router = useRouter();
  const { app: appString } = useLocalSearchParams();
  const app = JSON.parse(appString);

  const scoreColor = getScoreColor(app.privacyScore);
  const scoreDescription = getScoreDescription(app.privacyScore);

  const overviewData = [
    { label: 'Developer', value: app.developer || 'Unknown Developer' },
    { label: 'Category', value: app.category || 'Productivity' },
    { label: 'Permissions', value: `${app.dataTypes.length} types` },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.appName}>{app.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewContainer}>
            {overviewData.map((item, index) => (
              <View key={index} style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>{item.label}</Text>
                <Text style={styles.overviewValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collected Data</Text>
          <View style={styles.dataTypesGrid}>
            {app.dataTypes.map((dataType, index) => (
              <View key={index} style={styles.dataTypeItem}>
                <View style={styles.dataTypeIconContainer}>
                  <DataTypeIcon type={dataType.toLowerCase()} size={24} />
                </View>
                <Text style={styles.dataTypeLabel}>{dataType}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Score</Text>
          <View style={styles.scoreContainer}>
            <View style={styles.progressContainer}>
              <CircularProgress
                size={120}
                strokeWidth={8}
                progress={app.privacyScore}
                color={scoreColor}
                backgroundColor={colors.surface}
              />
              <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>{app.privacyScore}</Text>
              </View>
            </View>
            <View style={styles.scoreInfoContainer}>
              <Text style={styles.scoreLabel}>Score</Text>
              <Text style={styles.scoreDescription}>{scoreDescription}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Insights</Text>
          <Text style={styles.insightsText}>
            This app has a privacy score of {app.privacyScore}/100. {scoreDescription}. 
            The app collects {app.dataTypes.length} types of user data including {app.dataTypes.slice(0, 2).join(' and ')}.
            {app.privacyScore >= 70 
              ? ' This app follows good privacy practices and minimizes data collection.'
              : ' Consider reviewing the permissions and data sharing practices of this app.'
            }
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  appName: {
    ...typography.heading1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text,
    marginBottom: 16,
  },
  overviewContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
  dataTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dataTypeItem: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  dataTypeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataTypeLabel: {
    ...typography.caption,
    color: colors.text,
    textAlign: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 20,
  },
  progressContainer: {
    position: 'relative',
    marginRight: 30,
  },
  scoreTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    ...typography.heading1,
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreInfoContainer: {
    flex: 1,
  },
  scoreLabel: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  scoreDescription: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  insightsText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
});
