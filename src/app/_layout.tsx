import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { colors } from '../core/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../core/auth/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const RootLayoutNav = () => {
    const { session, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'signup';

        if (!session && !inAuthGroup) {
            // Redirect to the login page
            router.replace('/login');
        } else if (session && inAuthGroup) {
            // Redirect back to the library
            router.replace('/(tabs)/library');
        }
    }, [session, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.carbon, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.gold} />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="light" backgroundColor={colors.carbon} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.carbon,
                    },
                    headerTintColor: colors.gold,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: colors.carbon,
                    },
                }}
            >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="signup" options={{ headerShown: false }} />
            </Stack>
        </>
    );
};

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </QueryClientProvider>
    );
}
