import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';

export const useJoinGroup = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (inviteCode: string) => {
            if (!user) throw new Error('Utilisateur non connecté');

            // 1. Find Group by Invite Code
            const { data: group, error: findError } = await supabase
                .from('groups')
                .select('id')
                .eq('invite_code', inviteCode)
                .single();

            if (findError || !group) {
                throw new Error('Code d\'invitation invalide.');
            }

            // 2. Check if already member (handled by unique constraint usually, but let's be safe)
            // Actually simpler to just try insert and handle error

            const { error: joinError } = await supabase
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.id,
                    role: 'MEMBER'
                });

            if (joinError) {
                if (joinError.code === '23505') { // Unique violation
                    throw new Error('Vous êtes déjà membre de ce groupe.');
                }
                throw joinError;
            }

            return group;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] });
        },
    });
};
