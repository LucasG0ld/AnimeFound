import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';

interface CreatePollPayload {
    groupId: string;
    animeIds: string[]; // UUIDs of animes
}

export const useCreatePoll = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ groupId, animeIds }: CreatePollPayload) => {
            if (!user) throw new Error("Not authenticated");

            // 1. Create Poll
            const { data: poll, error: pollError } = await supabase
                .from('polls')
                .insert({
                    group_id: groupId,
                    created_by: user.id,
                    status: 'OPEN'
                })
                .select()
                .single();

            if (pollError) throw pollError;

            // 2. Insert Candidates
            const candidateRows = animeIds.map(animeId => ({
                poll_id: poll.id,
                anime_id: animeId
            }));

            const { error: candError } = await supabase
                .from('poll_candidates')
                .insert(candidateRows);

            if (candError) throw candError;

            return poll;
        },
        onSuccess: (_, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: ['active_poll', groupId] });
        },
    });
};
