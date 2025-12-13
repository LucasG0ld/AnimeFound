import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export interface FeedEvent {
    id: string;
    updated_at: string;
    status: string;
    rating: number | null;
    comment: string | null;
    anime: {
        title_en: string;
        image_url: string;
    };
    profile: {
        username: string;
        avatar_url: string | null;
    };
}

export const useGroupFeed = (groupId: string) => {
    const fetchGroupFeed = async (): Promise<FeedEvent[]> => {
        // 1. Get Member IDs
        const { data: members, error: memberError } = await supabase
            .from('group_members')
            .select('user_id')
            .eq('group_id', groupId);

        if (memberError) throw memberError;
        const userIds = members.map(m => m.user_id);

        if (userIds.length === 0) return [];

        // 2. Fetch Recent Activities
        const { data, error } = await supabase
            .from('library_items')
            .select(`
        id,
        updated_at,
        status,
        rating,
        comment,
        anime:animes (
          title_en,
          image_url
        ),
        profile:profiles (
          username,
          avatar_url
        )
      `)
            .in('user_id', userIds)
            .order('updated_at', { ascending: false })
            .limit(20);

        if (error) throw error;
        return data as unknown as FeedEvent[];
    };

    return useQuery({
        queryKey: ['group_feed', groupId],
        queryFn: fetchGroupFeed,
        enabled: !!groupId,
    });
};
