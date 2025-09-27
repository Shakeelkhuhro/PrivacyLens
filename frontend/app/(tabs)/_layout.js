import { Tabs } from 'expo-router';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../src/styles/colors';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.accent, // Active icon and text color
        tabBarInactiveTintColor: colors.textSecondary, // Inactive icon and text color
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70, // Increased height for better spacing
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6, // Added margin below labels for better spacing
          marginTop: 2, // Small margin above text
        },
        tabBarIconStyle: {
          marginBottom: 4, // Space between icon and label
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="home" 
              size={size} 
              color={focused ? colors.accent : colors.textSecondary} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'Rankings',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="chart-bar" 
              size={size} 
              color={focused ? colors.accent : colors.textSecondary} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ color, size, focused }) => (
            <Icon 
              name="information" 
              size={size} 
              color={focused ? colors.accent : colors.textSecondary} 
            />
          ),
        }}
      />
    </Tabs>
  );
}