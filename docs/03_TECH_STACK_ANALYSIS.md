# 03_TECH_STACK_ANALYSIS.md

## 1. Core Framework
*   **Framework:** React Native (via **Expo SDK 50+**).
    *   *Justification:* Speed of development, easy OTA updates (EAS), unified codebase for iOS/Android.
*   **Language:** TypeScript.
    *   *Requirement:* Strict typing is mandatory for robust data handling (Supabase types).

## 2. Backend & Data
*   **BaaS:** **Supabase**.
    *   *Auth:* Native Supabase Auth (Email/Password + Google OAuth).
    *   *Database:* PostgreSQL.
    *   *Storage:* Supabase Storage (for User Avatars).
*   **API Client:** `@supabase/supabase-js`.

## 3. External API (Anime Data)
*   **Provider:** **Jikan API v4** (Unofficial MyAnimeList API).
*   **Endpoints:** `/anime?q={query}` (Search) and `/anime/{id}` (Details).
*   **Rate Limiting:** The app must handle Jikan's rate limits (3 requests/second) gracefully (using debounce and caching).

## 4. Key Libraries (The "Golden Stack")
*   **Navigation:** `expo-router` (v3+). File-based routing is preferred.
*   **State Management:**
    *   `@tanstack/react-query`: For server state (fetching anime, syncing Supabase). **CRITICAL** for caching and performance.
    *   `zustand`: For local global state (e.g., Session management, Theme toggle).
*   **Styling:** `react-native-stylesheet` (Native) or `tamagui` / `gluestack` (if needed), but native StyleSheet is preferred for performance as per user request.
*   **UI Components:** Build light atomic components. Use `lucide-react-native` or `expo-vector-icons` for icons.
*   **Forms:** `react-hook-form` + `zod` for validation.
*   **Image Handling:** `expo-image` (Best for caching Jikan images).

## 5. Compatibility Check
*   The chosen stack ensures 100% compatibility between iOS and Android.
*   Supabase RLS ensures data security without a custom backend middleware.