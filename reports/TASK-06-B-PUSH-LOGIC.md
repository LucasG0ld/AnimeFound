# TASK-06-B-PUSH-LOGIC: Notifications Complete

**Status:** ✅ Completed
**Date:** 2025-12-14

## 1. Goal
Implement the logic to send push notifications when specific group events occur (specifically, a new duel/poll).

## 2. Implementation

### Sender Service (`src/core/services/notifications.ts`)
- **Function:** `sendPushToGroup(groupId, senderId, options)`
- **Logic:**
    1. Fetches all group members from `group_members` table.
    2. Fetches their `expo_push_token` from `profiles` table.
    3. Filters out the sender (so you don't ping yourself).
    4. Sends a batched request to `https://exp.host/--/api/v2/push/send`.

### Integration (`useCreatePoll.ts`)
- Modified the mutation hooking.
- **On Success:**
    - Fetches the user's profile to get their name.
    - Triggers `sendPushToGroup` with the message: "⚔️ C'est l'Heure du Duel ! [User] a lancé un vote."

### Dependencies
- Resolved peer dependency conflicts with React 19 by using `--legacy-peer-deps`.
- `expo-notifications` and `expo-device` are correctly installed.

## 3. Conclusion
Phase 6 is complete. Users (on physical devices) will now receive alerts when duels start, increasing engagement and voting participation.
