# 06_SECURITY_AND_PERFORMANCE.md

## 1. Security Guidelines
*   **Env Variables:** Store Supabase URL and Anon Key in `.env`. NEVER commit them to Git.
*   **Input Sanitization:** Use Zod schemas to validate all inputs (search queries, comments) before sending to DB.
*   **Auth Protection:** All "Write" screens (Add to library, Create group) must be protected by a `AuthGuard` component that redirects to Login if session is null.

## 2. Performance Optimization
*   **FlashList:** Use Shopify's `FlashList` instead of React Native `FlatList` for long lists (Library, Search Results) to ensure 60fps scrolling.
*   **Image Caching:** Use `expo-image`. Configure it to cache Jikan API images aggressively to save bandwidth.
*   **Debounce:** Implement a 500ms debounce on the Search Bar to prevent hitting Jikan API rate limits.
*   **Memoization:** Use `useMemo` and `useCallback` for filtering and sorting logic in the Library view.

## 3. Offline Strategy
*   Use `tanstack-query`'s `persist` features (async-storage) to allow users to view their library even when offline.
*   Disable "Search" and "Group Feed" when network is unreachable (show "Pas de connexion" banner).