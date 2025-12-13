import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';
import { LibraryItem } from './useUserLibrary';

export const useAnimeDetails = (animeId: string) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['anime', animeId, user?.id],
        queryFn: async () => {
            if (!user) throw new Error('User not authenticated');

            // 1. Fetch Anime Metadata
            const { data: anime, error: animeError } = await supabase
                .from('animes')
                .select('*')
                .eq('id', animeId)
                .single();

            if (animeError) throw animeError;

            // 2. Fetch User's Library Item (if exists)
            const { data: libraryItem, error: libraryError } = await supabase
                .from('library_items')
                .select('*')
                .eq('user_id', user.id)
                .eq('anime_id', animeId)
                .maybeSingle();

            if (libraryError) throw libraryError;

            // Construct a unified object similar to LibraryItem but more robust
            // If libraryItem exists, use it. If not, we still have the anime data.
            // But strict LibraryItem type expects 'anime' nested.

            const result = {
                anime,
                libraryItem,
            };

            return result;
        },
        enabled: !!user && !!animeId,
    });
};
