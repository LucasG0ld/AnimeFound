import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

interface UpdateLibraryPayload {
    libraryItemId: string;
    updates: {
        status?: string;
        rating?: number;
        comment?: string;
    };
}

export const useUpdateLibraryItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ libraryItemId, updates }: UpdateLibraryPayload) => {
            const { data, error } = await supabase
                .from('library_items')
                .update(updates)
                .eq('id', libraryItemId)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library'] });
        },
    });
};
