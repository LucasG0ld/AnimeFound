import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';
import { sendPushToGroup } from '../../core/services/notifications';
import { useUserProfile } from '../profile/useUserProfile';

interface CreatePollPayload {
    groupId: string;
    animeIds: string[]; // UUIDs of animes
}

export const useCreatePoll = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const { data: profile } = useUserProfile(); // useUserProfile handles auth internally

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
        onSuccess: async (poll, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: ['active_poll', groupId] });

            if (poll && user) {
                // Fire and Forget Notification
                const senderName = profile?.username || "Un membre";
                sendPushToGroup(groupId, user.id, {
                    title: "⚔️ C'est l'Heure du Duel !",
                    body: `${senderName} a lancé un vote. Venez décider du prochain anime !`,
                });
            }
        },
    });
};
