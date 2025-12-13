# 01_PROJECT_VISION_AND_SCOPE.md

## 1. Executive Summary
**Project Name:** AnimeFound (Working Title)
**Type:** Mobile Application (iOS & Android)
**Core Concept:** A premium, social-first anime tracking application designed to replace manual spreadsheets.
**Primary Goal:** Allow groups of friends to track their personal watchlists while seamlessly sharing their progress, ratings, and recommendations within private "Squads" (Groups).

The application shifts from a manual data-entry model (Google Sheets) to an automated, API-driven experience, wrapped in a high-end "Gold & Carbon" design.

---

## 2. Core Value Proposition
1.  **Frictionless Entry:** Replace manual typing of anime metadata (Title, Year, Image) with automated fetching via public APIs.
2.  **Social Aggregation:** Users track animes on their *own* profiles, but Groups act as "Filters" to visualize collective progress, shared interests, and activity feeds.
3.  **Visual Premium:** A dark-mode-only, aesthetically pleasing interface that feels like a modern social network, not a utility tool.

---

## 3. Functional Specifications

### 3.1 Authentication & User Management
*   **Login/Signup:**
    *   Sign in with Google (OAuth).
    *   Sign in with Email/Password.
    *   "Forgot Password" flow.
*   **Onboarding:** Simple profile creation (Username + Avatar).

### 3.2 Personal Library (The "Profile-Centric" Model)
*   **Logic:** This is the source of truth. Data belongs to the User, not the Group.
*   **Statuses:** Users can categorize animes into:
    *   *Watching* (En cours)
    *   *Completed* (Terminé)
    *   *Plan to Watch* (À voir / Watchlist)
    *   *Dropped* (Abandonné)
*   **Rating:** Simple 0 to 5 star rating system (0.5 increments). No complex criteria (Music/Story) for MVP.
*   **Review:** Text comment capability.

### 3.3 The "Squads" (Group System)
*   **Structure:** Users can create or join multiple groups (e.g., "Best Friends", "Co-workers").
*   **Membership:**
    *   Admin-based invitation system.
    *   Admin can delegate "Invite rights" to other members.
*   **Group Views:**
    *   **Activity Feed:** A vertical timeline showing member actions ("User X watched One Piece", "User Y added Naruto to watchlist").
    *   **Shared Catalogue (The "De-duplication" Logic):** A consolidated list of all animes interacting with the group members.
        *   *Constraint:* If User A and User B both watched "Attack on Titan", the anime appears **once** in the list, showing avatars of both A and B.
        *   *Sorting:* By "Group Average Rating", "Most Watched", "Recent Activity".
*   **Spoiler Protection:**
    *   Comments in the Activity Feed must have a "Contains Spoiler" toggle.
    *   Spoilers are blurred/hidden by default (Click-to-reveal interaction).

### 3.4 Search & Add (API Integration)
*   **Data Source:** Jikan API (Unofficial MyAnimeList API) or similar.
*   **Search Flow:**
    *   User types a query.
    *   App fetches results (Images, Titles in English, Year, Type).
    *   **Language Preference:** Titles must be displayed in **English** (e.g., "Attack on Titan", not "Shingeki no Kyojin") where possible.
*   **Add Flow:** One-click addition to the user's Personal Library with immediate Status selection.

### 3.5 Profile & Settings
*   **Global Stats:** Total animes watched, Total days spent watching (if available).
*   **Settings:**
    *   Account management (Delete account, Change email).
    *   Notifications settings.
    *   About / Legal.

---

## 4. Technical Constraints & Data Logic
*   **Platform:** Cross-platform Mobile (iOS & Android).
*   **Data Architecture:**
    *   **Single Source of Truth:** An anime is added to a central `animes` table (cached from API).
    *   **User Relation:** `library_items` links a User to an Anime.
    *   **Group Relation:** `groups` link Users together. The Group View is a *query* resulting from the intersection of Group Members and their Library Items.
*   **Offline Capability:** The app should function in "read-only" mode for the library if offline (caching required), but search/social features require connection.

---

## 5. Design Guidelines (High Level)
*   **Theme:** "Gold & Carbon".
*   **Atmosphere:** Dark, Sleek, Cinematic.
*   **Key Colors:**
    *   Background: `#2B2B2B` (Carbon)
    *   Accent: `#FFBF00` (Gold/Amber)
*   **UX Priority:** Simple navigation (Bottom Bar), Minimal clicks to rate/add, Focus on high-quality imagery (Portrait ratio posters).

## 6. Out of Scope (MVP)
*   Direct Messaging (Chat) within the app.
*   Complex recommendation algorithms (AI-based suggestions).
*   Paid subscriptions or Ads.
*   Web version (Mobile App only for now).