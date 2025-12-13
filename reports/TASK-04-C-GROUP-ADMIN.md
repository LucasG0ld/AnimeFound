# TASK-04-C: Group Administration

**Status:** ✅ Completed
**Date:** 2025-12-14

## 1. Goal
Provide group members with control over their membership (Leave) and allow Admins to manage their group (Kick).

## 2. Implementation Details

### UI Updates (`GroupDetailsScreen`)
- Added **"Membres" Tab** to the Group Details view.
- **Member List:** Displays Avatar, Username, Role.
- **Admin Features:**
    - "Trash" icon appears next to members if the current user is an Admin.
    - Confirms before removing a member.
- **User Features:**
    - "Quitter le groupe" button (Ghost Red) at the bottom of the Members list.

### Components
- Updated `Button` component to support `icon` and `textStyle` props for red/danger styling.

### Logic & Data
- **Hooks:**
    - `useLeaveGroup`: Calls Supabase to delete self from `group_members`.
    - `useKickMember`: Calls Supabase to delete another user (requires RLS).
- **Security (RLS):**
    - `group_policies.sql` created to allow:
        1. Users to DELETE their own row.
        2. Users with 'ADMIN' role to DELETE other rows in the same group.

## 3. Verification

### Manual Tests
- [x] **Leave Group:**
    - Button appears in Members tab.
    - Alert confirms intent.
    - Success redirects to Group List.
- [x] **Kick Member:**
    - Trash icon ONLY appears for Admins (and not for self).
    - Alert confirms intent.
    - Success refreshes the member list.
- [x] **Visuals:**
    - Red styling for danger actions is consistent.
    - Icons (LogOut, Trash2) are correctly aligned.

## 4. Conclusion
Phase 4 is now feature-complete. The application has:
- Anime Details & Library Management.
- Group Social Features (Feed, Shared Catalogue).
- Robust Profile & Settings (Edit, Logout, Delete Account).
- Group Administration.

**Next:** Final Polish & Cleanup.
