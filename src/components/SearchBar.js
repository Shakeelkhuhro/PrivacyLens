import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = 'Search...',
  onSubmit 
}) {
  return (
    <View style={styles.container}>
      <Icon name="magnify" size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
  },
});
