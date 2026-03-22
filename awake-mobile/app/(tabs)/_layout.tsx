import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/lib/tokens'

type IoniconName = React.ComponentProps<typeof Ionicons>['name']

const TABS: Array<{
  name: string
  title: string
  icon: IoniconName
  activeIcon: IoniconName
}> = [
  { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { name: 'balances', title: 'Balances', icon: 'wallet-outline', activeIcon: 'wallet' },
  { name: 'payments', title: 'Payments', icon: 'swap-horizontal-outline', activeIcon: 'swap-horizontal' },
  { name: 'insights', title: 'Insights', icon: 'bar-chart-outline', activeIcon: 'bar-chart' },
  { name: 'profile', title: 'Profile', icon: 'person-outline', activeIcon: 'person' },
]

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}
