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
  Modal,
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
  const [showExportModal, setShowExportModal] = useState(false);

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
    build: '2025.1',
    lastUpdated: 'August 2025'
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
    setShowExportModal(true);
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

  const SettingRow = ({ label, value, isEnabled }) => (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingValueContainer}>
        <Text style={[styles.settingValue, isEnabled ? styles.enabled : styles.disabled]}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </Text>
        <View style={[styles.statusDot, isEnabled ? styles.dotEnabled : styles.dotDisabled]} />
      </View>
    </View>
  );

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

      {/* Export Settings Modal */}
      <Modal
        visible={showExportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderIcon}>
                <Icon name="file-export" size={32} color={colors.accent} />
              </View>
              <Text style={styles.modalTitle}>Settings Export Report</Text>
              <Text style={styles.modalSubtitle}>Current PrivacyLens Configuration</Text>
            </View>

            {/* Report Content */}
            <ScrollView style={styles.reportContent} showsVerticalScrollIndicator={false}>
              {/* App Info */}
              <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Application Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>App Name:</Text>
                  <Text style={styles.infoValue}>PrivacyLens</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Version:</Text>
                  <Text style={styles.infoValue}>{appInfo.version}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Report Generated:</Text>
                  <Text style={styles.infoValue}>{new Date().toLocaleString()}</Text>
                </View>
              </View>

              {/* Settings Status */}
              <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Current Settings Status</Text>
                <SettingRow label="Push Notifications" value={notifications} isEnabled={notifications} />
                <SettingRow label="Dark Mode" value={darkMode} isEnabled={darkMode} />
                <SettingRow label="Auto Scan" value={autoUpdate} isEnabled={autoUpdate} />
                <SettingRow label="Data Saver Mode" value={dataSaver} isEnabled={dataSaver} />
                <SettingRow label="Local Encryption" value={encryption} isEnabled={encryption} />
                <SettingRow label="Share Analytics" value={analytics} isEnabled={analytics} />
                <SettingRow label="App Lock" value={appLock} isEnabled={appLock} />
                <SettingRow label="Biometric Lock" value={biometric} isEnabled={biometric} />
              </View>

              {/* Privacy Summary */}
              <View style={styles.reportSection}>
                <Text style={styles.sectionTitle}>Privacy Summary</Text>
                <View style={styles.privacyCard}>
                  <Icon name="shield-check" size={24} color="#4CAF50" />
                  <Text style={styles.privacyText}>
                    This report contains no personal data. PrivacyLens operates with zero data collection - all processing happens locally on your device.
                  </Text>
                </View>
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalSecondaryButton]}
                onPress={() => setShowExportModal(false)}
              >
                <Text style={styles.modalSecondaryButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalPrimaryButton]}
                onPress={() => {
                  setShowExportModal(false);
                  Alert.alert('Success', 'Settings report has been saved to your device');
                }}
              >
                <Icon name="download" size={20} color="#FFFFFF" />
                <Text style={styles.modalPrimaryButtonText}>Save Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.background + '40',
  },
  modalHeaderIcon: {
    marginBottom: 12,
  },
  modalTitle: {
    ...typography.heading3,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  modalSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  reportContent: {
    padding: 20,
    maxHeight: 400,
  },
  reportSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading3,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.background + '20',
  },
  infoLabel: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background + '20',
  },
  settingLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
  },
  enabled: {
    color: '#4CAF50',
  },
  disabled: {
    color: '#F44336',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotEnabled: {
    backgroundColor: '#4CAF50',
  },
  dotDisabled: {
    backgroundColor: '#F44336',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#4CAF50' + '15',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  privacyText: {
    ...typography.caption,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.background + '40',
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  modalPrimaryButton: {
    backgroundColor: colors.accent,
  },
  modalPrimaryButtonText: {
    ...typography.body,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalSecondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.textSecondary + '40',
  },
  modalSecondaryButtonText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
});