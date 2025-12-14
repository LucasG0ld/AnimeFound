import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export interface Poll {
    id: string;
    group_id: string;
    created_by: string;
    status: 'OPEN' | 'CLOSED';
    created_at: string;
}

export const useActivePoll = (groupId: string) => {
    return useQuery({
        queryKey: ['active_poll', groupId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('polls')
                .select('*')
                .eq('group_id', groupId)
                .eq('status', 'OPEN')
                .single(); // Assuming only one open poll at a time, or we take the first one

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "Row not found"

            return data as Poll | null;
        },
        enabled: !!groupId,
    });
};
