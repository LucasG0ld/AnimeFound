import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jikanService } from '../../core/services/jikan';

export const useAnimeSearch = (query: string) => {
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        // 500ms Debounce
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [query]);

    return useQuery({
        queryKey: ['anime_search', debouncedQuery],
        queryFn: () => jikanService.searchAnime(debouncedQuery),
        enabled: debouncedQuery.length > 2, // Only search if more than 2 chars
        staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    });
};
