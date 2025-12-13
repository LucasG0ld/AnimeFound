# [TASK-01-C] Phase 1: User Profile Feature

**Date:** 2025-12-13
**Status:** ✅ Done

## 📝 Summary
Completed the User Profile feature, officially closing **Phase 1: Foundation**.
- **Data Fetching:** Implemented `useUserProfile` hook using `@tanstack/react-query` to cache profile data.
- **UI:** Built `profile.tsx` strictly following the Design System.
- **Key Feature:** Implemented Avatar Upload using `expo-image-picker` -> Supabase Storage -> Update `profiles` table.

## 📂 Files Modified
- `src/features/profile/useUserProfile.ts` (Created - Hook)
- `src/app/profile.tsx` (Created - UI & Logic)
- `src/app/_layout.tsx` (Modified - Wrapped in `QueryClientProvider` and added route)
- `package.json` (Added `react-query`, `expo-image`, `expo-image-picker`, `expo-file-system`)

## 🛠 Technical Decisions
- **React Query:** Used `useQuery` for fetching profile data. This ensures that when the user updates their avatar, we can simply call `queryClient.invalidateQueries` to refresh the UI instantly without manual state management.
- **Image Upload:** Used `base64-arraybuffer` to decode the base64 image string from `expo-image-picker` before sending it to Supabase Storage, as Supabase requires binary data even from React Native.
- **Root Layout:** Wrapped the entire application in `QueryClientProvider` to enable React Query globally.

## 🐛 Known Issues / Next Steps
- **Prerequisite:** User MUST create a bucket named `avatars` in Supabase Storage and set it to Public (or add policy).
- **Next Step:** Proceed to **Phase 2: Data Core (Search & Jikan API)**.
