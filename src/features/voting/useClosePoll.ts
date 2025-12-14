import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export const useClosePoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pollId: string) => {
            const { error } = await supabase
                .from('polls')
                .update({ status: 'CLOSED' })
                .eq('id', pollId);

            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate all related
            queryClient.invalidateQueries({ queryKey: ['active_poll'] });
            // We might want to invalidate specifically by groupId if we had it, but this is generic
            // It might be better to pass groupId context or invalidate 'active_poll' broadly
        },
    });
};
