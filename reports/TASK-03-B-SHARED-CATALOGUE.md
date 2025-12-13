# [TASK-03-B] Phase 3: Shared Catalogue & Activity Feed

**Date:** 2025-12-13
**Status:** ✅ Done

## 📝 Summary
Added the "Heart" of the app: **The Shared Catalogue**.
- **Catalogue View:** Users can see an aggregated view of all animes watched by the group. The list is de-duplicated: if 3 people watch "Naruto", it appears once, but with the avatars of all 3 watchers and their average rating.
- **Activity Feed:** A timeline showing "Who watched what" recently, with spoiler protection for comments.
- **UI:** The Group Details screen now uses a Segmented Control to switch between these two powerful views.

## 📂 Files Modified
- `src/features/groups/useGroupLibrary.ts` (Created - Aggregation Logic)
- `src/features/groups/useGroupFeed.ts` (Created - Timeline Logic)
- `src/app/group/[id].tsx` (Modified - Added Tabs & Renderers)

## 🛠 Technical Decisions
- **Client-Side Aggregation:**
    - To avoid complex backend logic for now, we fetch all relevant library items and aggregate them in JavaScript (`Map<AnimeID, Aggregate>`). This works well for small groups (< 50 members).
    - The aggregation logic calculates the *Average Rating* dynamically.
- **Performance:**
    - Both views use `FlashList`.
    - `useGroupLibrary` fetches data *once* and we process it in memory.
- **Spoiler Handling:**
    - Comments are hidden behind a "Voir le commentaire" toggle by default if they are marked as spoilers (currently purely UI toggle, ready for backend flag).

## 🐛 Known Issues / Next Steps
- **Next Step:** Proceed to **Phase 3 - Part C: Voting System ("C'est l'Heure du Duel")**. The final piece of the puzzle!
