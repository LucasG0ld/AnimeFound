import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';

interface VotePayload {
    pollId: string;
    candidateId: string;
}

export const useVote = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ pollId, candidateId }: VotePayload) => {
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('votes')
                .insert({
                    poll_id: pollId,
                    candidate_id: candidateId,
                    user_id: user.id
                });

            if (error) throw error;
        },
        onSuccess: (_, { pollId }) => {
            // Optimistic update handled by Realtime conceptually, but we can also invalidate
            queryClient.invalidateQueries({ queryKey: ['poll_candidates', pollId] });
        },
    });
};
