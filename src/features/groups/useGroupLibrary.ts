import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export interface GroupAnimeAggregate {
    animeId: string;
    title: string;
    imageUrl: string;
    year: number;
    averageRating: number;
    ratingCount: number;
    watchers: {
        username: string;
        avatarUrl: string | null;
        status: string;
        rating: number | null;
    }[];
}

export const useGroupLibrary = (groupId: string) => {
    const fetchGroupLibrary = async (): Promise<GroupAnimeAggregate[]> => {
        // 1. Get Member IDs
        const { data: members, error: memberError } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId);

        if (memberError) throw memberError;
        const userIds = members.map(m => m.user_id);

        if (userIds.length === 0) return [];

        // 2. Fetch all library items for these users
        const { data: items, error: itemsError } = await supabase
            .from('library_items')
            .select(`
        user_id,
        status,
        rating,
        anime:animes (
          id,
          title_en,
          image_url,
          year
        ),
        profile:profiles (
          username,
          avatar_url
        )
      `)
            .in('user_id', userIds);

        if (itemsError) throw itemsError;

        // 3. Client-Side Aggregation
        const grouped = new Map<string, GroupAnimeAggregate>();

        items.forEach((item: any) => {
            const animeId = item.anime.id;

            if (!grouped.has(animeId)) {
                grouped.set(animeId, {
                    animeId,
                    title: item.anime.title_en,
                    imageUrl: item.anime.image_url,
                    year: item.anime.year,
                    averageRating: 0,
                    ratingCount: 0,
                    watchers: [],
                });
            }

            const entry = grouped.get(animeId)!;

            // Add watcher info
            entry.watchers.push({
                username: item.profile.username,
                avatarUrl: item.profile.avatar_url,
                status: item.status,
                rating: item.rating
            });

            // Accumulate rating if exists
            if (item.rating) {
                entry.averageRating += item.rating;
                entry.ratingCount++;
            }
        });

        // 4. Finalize Averages
        return Array.from(grouped.values()).map(entry => ({
            ...entry,
            averageRating: entry.ratingCount > 0
                ? parseFloat((entry.averageRating / entry.ratingCount).toFixed(1))
                : 0
        }));
    };

    return useQuery({
        queryKey: ['group_library', groupId],
        queryFn: fetchGroupLibrary,
        enabled: !!groupId,
    });
};
