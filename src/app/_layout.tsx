import { Stack } from 'expo-router';
import { colors } from '../core/theme/colors';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
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
                <Stack.Screen name="index" options={{ title: 'Accueil' }} />
            </Stack>
        </>
    );
}
