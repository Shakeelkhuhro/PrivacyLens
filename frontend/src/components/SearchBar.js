import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

const SearchBar = forwardRef(function SearchBar(
  { value, onChangeText, placeholder = 'Search...', onSubmit },
  ref
) {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current && inputRef.current.focus && inputRef.current.focus();
    },
    blur: () => {
      inputRef.current && inputRef.current.blur && inputRef.current.blur();
    }
  }));

  return (
    <View style={styles.container}>
      <Icon name="magnify" size={18} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        ref={inputRef}
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
});

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'relative',
    marginBottom: 12,
  },
  icon: {
    // position the icon absolutely so it doesn't sit inside the input area
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -9 }],
    zIndex: 2,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    // leave space for the absolutely positioned icon
    paddingLeft: 40,
    backgroundColor: 'transparent',
    // remove default focus outline on web
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
});
