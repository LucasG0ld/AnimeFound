# TASK-04-B: Settings & Profile Expansion

**Status:** ✅ Completed
**Date:** 2025-12-13

## 1. Goal
Implement a dedicated Settings screen to declutter the Profile view and provide critical account management features (Logout, Delete Account).

## 2. Implementation Details

### Settings Screen (`src/app/settings.tsx`)
- **UI:** Standard list layout using "Gold & Carbon" theme.
- **Sections:**
    - **Compte:** Edit Profile (placeholder), Logout.
    - **À propos:** App Version (v1.0.0).
    - **Zone de danger:** Delete Account (Red styling).
- **Features:**
    - **Logout:** Integrated with `AuthContext.signOut()`.
    - **Delete Account:** Implemented via Supabase RPC `delete_own_user()`.
    - **Safety:** added `Alert` confirmation ("Irreversible" warning) before deletion.

### Profile Screen (`src/app/(tabs)/profile.tsx`)
- **Cleanup:** Removed the large "Se déconnecter" button from the bottom.
- **Navigation:** Added a **Gear/Settings Icon** (`Settings` from lucide-react-native) in the top-right corner.

### Backend (`delete_account.sql`)
- Created a PL/pgSQL function `delete_own_user()` that allows a user to delete themselves from `auth.users`, triggering cascading deletes for profile and library items.
- **Action Required:** User must run this SQL in the Supabase Dashboard.

## 3. Verification

### Manual Tests
- [x] **Navigation:** Tapping the Gear icon in Profile opens Settings.
- [x] **Logout:** Tapping "Se déconnecter" logs out and redirects to Login.
- [x] **Delete Account:**
    - Tapping "Supprimer" shows a confirmation alert.
    - Confirming calls the RPC function (requires SQL setup).
    - On success, redirects to Login.

## 4. Next Steps
- **Group Administration** features (Phase 4C).
