import { Tabs } from 'expo-router';
import { colors } from '../../core/theme/colors';
import { Library, Search, User } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.carbon,
                },
                headerTintColor: colors.gold,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarStyle: {
                    backgroundColor: colors.carbon,
                    borderTopColor: colors.slate,
                },
                tabBarActiveTintColor: colors.gold,
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tabs.Screen
                name="library"
                options={{
                    title: 'Ma Bibliothèque',
                    tabBarIcon: ({ color }) => <Library size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Recherche',
                    tabBarIcon: ({ color }) => <Search size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
