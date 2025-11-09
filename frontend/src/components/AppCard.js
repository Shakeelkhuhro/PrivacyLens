import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export default function AppCard({ app, onPress, showScore = false, showArrow = false, rank, showDataHungryBadge = false }) {
  
  const getScoreColor = (score) => {
    if (score === null || score === undefined) return colors.textSecondary;
    if (score >= 70) return colors.success;
    if (score >= 50) return colors.warning;
    return colors.error;
  };

  const getScoreDescription = (score) => {
    if (score === null || score === undefined) return 'Not rated';
    if (score >= 70) return 'Excellent';
    if (score >= 50) return 'Average';
    return 'Poor';
  };

  const scoreColor = getScoreColor(app.privacyScore);
  const scoreDescription = getScoreDescription(app.privacyScore);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {rank !== undefined && (
        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>{rank}</Text>
        </View>
      )}

      {/* App Icon */}
      <View style={styles.iconContainer}>
        {app.icon ? (
          <Image source={{ uri: app.icon }} style={styles.appIcon} />
        ) : (
          <View style={styles.appIconPlaceholder}>
            <Icon name="application" size={24} color={colors.textSecondary} />
          </View>
        )}
      </View>

      {/* App Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameContainer}>
          <Text style={styles.appName} numberOfLines={1}>
            {app.name || app.appName || 'Unknown App'}
          </Text>
          {showDataHungryBadge && (app.isDataHungry || app.privacyScore < 50) && (
            <View style={styles.dataHungryBadge}>
              <Icon name="alert" size={12} color={colors.background} />
              <Text style={styles.dataHungryText}>Data Hungry</Text>
            </View>
          )}
        </View>

        <Text style={styles.developer} numberOfLines={1}>
          {app.developer || 'Unknown Developer'}
        </Text>

        {showScore && (
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Privacy Score: </Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>
              {app.privacyScore !== null && app.privacyScore !== undefined ? app.privacyScore : 'N/A'}
            </Text>
            {app.privacyScore !== null && app.privacyScore !== undefined && (
              <Text style={[styles.scoreDescription, { color: scoreColor }]}>
                • {scoreDescription}
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Optional Arrow */}
      {showArrow && (
        <View style={styles.arrowContainer}>
          <Icon name="chevron-right" size={20} color={colors.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 2,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  iconContainer: {
    marginRight: 12,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  appIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  appName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  dataHungryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  dataHungryText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '700',
  },
  developer: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 6,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  scoreLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  scoreValue: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 12,
  },
  scoreDescription: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },
  arrowContainer: {
    marginLeft: 8,
  },
});