import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../core/auth/AuthContext';
import { supabase } from '../../core/services/supabase';

export interface UserProfile {
    id: string;
    username: string | null;
    avatar_url: string | null;
    created_at: string;
}

export const useUserProfile = () => {
    const { session } = useAuth();

    const fetchProfile = async () => {
        if (!session?.user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            // Don't throw if it's just missing (e.g. new user not yet created by trigger)
            // But usually we want to know.
            // For now, let's allow retry.
            throw error;
        }

        return data;
    };

    return useQuery({
        queryKey: ['profile', session?.user.id],
        queryFn: fetchProfile,
        enabled: !!session?.user.id,
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000), // Backoff: 1s, 2s, 4s
    });
};
