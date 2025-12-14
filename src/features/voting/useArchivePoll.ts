import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export const useArchivePoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pollId: string) => {
            const { error } = await supabase
                .from('polls')
                .delete()
                .eq('id', pollId);

            if (error) throw error;
        },
        onSuccess: (data, pollId) => {
            // Invalidate to refresh the ActivePoll query (which should now return null)
            queryClient.invalidateQueries({ queryKey: ['active_poll'] });
        },
    });
};
