export interface JikanAnime {
    mal_id: number;
    title: string;
    title_english: string | null;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    type: string;
    year: number | null;
    episodes: number | null;
    synopsis: string | null;
}

interface JikanResponse {
    data: JikanAnime[];
}

const BASE_URL = 'https://api.jikan.moe/v4';

export const jikanService = {
    searchAnime: async (query: string): Promise<JikanAnime[]> => {
        try {
            if (!query.trim()) return [];

            const response = await fetch(`${BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=10`);

            if (!response.ok) {
                // Jikan Rate Limit: 429
                if (response.status === 429) {
                    throw new Error('Trop de requêtes. Veuillez patienter.');
                }
                throw new Error('Erreur lors de la recherche.');
            }

            const data: JikanResponse = await response.json();
            return data.data;
        } catch (error: any) {
            console.error('[Jikan Service] Error:', error);
            throw error;
        }
    },
};
