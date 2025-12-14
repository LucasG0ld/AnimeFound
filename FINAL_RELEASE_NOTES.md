# 🚀 AnimeFound - MVP Release Notes

**Version:** 1.1.0
**Date:** 2025-12-14
**Theme:** "Gold & Carbon"
**Status:** ✅ 100% COMPLETE

## 🌟 Executive Summary
AnimeFound is now complete! It is a robust, social-first anime tracking application.
Users can track their personal progress (Watching, Completed...), but more importantly, they can join **Squads** (Groups) to see what their friends are watching.
All data is synchronized in real-time between members of a group via the **Shared Catalogue**.
With the addition of **Voting**, groups can now democratically decide their next adventure.

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

### 4. ⚔️ Voting System ("C'est l'Heure du Duel")
- **Create Polls:** Admins can select candidates from the group's "Plan to Watch" list.
- **Real-time Voting:** Members vote, and progress bars update instantly for everyone.
- **Results:** A celebratory "Winner" screen declares the chosen anime.
- **Lifecycle:** Admin controls the flow: Start -> Close -> Archive.

### 5. 🎭 Anime Details & Interaction
- **Deep Dive:** New dedicated Anime Details screen with banner art.
- **Engagement:** Rate (1-10), Comment, and Manage Status directly from the anime page.

### 6. 🛡️ User & Group Administration
- **Settings:** Manage account, logout, and **delete account** (with cascading data removal).
- **Group Management:**
    - **Leave Group:** Users can leave groups they no longer want to share with.
    - **Kick Member:** Admins have full control to remove members.
    - **Member List:** Dedicated view to see who is in the squad.

### 7. 🎨 UI/UX Polish
- **Theme:** Strict adherence to `#2B2B2B` (Carbon) and `#FFBF00` (Gold).
- **Localization:** 100% French interface.
- **Empty States:** Friendly calls to action when lists are empty.

## 🛠 Tech Stack
- **Framework:** React Native + Expo Router
- **Database:** Supabase (PostgreSQL + RLS + Realtime)
- **State:** React Query (Server State) + Context (Auth)
- **API:** Jikan v4 (Anime Data)

## 🔮 Future Roadmap (Post-MVP)
- **Phase 6:** Notifications (Push Notifications for group activity).
- **Phase 7:** Native Mobile Deployment (Apple App Store / Google Play).
