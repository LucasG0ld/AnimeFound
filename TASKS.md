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
- [ ] **Supabase Setup:** Initialize Client with Types from Schema.
- [ ] **Auth Implementation:**
    - [ ] Create `AuthContext` / Session Provider.
    - [ ] Implement `expo-secure-store` Adapter for Supabase.
    - [ ] Build Login Screen (Gold & Carbon UI).
    - [ ] Build Sign-up Screen.
- [ ] **Profile Feature:**
    - [ ] Fetch User Profile from `profiles` table.
    - [ ] Display Avatar & Username.
    - [ ] Implement Edit Profile (Avatar upload).

## Phase 2: Data Core (Jikan & Library)
- [ ] **Search Feature (Jikan API v4):**
    - [ ] Implement Jikan Client with Rate Limiting handling.
    - [ ] **Data Strategy:** Implement "Cache-First" Pattern.
        - *Logic:* `Check Supabase 'animes' -> If Miss, Fetch Jikan -> Insert 'animes' -> Return`.
    - [ ] Build Search UI (Debounced Input).
- [ ] **Library Management:**
    - [ ] Create `library_items` Interaction (Add/Update Status).
    - [ ] Build "My Library" Screen with Tabs (Watching, Completed, etc.).
    - [ ] Implement `FlashList` for performant list rendering.

## Phase 3: Social & UI Polish
- [ ] **Group System:**
    - [ ] Create Group / Join Group (Invite Code).
    - [ ] **Shared Catalogue:** Implement the "De-duplication" Query (Aggregated View).
    - [ ] **Activity Feed:** Real-time(ish) updates of member activities using `FlashList`.
- [ ] **UI/UX Polish:**
    - [ ] Verify "Gold & Carbon" Theme consistency (`#2B2B2B` / `#FFBF00`).
    - [ ] **Localization:** Ensure ALL user-facing text is in **FRENCH**.
    - [ ] Optimize Images (Portrait Ratio enforcement).
