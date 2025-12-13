import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';
import { JikanAnime } from '../../core/services/jikan';

export const useAddAnime = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (anime: JikanAnime) => {
            if (!user) throw new Error('Utilisateur non connecté');

            // 1. Check if Anime exists in DB (Cache Check)
            let { data: existingAnime } = await supabase
                .from('animes')
                .select('id')
                .eq('mal_id', anime.mal_id)
                .single();

            let animeId = existingAnime?.id;

            // 2. If Miss, Insert into 'animes'
            if (!animeId) {
                const { data: newAnime, error: insertError } = await supabase
                    .from('animes')
                    .insert({
                        mal_id: anime.mal_id,
                        title_en: anime.title_english || anime.title,
                        image_url: anime.images.jpg.large_image_url,
                        type: anime.type,
                        year: anime.year,
                        total_episodes: anime.episodes,
                    })
                    .select('id')
                    .single();

                if (insertError) throw insertError;
                animeId = newAnime.id;
            }

            // 3. Add to User's Library
            const { error: libraryError } = await supabase
                .from('library_items')
                .insert({
                    user_id: user.id,
                    anime_id: animeId,
                    status: 'PLAN_TO_WATCH',
                });

            if (libraryError) {
                // Handle unique constraint (already added) gracefully
                if (libraryError.code === '23505') {
                    throw new Error('Cet anime est déjà dans votre liste.');
                }
                throw libraryError;
            }

            return { animeId };
        },
        onSuccess: () => {
            // Invalidate Library queries
            queryClient.invalidateQueries({ queryKey: ['library'] });
        }
    });
};
