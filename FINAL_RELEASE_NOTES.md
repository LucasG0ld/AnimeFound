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

### 4. 🎨 UI/UX Polish
- **Theme:** Strict adherence to `#2B2B2B` (Carbon) and `#FFBF00` (Gold).
- **Localization:** 100% French interface.
- **Empty States:** Friendly calls to action when lists are empty.

## 🛠 Tech Stack
- **Framework:** React Native + Expo Router
- **Database:** Supabase (PostgreSQL + RLS)
- **State:** React Query (Server State) + Context (Auth)
- **API:** Jikan v4 (Anime Data)

## 🔮 Future Roadmap (Post-MVP)
- **Phase 4:** Voting System ("C'est l'Heure du Duel") - Decide what to watch next.
- **Phase 5:** Notifications (Push Notifications for group activity).
