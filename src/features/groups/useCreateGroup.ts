import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';

export const useCreateGroup = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (groupName: string) => {
            if (!user) throw new Error('Utilisateur non connecté');

            // 1. Create Group
            const { data: group, error: groupError } = await supabase
                .from('groups')
                .insert({
                    name: groupName,
                    created_by: user.id
                })
                .select()
                .single();

            if (groupError) throw groupError;

            // 2. Add Creator as ADMIN
            const { error: memberError } = await supabase
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.id,
                    role: 'ADMIN'
                });

            if (memberError) throw memberError;

            return group;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
