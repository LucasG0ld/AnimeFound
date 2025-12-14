
import { supabase } from '../services/supabase';

interface SendPushOptions {
    title: string;
    body: string;
    data?: Record<string, any>;
}

/**
 * Sends a push notification to all members of a group EXCEPT the current user.
 * 
 * Note: In a production app, this logic should run in a DATABASE TRIGGER or EDGE FUNCTION 
 * to ensure security and reliability. We are doing it client-side for the MVP.
 * 
 * @param groupId The target group ID
 * @param senderId The ID of the user performing the action (to exclude them)
 * @param options Notification content
 */
export const sendPushToGroup = async (groupId: string, senderId: string, { title, body, data }: SendPushOptions) => {
    try {
        // 1. Get all members of the group
        const { data: members, error: membersError } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId);

        if (membersError || !members) {
            console.error('Error fetching group members for push:', membersError);
            return;
        }

        const userIds = members
            .map(m => m.user_id)
            .filter(uid => uid !== senderId); // Exclude self

        if (userIds.length === 0) return;

        // 2. Get tokens for these users
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('expo_push_token')
            .in('id', userIds)
            .not('expo_push_token', 'is', null);

        if (profilesError || !profiles) {
            console.error('Error fetching tokens:', profilesError);
            return;
        }

        const pushTokens = profiles
            .map(p => p.expo_push_token)
            .filter(Boolean) as string[];

        // Deduplicate
        const uniqueTokens = [...new Set(pushTokens)];

        if (uniqueTokens.length === 0) return;

        // 3. Send using Expo API
        // Expo recommends sending batches, but we'll do a simple loop or single batch for MVP.
        const messages = uniqueTokens.map(token => ({
            to: token,
            sound: 'default',
            title,
            body,
            data,
            color: '#FFBF00', // Gold accent
        }));

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messages),
        });

        console.log(`Push notification sent to ${uniqueTokens.length} devices.`);

    } catch (error) {
        console.error('Failed to send push notification:', error);
    }
};
