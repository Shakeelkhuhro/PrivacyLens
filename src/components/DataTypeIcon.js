import React from 'react';
import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../styles/colors';

const iconMap = {
  // Data types
  location: 'map-marker',
  contacts: 'account-multiple',
  email: 'email',
  phone: 'phone',
  camera: 'camera',
  microphone: 'microphone',
  storage: 'folder',
  calendar: 'calendar',
  photos: 'image',
  messages: 'message',
  
  // App categories
  social: 'account-group',
  messaging: 'message',
  productivity: 'briefcase',
  entertainment: 'play',
  shopping: 'shopping',
  finance: 'bank',
  health: 'heart',
  education: 'school',
  travel: 'airplane',
  news: 'newspaper',
  
  // Default fallback
  app: 'application',
  default: 'apps'
};

export default function DataTypeIcon({ type, size = 24, color = colors.accent }) {
  const iconName = iconMap[type?.toLowerCase()] || iconMap.default;
  
  return (
    <Icon 
      name={iconName} 
      size={size} 
      color={color} 
    />
  );
}