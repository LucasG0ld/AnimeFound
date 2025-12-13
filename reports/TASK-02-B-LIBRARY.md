# [TASK-02-B] Phase 2: Personal Library & Navigation

**Date:** 2025-12-13
**Status:** ✅ Done

## 📝 Summary
Completed **Phase 2: Data Core** by building the user's personal library and restructuring the app navigation.
- **Tabs Layout:** Introduced `(tabs)` directory with a proper bottom navigation using `expo-router`.
- **Library Screen:** Built the main dashboard where users can filter their anime list by status (En cours, Terminés, etc.).
- **Hooks:** Implemented `useUserLibrary` with a join query to fetch anime details efficiently, plus mutation hooks for future use.

## 📂 Files Modified
- `src/app/(tabs)/_layout.tsx` (Created - Tab Navigator)
- `src/app/(tabs)/library.tsx` (Created - Main Screen with FlashList)
- `src/app/(tabs)/search.tsx` (Moved from `src/app/`)
- `src/app/(tabs)/profile.tsx` (Moved from `src/app/`)
- `src/features/library/useUserLibrary.ts` (Created)
- `src/features/library/useUpdateLibraryItem.ts` (Created)
- `src/features/library/useDeleteLibraryItem.ts` (Created)
- `src/app/_layout.tsx` (Updated to mount `(tabs)`)
- `src/app/index.tsx` (Updated to redirect to library)

## 🛠 Technical Decisions
- **Join Query:** Supabase allows joining related tables in a single query. `useUserLibrary` fetches `library_items` and joins `animes` to get title/image in one go.
- **Navigation:** Refactored the app to use a Slot-based Stack approach where `(tabs)` is a single screen in the root stack. This allows "Login" to be a full-screen modal/stack item outside the tabs.
- **Redirect:** The root `index.tsx` now redirects authenticated users directly to `/(tabs)/library`.

## 🐛 Known Issues / Next Steps
- **Next Step:** Proceed to **Phase 3: Social Features (Clubs/Groups)**.
