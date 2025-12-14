import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { supabase } from '../services/supabase';
import { useAuth } from '../auth/AuthContext';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true, // Required by newer Expo SDKs
        shouldShowList: true, // Required by newer Expo SDKs
    }),
});

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FFBF00',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Permission not granted for push notifications!');
            return;
        }

        // Get Project ID from app config
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) {
            // Log warning but don't crash if ID is missing (dev mode)
            console.warn('Project ID not found for Push Notifications');
        }

        try {
            token = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
        } catch (e) {
            console.error('Error fetching push token', e);
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token?.data;
}

export const useRegisterPushToken = () => {
    const { user } = useAuth();

    useEffect(() => {
        const register = async () => {
            if (!user) return;

            const token = await registerForPushNotificationsAsync();
            if (token) {
                // Upsert token to profile
                const { error } = await supabase
                    .from('profiles')
                    .update({ expo_push_token: token })
                    .eq('id', user.id);

                if (error) {
                    console.error('Failed to save push token to DB:', error);
                } else {
                    console.log('Push token registered:', token);
                }
            }
        };

        register();
    }, [user]);
};
