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

    const fetchProfile = async (): Promise<UserProfile | null> => {
        if (!session?.user.id) return null;

        console.log('Fetching Profile for User ID:', session.user.id);

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching profile (might retry):', error.message);
            // Throw error to trigger retry in React Query
            throw error;
        }

        console.log('Profile fetched successfully:', data);
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
