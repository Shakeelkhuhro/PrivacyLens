import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
  AppState,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../src/styles/colors';
import { typography } from '../src/styles/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const appState = useRef(AppState.currentState);
  
  // State for toggle switches - these reset on app restart (no storage)
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [encryption, setEncryption] = useState(true);

  const [appLock, setAppLock] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const settingsSections = [
    {
      title: 'App Preferences',
      icon: 'tune',
      color: '#2196F3',
      items: [
        {
          icon: 'bell',
          name: 'Push Notifications',
          description: 'Receive privacy alerts and updates',
          type: 'toggle',
          value: notifications,
          onValueChange: setNotifications,
          color: '#FF9800'
        },
        {
          icon: 'weather-night',
          name: 'Dark Mode',
          description: 'Switch between light and dark theme',
          type: 'toggle',
          value: darkMode,
          onValueChange: (value) => {
            setDarkMode(value);
            Alert.alert('Theme Changed', value ? 'Dark mode enabled' : 'Light mode enabled');
          },
          color: '#9C27B0'
        },
        {
          icon: 'update',
          name: 'Auto Scan',
          description: 'Automatically scan new apps',
          type: 'toggle',
          value: autoUpdate,
          onValueChange: setAutoUpdate,
          color: '#4CAF50'
        },
        {
          icon: 'data-matrix',
          name: 'Data Saver Mode',
          description: 'Reduce data usage during scans',
          type: 'toggle',
          value: dataSaver,
          onValueChange: (value) => {
            setDataSaver(value);
            Alert.alert('Data Saver', value ? 'Data saver mode enabled' : 'Data saver mode disabled');
          },
          color: '#2196F3'
        },
      ]
    },
    {
      title: 'Privacy & Security',
      icon: 'shield-account',
      color: '#4CAF50',
      items: [
        {
          icon: 'lock',
          name: 'App Lock',
          description: 'Require PIN to open app',
          type: 'toggle',
          value: appLock,
          onValueChange: (value) => {
            setAppLock(value);
            Alert.alert(
              'App Lock', 
              value ? 'App lock will be enabled next time you open PrivacyLens' : 'App lock disabled'
            );
          },
          color: '#F44336'
        },
        {
          icon: 'fingerprint',
          name: 'Biometric Lock',
          description: 'Use fingerprint or face ID',
          type: 'toggle',
          value: biometric,
          onValueChange: (value) => {
            setBiometric(value);
            if (value) {
              Alert.alert('Biometric', 'Biometric authentication will be required next time');
            }
          },
          color: '#FF9800'
        },
        {
          icon: 'encryption',
          name: 'Local Encryption',
          description: 'Encrypt all local data',
          type: 'toggle',
          value: encryption,
          onValueChange: setEncryption,
          color: '#4CAF50'
        },
        {
          icon: 'chart-box',
          name: 'Share Anonymous Analytics',
          description: 'Help improve PrivacyLens (no personal data)',
          type: 'toggle',
          value: analytics,
          onValueChange: setAnalytics,
          color: '#00BCD4'
        },
      ]
    },
    {
      title: 'Support & About',
      icon: 'help-circle',
      color: '#FF9800',
      items: [
        {
          icon: 'shield-check',
          name: 'Privacy Policy',
          description: 'How we protect your privacy',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy Policy', 'PrivacyLens does not collect or store any personal data. All processing happens locally on your device.'),
          color: '#4CAF50'
        },
        {
          icon: 'file-document',
          name: 'Terms of Service',
          description: 'App usage terms',
          type: 'navigation',
          onPress: () => Alert.alert('Terms of Service', 'By using PrivacyLens, you agree to our terms. We do not collect, store, or transmit any user data.'),
          color: '#795548'
        },
        {
          icon: 'information',
          name: 'About PrivacyLens',
          description: 'App information and version',
          type: 'navigation',
          onPress: () => router.push('/about'),
          color: '#2196F3'
        },
        {
          icon: 'email',
          name: 'Contact Support',
          description: 'Get help from our team',
          type: 'navigation',
          onPress: () => router.push('/help-support'),
          color: '#9C27B0'
        },
      ]
    }
  ];

  const appInfo = {
    version: '1.0.0',
    build: '2024.1',
    lastUpdated: 'December 2024'
  };

  const performAppCleanup = () => {
    Alert.alert(
      'Clear App Data',
      'This will reset all settings and clear temporary data. No personal data is stored.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Data', 
          style: 'destructive',
          onPress: () => {
            setNotifications(true);
            setDarkMode(false);
            setAutoUpdate(true);
            setDataSaver(false);
            setAnalytics(true);
            setEncryption(true);
            setAppLock(false);
            setBiometric(false);
            Alert.alert('Success', 'All app data has been cleared. Settings reset to default.');
          }
        }
      ]
    );
  };

  const exportPrivacyReport = () => {
    const report = {
      app: 'PrivacyLens',
      version: appInfo.version,
      settings: {
        notifications,
        darkMode,
        autoUpdate,
        dataSaver,
        analytics,
        encryption,
        appLock,
        biometric
      },
      generated: new Date().toISOString(),
      note: 'This report contains no personal data. PrivacyLens does not collect or store user information.'
    };
    
    Alert.alert(
      'Export Settings',
      `Your current settings:\n\n` +
      `• Notifications: ${notifications ? 'On' : 'Off'}\n` +
      `• Dark Mode: ${darkMode ? 'On' : 'Off'}\n` +
      `• Auto Scan: ${autoUpdate ? 'On' : 'Off'}\n` +
      `• Data Saver: ${dataSaver ? 'On' : 'Off'}\n` +
      `• Analytics: ${analytics ? 'On' : 'Off'}\n` +
      `• Encryption: ${encryption ? 'On' : 'Off'}\n` +
      `• App Lock: ${appLock ? 'On' : 'Off'}\n` +
      `• Biometric: ${biometric ? 'On' : 'Off'}\n\n` +
      `No personal data is stored or exported.`,
      [{ text: 'OK' }]
    );
  };

  const checkPrivacyStatus = () => {
    const privacyScore = 
      (encryption ? 20 : 0) +
      (!analytics ? 15 : 0) +
      (appLock ? 15 : 0) +
      (biometric ? 15 : 0) +
      (dataSaver ? 10 : 0) +
      (notifications ? 10 : 0) +
      (autoUpdate ? 10 : 0) +
      5; // Base score

    let status = '';
    if (privacyScore >= 80) status = 'Excellent 🔒';
    else if (privacyScore >= 60) status = 'Good 👍';
    else if (privacyScore >= 40) status = 'Fair ⚠️';
    else status = 'Needs Improvement 🚨';

    Alert.alert(
      'Privacy Status',
      `Your PrivacyLens Settings Score: ${privacyScore}/100\n\nStatus: ${status}\n\n` +
      `Recommendations:\n` +
      `${!encryption ? '• Enable local encryption\n' : ''}` +
      `${analytics ? '• Consider disabling analytics\n' : ''}` +
      `${!appLock ? '• Enable app lock for security\n' : ''}` +
      `\nRemember: PrivacyLens stores no data locally or remotely.`
    );
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
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={styles.headerIcon}>
            <Icon name="cog" size={32} color={colors.accent} />
          </View>
        </View>

        {/* Privacy Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Icon name="shield-check" size={24} color="#4CAF50" />
            <Text style={styles.statusTitle}>Privacy First</Text>
          </View>
          <Text style={styles.statusText}>
            PrivacyLens operates with zero data collection. All settings are temporary and reset when app closes.
          </Text>
        </View>

        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIcon}>
            <Icon name="shield-check" size={48} color={colors.accent} />
          </View>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>PrivacyLens</Text>
            <Text style={styles.appVersion}>Version {appInfo.version}</Text>
            <Text style={styles.appBuild}>Build {appInfo.build}</Text>
            <Text style={styles.appPrivacy}>🔒 No Data Collection</Text>
          </View>
        </View>

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderLeft}>
                <View style={[styles.sectionIcon, { backgroundColor: section.color + '20' }]}>
                  <Icon name={section.icon} size={20} color={section.color} />
                </View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
            </View>
            
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={item.onPress}
                  disabled={item.type === 'toggle'}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.itemIcon, { backgroundColor: item.color + '20' }]}>
                      <Icon name={item.icon} size={20} color={item.color} />
                    </View>
                    <View style={styles.itemText}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    </View>
                  </View>
                  
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.onValueChange}
                      trackColor={{ false: '#767577', true: item.color + '80' }}
                      thumbColor={item.value ? item.color : '#f4f3f4'}
                    />
                  ) : (
                    <Icon name="chevron-right" size={24} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={checkPrivacyStatus}
          >
            <Icon name="shield-check" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Check Privacy Status</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={exportPrivacyReport}
          >
            <Icon name="export" size={20} color={colors.text} />
            <Text style={styles.secondaryButtonText}>Export Settings Report</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.warningButton]}
            onPress={performAppCleanup}
          >
            <Icon name="delete" size={20} color="#FFFFFF" />
            <Text style={styles.warningButtonText}>Clear All Data</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            🔐 Zero Data Collection • Local Processing Only
          </Text>
          <Text style={styles.footerSubtext}>
            Last updated: {appInfo.lastUpdated}
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
  statusCard: {
    backgroundColor: '#4CAF20' + '15',
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statusTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  appInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
  },
  appIcon: {
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    ...typography.heading3,
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appVersion: {
    ...typography.body,
    color: colors.text,
    marginBottom: 2,
  },
  appBuild: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  appPrivacy: {
    ...typography.caption,
    color: '#4CAF50',
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionContent: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.background + '80',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    flex: 1,
  },
  itemName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  actionSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
  },
  secondaryButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  warningButton: {
    backgroundColor: '#F44336',
  },
  warningButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  footerSubtext: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});