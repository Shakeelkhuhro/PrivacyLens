import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../src/styles/colors';

export default function Layout() {
  return (
    <>
      <StatusBar style="light" />

      <Tabs
        screenOptions={({ route }) => {
          let iconName;
          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'ranking':
              iconName = 'chart-bar';
              break;
            case 'about':
              iconName = 'information-outline';
              break;
            default:
              iconName = 'apps';
          }

          return {
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={focused ? iconName : `${iconName}-outline`}
                size={size}
                color={color}
              />
            ),
            tabBarActiveTintColor: colors.accent,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
            },
            headerShown: false,
          };
        }}
      />
    </>
  );
}
