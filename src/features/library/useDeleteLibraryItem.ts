import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../core/services/supabase';

export const useDeleteLibraryItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (libraryItemId: string) => {
            const { error } = await supabase
                .from('library_items')
                .delete()
                .eq('id', libraryItemId);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['library'] });
        },
    });
};
