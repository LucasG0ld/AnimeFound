import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';

export type WatchStatus = 'WATCHING' | 'COMPLETED' | 'PLAN_TO_WATCH' | 'DROPPED';

export interface LibraryItem {
    id: string;
    status: WatchStatus;
    rating: number | null;
    comment: string | null;
    anime: {
        id: string;
        mal_id: number;
        title_en: string;
        image_url: string;
        type: string;
        year: number;
    };
}

export const useUserLibrary = (status?: WatchStatus | 'ALL') => {
    const { user } = useAuth();

    const fetchLibrary = async (): Promise<LibraryItem[]> => {
        if (!user) return [];

        let query = supabase
            .from('library_items')
            .select(`
        id,
        status,
        rating,
        comment,
        anime:animes (
          id,
          mal_id,
          title_en,
          image_url,
          type,
          year
        )
      `)
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (status && status !== 'ALL') {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching library:', error);
            throw error;
        }

        return data as unknown as LibraryItem[];
    };

    return useQuery({
        queryKey: ['library', user?.id, status],
        queryFn: fetchLibrary,
        enabled: !!user,
    });
};
