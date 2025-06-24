import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';

const iconMap = {
  location: 'map-marker',
  contacts: 'account-multiple',
  email: 'email',
  camera: 'camera',
  microphone: 'microphone',
  storage: 'folder',
  phone: 'phone',
  sms: 'message-text',
  calendar: 'calendar',
  photos: 'image-multiple',
  default: 'apps',
  app: 'application',
  lexey: 'text-box',
  carry: 'briefcase',
};

export default function DataTypeIcon({ type, size = 24, color = colors.text }) {
  const iconName =
    type && typeof type === 'string'
      ? iconMap[type.toLowerCase()] || iconMap.default
      : iconMap.default;

  return <Icon name={iconName} size={size} color={color} />;
}
