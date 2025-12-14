# AnimeFound - Development Roadmap

This file tracks the progress of the AnimeFound application development.
Based on `@docs/07_DEVELOPMENT_WORKFLOW_AND_TESTS.md` and `@docs/03_TECH_STACK_ANALYSIS.md`.

## Project Status
**Current Phase:** Phase 6 (Completed)

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
- [x] **Settings & Profile Expansion:**
    - [x] Create `src/app/settings.tsx`.
    - [x] Move Logout Button to Settings.
    - [x] Add App Version Display.
    - [x] Privacy: "Delete Account" Button (Supabase Auth Cascade).
- [x] **Group Administration:**
    - [x] Feature: "Leave Group" (Member).
    - [x] Feature: "Remove Member" (Admin Only).
- [x] **Final Cleanup:**
    - [x] Remove all `console.log`.
    - [x] Ensure 100% French Localization.

## Phase 5: Voting System (Realtime)
- [x] **Database Schema (Voting):**
    - [x] Design tables: `polls`, `poll_candidates`, `votes`.
    - [x] Create migration SQL file.
- [x] **Realtime Logic:**
    - [x] Enable Supabase Realtime on `votes`.
    - [x] Create `usePollRealtime` hook.
- [x] **UI - Create Duel (Admin):**
    - [x] "Démarrer un vote" flow in Group Screen.
    - [x] Candidate Selection (from Plan to Watch).
- [x] **UI - The Arena (Voting Screen):**
    - [x] Dedicated Voting View with Real-time progress.
    - [x] Interaction: Tap to Vote.
    - [x] "Close Vote" Admin Action.
- [x] **UI - Results:**
    - [x] Winner announcement screen.

## Phase 6: Push Notifications
**Goal:** Engage users by notifying them of important group events (New Duel).

- [x] **Database Setup:**
    - [x] Add `expo_push_token` column to `profiles` table.
    - [x] Update RLS to allow users to write their own token.
- [x] **Frontend - Permissions & Tokens:**
    - [x] Install `expo-notifications` & `expo-device`.
    - [x] Configure `app.json`.
    - [x] Create `usePushNotifications` hook (Request Perms -> Get Token -> Save to DB).
- [x] **Logic - Sender Service:**
    - [x] Create `src/core/services/notifications.ts`.
    - [x] Implement `sendPushToGroup(groupId, title, body)` using Expo Push API.
- [x] **Integration - Triggers:**
    - [x] Trigger notification on "New Poll" (`useCreatePoll`).
