import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const { width, height } = Dimensions.get('window');

export default function DrawerMenu({ visible, onClose }) {
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const menuItems = [
    { icon: 'home', title: 'Home', route: '/' },
    { icon: 'chart-bar', title: 'App Rankings', route: '/ranking' },
    { icon: 'information', title: 'About', route: '/about' },
    { icon: 'shield-check', title: 'Privacy Guide', route: '/privacy-dashboard' },
    { icon: 'cog', title: 'Settings', route: null },
    { icon: 'help-circle', title: 'Help & Support', route: null },
  ];

  const handleMenuPress = (item) => {
    onClose();
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <Animated.View 
          style={[
            styles.drawer,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.drawerHeader}>
            <View style={styles.logoContainer}>
              <Icon name="shield-check" size={40} color={colors.accent} />
            </View>
            <Text style={styles.appName}>PrivacyLens</Text>
            <Text style={styles.appVersion}>v1.0.0</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
              >
                <Icon name={item.icon} size={24} color={colors.text} />
                <Text style={styles.menuText}>{item.title}</Text>
                <Icon name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.drawerFooter}>
            <TouchableOpacity style={styles.footerItem}>
              <Icon name="moon-waning-crescent" size={20} color={colors.textSecondary} />
              <Text style={styles.footerText}>Dark Mode</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerItem}>
              <Icon name="logout" size={20} color={colors.error} />
              <Text style={[styles.footerText, { color: colors.error }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: width * 0.8,
    maxWidth: 320,
    height: height,
    backgroundColor: colors.surface,
    paddingTop: 50,
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appName: {
    ...typography.heading2,
    color: colors.text,
    marginBottom: 4,
  },
  appVersion: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 20,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 16,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});