# AnimeFound - Development Roadmap

This file tracks the progress of the AnimeFound application development.
Based on `@docs/07_DEVELOPMENT_WORKFLOW_AND_TESTS.md` and `@docs/03_TECH_STACK_ANALYSIS.md`.

## Project Status
**Current Phase:** Phase 0

---

## Phase 0: Setup & Configuration
- [x] Initialize Expo project (TypeScript, Router).
- [x] Setup ESLint & Prettier with project rules.
- [x] Install Core Dependencies (`@supabase/supabase-js`, `expo-router`, `lucide-react-native`).
- [x] Configure `expo-secure-store` for Auth persistence (Critical for Mobile Auth).

## Phase 1: Foundation (Auth & Profile)
- [x] **Supabase Setup:** Initialize Client with Types from Schema.
- [/] **Auth Implementation:**
    - [x] Create `AuthContext` / Session Provider.
    - [x] Implement `expo-secure-store` Adapter for Supabase.
    - [x] Build Login Screen (Gold & Carbon UI).
    - [x] Build Sign-up Screen.
- [x] **Profile Feature:**
    - [x] Fetch User Profile from `profiles` table.
    - [x] Display Avatar & Username.
    - [x] Implement Edit Profile (Avatar upload).

## Phase 2: Data Core (Jikan & Library)
- [x] **Search Feature (Jikan API v4):**
    - [x] Implement Jikan Client with Rate Limiting handling.
    - [x] **Data Strategy:** Implement "Cache-First" Pattern.
        - *Logic:* `Check Supabase 'animes' -> If Miss, Fetch Jikan -> Insert 'animes' -> Return`.
    - [x] Build Search UI (Debounced Input).
- [x] **Library Management:**
    - [x] Create `library_items` Interaction (Add/Update Status).
    - [x] Build "My Library" Screen with Tabs (Watching, Completed, etc.).
    - [x] Implement `FlashList` for performant list rendering.
    - [x] Implement Library Fetch Hook (Joined).
    - [x] Implement Library Update/Delete Hooks.
    - [x] Implement Shared Catalogue Aggregation Hook <!-- id: 22 -->
    - [x] Implement Group Activity Feed Hook <!-- id: 23 -->
    - [x] Update Group Details UI (Tabs: Feed/Catalogue) <!-- id: 24 -->
    - [x] Setup Tabs Layout (Expo Router).
    - [x] Build Library Screen UI (Grid + Filters).

## Phase 3: Social & UI Polish
- [x] **Group System:**
    - [x] Create/Update `groups` and `group_members` tables (Done in Schema).
    - [x] Implement Logic: Create Group, Join (via Code), List User Groups.
    - [x] **Shared Catalogue:** Implement the "De-duplication" Query (Aggregated View).
    - [x] **Activity Feed:** Real-time(ish) updates of member activities using `FlashList`.
- [x] **UI/UX Polish:**
    - [x] Verify "Gold & Carbon" Theme consistency (`#2B2B2B` / `#FFBF00`).
    - [x] **Localization:** Ensure ALL user-facing text is in **FRENCH**.
    - [x] Optimize Images (Portrait Ratio enforcement).
    - [x] Implement Empty States for all screens.
    - [x] Configure `app.json` (Name, Orientation, Dark Mode).

## Phase 4: Expansion & Polish
- [x] **Anime Details Screen:**
    - [x] Dynamic Route `src/app/anime/[id].tsx`.
    - [x] Fetch Metadata & User Status/Rating (Joined Query).
    - [x] Interactions: Change Status, Set Rating, Edit Comment.
- [ ] **Settings & Profile Expansion:**
    - [ ] Create `src/app/settings.tsx`.
    - [ ] Move Logout Button to Settings.
    - [ ] Add App Version Display.
    - [ ] Privacy: "Delete Account" Button (Supabase Auth Cascade).
- [ ] **Group Administration:**
    - [ ] Feature: "Leave Group" (Member).
    - [ ] Feature: "Remove Member" (Admin Only).
- [ ] **Final Cleanup:**
    - [ ] Remove all `console.log`.
    - [ ] Ensure 100% French Localization.
