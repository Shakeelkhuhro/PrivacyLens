import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export default function AppCard({ app, onPress, showScore = false, showArrow = false, rank }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {rank !== undefined && (
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      )}

      {/* App Icon */}
      {app.icon ? (
        <Image source={{ uri: app.icon }} style={styles.appIcon} />
      ) : (
        <View style={styles.appIconPlaceholder}>
          <Icon name="application" size={40} color={colors.textSecondary} />
        </View>
      )}

      {/* App Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.appName} numberOfLines={1}>
          {app.name || 'Unnamed App'}
        </Text>

        {showScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Privacy Score:</Text>
            <Text style={styles.scoreValue}>{app.privacyScore ?? 'N/A'}</Text>
          </View>
        )}
      </View>

      {/* Optional Arrow */}
      {showArrow && (
        <Icon name="chevron-right" size={24} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  appIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  scoreContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginRight: 4,
  },
  scoreValue: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '700',
  },
});
