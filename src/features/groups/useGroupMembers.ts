import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export interface GroupMemberDetails {
    user_id: string;
    role: 'ADMIN' | 'MEMBER';
    joined_at: string;
    profile: {
        username: string;
        avatar_url: string;
    };
}

export const useGroupMembers = (groupId: string) => {
    const fetchMembers = async (): Promise<GroupMemberDetails[]> => {
        const { data, error } = await supabase
            .from('group_members')
            .select(`
        user_id,
        role,
        joined_at,
        profile:profiles (
          username,
          avatar_url
        )
      `)
            .eq('group_id', groupId)
            .order('joined_at', { ascending: true });

        if (error) throw error;

        return data as unknown as GroupMemberDetails[];
    };

    return useQuery({
        queryKey: ['group_members', groupId],
        queryFn: fetchMembers,
        enabled: !!groupId,
    });
};
