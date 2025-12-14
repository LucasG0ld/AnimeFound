# 🚀 AnimeFound - MVP Release Notes

**Version:** 1.0.0
**Date:** 2025-12-13
**Theme:** "Gold & Carbon"

## 🌟 Executive Summary
AnimeFound is now complete! It is a robust, social-first anime tracking application.
Users can track their personal progress (Watching, Completed...), but more importantly, they can join **Squads** (Groups) to see what their friends are watching.
All data is synchronized in real-time between members of a group via the **Shared Catalogue**.

## 📦 Features Delivered

### 1. 👤 Identity & Foundation
- **Authentication:** Login/Signup via Supabase (Email/Password).
- **Profile:** Avatar upload (Storage) and Username management.
- **Secure:** Sessions persist securely on the device.

### 2. 📚 Personal Library
- **Search:** Instant anime search via Jikan API (MyAnimeList).
- **Tracking:** 4 statuses (En cours, Terminés, À voir, Abandonnés).
- **Performance:** Optimized `FlashList` rendering for smooth scrolling.

### 3. 🤝 Social & Groups (The "Killer Feature")
- **Squads:** Create or Join groups using a unique **Invite Code**.
- **Shared Catalogue:**
    - A consolidated view of ALL items watched by ANY member.
    - **Smart Aggregation:** If 3 members watch "One Piece", it appears as ONE card with 3 user avatars.
    - **Group Rating:** Displays the average rating of the group.
- **Activity Feed:** A timeline of "Who did what" (e.g., "Lucas updated Naruto: 9/10").
- **Spoiler Protection:** Comments are blurred by default if they contain spoilers.

### 4. 🎭 Anime Details & Interaction
- **Deep Dive:** New dedicated Anime Details screen with banner art.
- **Engagement:** Rate (1-10), Comment, and Manage Status directly from the anime page.

### 5. 🛡️ User & Group Administration
- **Settings:** Manage account, logout, and **delete account** (with cascading data removal).
- **Group Management:**
    - **Leave Group:** Users can leave groups they no longer want to share with.
    - **Kick Member:** Admins have full control to remove members.
    - **Member List:** Dedicated view to see who is in the squad.

### 6. 🎨 UI/UX Polish
- **Theme:** Strict adherence to `#2B2B2B` (Carbon) and `#FFBF00` (Gold).
- **Localization:** 100% French interface.
- **Empty States:** Friendly calls to action when lists are empty.

## 🛠 Tech Stack
- **Framework:** React Native + Expo Router
- **Database:** Supabase (PostgreSQL + RLS)
- **State:** React Query (Server State) + Context (Auth)
- **API:** Jikan v4 (Anime Data)

## 🔮 Future Roadmap (Post-MVP)
## 🔮 Future Roadmap (Post-MVP)
- **Phase 5:** Voting System ("C'est l'Heure du Duel") - Decide what to watch next.
- **Phase 6:** Notifications (Push Notifications for group activity).
