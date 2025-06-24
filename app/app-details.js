import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';


export default function AppDetailsScreen() {
  const router = useRouter();
  const { app } = useLocalSearchParams();
  const parsedApp = typeof app === 'string' ? JSON.parse(app) : app;

  const handleViewDetails = () => {
    router.push({
      pathname: '/privacy-dashboard',
      params: { app: JSON.stringify(parsedApp) },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <View style={styles.appIconContainer}>
            <DataTypeIcon type={parsedApp.icon} size={60} />
          </View>
          <Text style={styles.appName}>{parsedApp.name}</Text>
        </View>

        <View style={styles.tagsContainer}>
          {parsedApp.dataTypes?.map((dataType, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{dataType}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.privacyDescription}>
            {parsedApp.privacyDescription || 'This app collects various types of user data...'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collected Data</Text>
          <View style={styles.dataTypesContainer}>
            {parsedApp.dataTypes?.map((dataType, index) => (
              <View key={index} style={styles.dataTypeTag}>
                <Text style={styles.dataTypeText}>{dataType}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.viewDetailsButton} onPress={handleViewDetails}>
          <Text style={styles.viewDetailsText}>VIEW DETAILS</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1, paddingHorizontal: 20 },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    ...typography.heading1,
    color: colors.text,
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
  },
  tag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  tagText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '600',
  },
  section: { marginBottom: 30 },
  sectionTitle: {
    ...typography.heading2,
    color: colors.text,
    marginBottom: 12,
  },
  privacyDescription: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  dataTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dataTypeTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    margin: 4,
  },
  dataTypeText: {
    ...typography.caption,
    color: colors.background,
    fontWeight: '600',
  },
  viewDetailsButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  viewDetailsText: {
    ...typography.button,
    color: colors.accent,
    fontWeight: 'bold',
  },
});
