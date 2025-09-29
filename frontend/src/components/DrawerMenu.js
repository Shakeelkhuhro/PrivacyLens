import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
  SafeAreaView,
  Pressable,
  AccessibilityInfo,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const { width, height } = Dimensions.get('window');

export default function DrawerMenu({ visible, onClose }) {
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(-width)).current;
  const backdropAnim = React.useRef(new Animated.Value(0)).current;

  // Animate drawer and backdrop
  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
      // Announce for accessibility
      AccessibilityInfo.announceForAccessibility?.('Menu opened');
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible, slideAnim, backdropAnim]);

  // Auto-close on route change
  React.useEffect(() => {
    const unsub = router?.addListener?.('routeChangeComplete', onClose);
    return () => unsub && unsub();
  }, [router, onClose]);

  const menuItems = [
    { icon: 'home', title: 'Home', route: '/' },
    { icon: 'chart-bar', title: 'App Rankings', route: '/ranking' },
    { icon: 'information', title: 'About', route: '/about' },
    { icon: 'shield-check', title: 'Privacy Guide', route: '/privacy-guide' },
    { icon: 'cog', title: 'Settings', route: '/settings' },
    { icon: 'help-circle', title: 'Help & Support', route: '/help-support' },
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
      statusBarTranslucent
    >
      <SafeAreaView style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Close menu"
          accessibilityRole="button"
          onPress={onClose}
        >
          <Animated.View
            style={[styles.backdrop, { opacity: backdropAnim }]}
            pointerEvents={visible ? 'auto' : 'none'}
          />
        </Pressable>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
              width: Math.max(Math.min(width * 0.8, 340), 240),
              shadowOpacity: backdropAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.2] }),
            },
          ]}
          accessibilityViewIsModal={true}
          accessibilityLabel="Navigation menu"
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
                accessibilityRole="button"
                accessibilityLabel={item.title}
                activeOpacity={0.7}
              >
                <Icon name={item.icon} size={24} color={colors.text} />
                <Text style={styles.menuText}>{item.title}</Text>
                <Icon name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.drawerFooter}>
          </View>
        </Animated.View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    maxWidth: 340,
    minWidth: 240,
    height: height,
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'android' ? 50 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
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
});