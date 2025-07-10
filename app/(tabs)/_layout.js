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
              iconName = focused => focused ? 'home' : 'home-outline';
              break;
            case 'ranking':
              iconName = focused => focused ? 'chart-bar' : 'chart-bar-stacked';
              break;
            case 'about':
              iconName = focused => focused ? 'information' : 'information-outline';
              break;
            default:
              iconName = focused => 'apps';
          }

          return {
            tabBarIcon: ({ focused, color, size }) => (
              <Icon
                name={typeof iconName === 'function' ? iconName(focused) : iconName}
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
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
          }}
        />
        <Tabs.Screen
          name="ranking"
          options={{
            title: 'Ranking',
            tabBarLabel: 'Ranking',
          }}
        />
        <Tabs.Screen
          name="about"
          options={{
            title: 'About',
            tabBarLabel: 'About',
          }}
        />
      </Tabs>
    </>
  );
}