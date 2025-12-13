import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

interface KickPayload {
    groupId: string;
    userId: string;
}

export const useKickMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ groupId, userId }: KickPayload) => {
            const { error } = await supabase
                .from('group_members')
                .delete()
                .eq('group_id', groupId)
                .eq('user_id', userId);

            if (error) throw error;
        },
        onSuccess: (_, { groupId }) => {
            queryClient.invalidateQueries({ queryKey: ['group_members', groupId] });
        },
    });
};
