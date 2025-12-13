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

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            throw error;
        }

        return data;
    };

    return useQuery({
        queryKey: ['profile', session?.user.id],
        queryFn: fetchProfile,
        enabled: !!session?.user.id,
    });
};
