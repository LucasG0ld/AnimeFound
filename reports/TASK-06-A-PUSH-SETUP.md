# TASK-06-A-PUSH-SETUP.md: Push Notification Setup

**Status:** ✅ Completed
**Date:** 2025-12-14

## 1. Goal
Prepare the AnimeFound application to receive Push Notifications via Expo Push Service. This involves database changes, dependency installation, and client-side token registration.

## 2. Implementation Details

### Database (`notifications_schema.sql`)
- **Schema:** Added `expo_push_token` (TEXT) column to the `profiles` table.
- **Why:** This stores the unique device token required to target a specific user.

### Configuration (`app.json`)
- Installed `expo-notifications`, `expo-device`, `expo-constants`.
- Configured Notification Icon and Color (`#FFBF00` Gold).
- Added placeholder for `projectId` (requires real EAS project ID).

### Client Logic
- **Hook:** `src/core/hooks/useRegisterPushToken.ts`
    - Checks for physical device.
    - Requests permissions (Alert/Sound/Badge).
    - Retrieves `ExpoPushToken`.
    - **Sync:** Upserts the token to Supabase `profiles` table for the logged-in user.
- **Integration:** Hook is called in `src/app/_layout.tsx` to ensure tokens are kept fresh on every app launch.

## 3. Next Steps
- Implement server-side logic (or edge function) to send messages using these tokens.
- Trigger notifications when a Poll is created.
