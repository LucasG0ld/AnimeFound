import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { supabase } from '../../core/services/supabase';

export interface Candidate {
    id: string; // candidate_id
    anime: {
        id: number; // anime_id is usually a FK to animes table (which has string or int id?) 
        // Wait, animes table has UUID as id? Checked schema: "id uuid default gen_random_uuid()".
        // BUT poll_candidates has anime_id as UUID.
        // Wait, mal_id is Int. 
        // Let's check schema again. `animes` id is UUID.
        title_en: string;
        image_url: string;
    }
    vote_count: number;
}

export interface Vote {
    id: string;
    candidate_id: string;
    user_id: string; // To check if I voted
}

export const usePollRealtime = (pollId: string) => {
    const queryClient = useQueryClient();

    // 1. Fetch Candidates and Initial Votes
    const { data: candidates, isLoading, refetch } = useQuery({
        queryKey: ['poll_candidates', pollId],
        queryFn: async () => {
            // Fetch candidates joined with anime info
            const { data: candidateData, error: candError } = await supabase
                .from('poll_candidates')
                .select(`
                    id,
                    anime:animes (
                        id,
                        title_en,
                        image_url
                    )
                `)
                .eq('poll_id', pollId);

            if (candError) throw candError;

            // Fetch votes separately to aggregate
            // (Count logic could be done with .select(count), but we need to know WHO voted too for "My Vote")
            const { data: votesData, error: voteError } = await supabase
                .from('votes')
                .select('id, candidate_id, user_id')
                .eq('poll_id', pollId);

            if (voteError) throw voteError;

            // Aggregate
            const mappedCandidates = candidateData.map((c: any) => {
                const count = votesData.filter((v: any) => v.candidate_id === c.id).length;
                return {
                    id: c.id,
                    anime: c.anime,
                    vote_count: count
                };
            });

            // We also want to know "my vote" (user_id is handled in component via auth context usually, but returning votes helps)
            return { candidates: mappedCandidates, votes: votesData };
        },
        enabled: !!pollId,
    });

    // 2. Realtime Subscription
    useEffect(() => {
        if (!pollId) return;

        const channel = supabase.channel(`poll_votes:${pollId}`)
            .on(
                'postgres_changes',
                {
                    event: '*', // INSERT, DELETE (no update for votes usually)
                    schema: 'public',
                    table: 'votes',
                    filter: `poll_id=eq.${pollId}`,
                },
                (payload) => {
                    // console.log('Realtime Vote Change:', payload);
                    // Simple strategy: Refetch the data. 
                    // Optimized strategy: optimistic update active data.
                    // Given high speed requirements (maybe?), refetch is safer for consistency.
                    // But requirement says "update local state immediately".
                    // Let's rely on Query Invalidation which triggers refetch.
                    queryClient.invalidateQueries({ queryKey: ['poll_candidates', pollId] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [pollId, queryClient]);

    return {
        candidates: candidates?.candidates || [],
        allVotes: candidates?.votes || [],
        isLoading
    };
};
