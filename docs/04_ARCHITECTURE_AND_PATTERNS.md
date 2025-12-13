# 04_ARCHITECTURE_AND_PATTERNS.md

## 1. Project Structure (Feature-First)
Do not group by file type (e.g., "components", "screens"). Group by **Feature**.

src/
├── app/                 # Expo Router pages
├── core/                # Global utilities, theme, constants, auth context
│   ├── theme/           # colors.ts (Gold & Carbon definitions)
│   ├── auth/
│   └── services/        # supabase.ts, api.ts
├── components/          # Shared atomic UI components (Button, Input, Card)
└── features/            # Business Logic
    ├── library/         # Components & Hooks for Personal Library
    ├── groups/          # Components & Hooks for Squads
    ├── search/          # Logic for Jikan API
    └── profile/

## 2. Design Patterns
*   **MVVM-ish (Hooks):** UI components must NOT contain heavy logic.
    *   *Bad:* Fetching data directly inside `useEffect` in a View.
    *   *Good:* Create a custom hook `useAnimeSearch()` that returns `{ data, isLoading, error }` using React Query.
*   **Atomic Design:**
    *   **Atoms:** Text, Button (Gold), Input.
    *   **Molecules:** AnimeCard (Image + Title), UserAvatar.
    *   **Organisms:** AnimeGrid, ActivityFeed.

## 3. Data Flow
1.  **Read:** Component calls Custom Hook -> Hook calls React Query -> React Query calls Supabase/API.
2.  **Write:** Component calls Mutation Hook -> Hook calls Supabase -> **On Success:** Invalidate Query (auto-refresh UI).

## 4. Error Handling
*   All API calls must be wrapped in `try/catch` or handled via React Query's `onError`.
*   User Feedback: Show Toast messages (French text) on errors, do not crash the app.