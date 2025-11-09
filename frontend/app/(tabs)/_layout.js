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
        tabBarActiveTintColor: colors.accent, 
        tabBarInactiveTintColor: colors.textSecondary, 
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70, 
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6, 
          marginTop: 2, 
        },
        tabBarIconStyle: {
          marginBottom: 4, 
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