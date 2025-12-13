import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';
import { useAuth } from '../../core/auth/AuthContext';

export interface Group {
    id: string;
    name: string;
    invite_code: string;
    created_by: string;
    created_at: string;
}

export interface GroupMember {
    role: 'ADMIN' | 'MEMBER';
    group: Group;
}

export const useUserGroups = () => {
    const { user } = useAuth();

    const fetchGroups = async (): Promise<GroupMember[]> => {
        if (!user) return [];

        const { data, error } = await supabase
            .from('group_members')
            .select(`
        role,
        group:groups (
          id,
          name,
          invite_code,
          created_by,
          created_at
        )
      `)
            .eq('user_id', user.id);

        if (error) throw error;

        return data as unknown as GroupMember[];
    };

    return useQuery({
        queryKey: ['groups', user?.id],
        queryFn: fetchGroups,
        enabled: !!user,
    });
};
