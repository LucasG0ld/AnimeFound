# TASK-04-A: Anime Details Screen

**Status:** ✅ Completed
**Date:** 2025-12-13

## 1. Goal
Create a detailed view for Anime items (`/anime/[id]`) that serves as the central hub for user interaction (Rating, Status, Comments).

## 2. Implementation Details

### Data Layer
- **New Hook:** `useAnimeDetails(id)`
    - Fetches Anime metadata from `animes` table.
    - Fetches specific User interaction from `library_items` (Status, Rating, Comment).
    - Returns a unified object.
- **Mutation:** Reused `useUpdateLibraryItem` to save changes.

### UI Components
- **Screen:** `src/app/anime/[id].tsx`
    - **Header:** Full-width Banner Image with Linear Gradient overlay.
    - **Title Section:** Title, Year, Type Chip.
    - **Status:** Selectable Chips (En cours, Terminé, etc.).
    - **Rating:** Interactive 10-Star row.
    - **Comment:** Multiline TextInput.
- **Card:** `AnimeCard.tsx` (Refactored)
    - Updated to link directly to the new details screen.
    - Enforced 2:3 Aspect ratio (Poster Grid).

### Theming
- Strict adherence to **Gold & Carbon** (`#FFBF00` / `#2B2B2B`).
- Added `surface` color (`#3C3C3C`) for input backgrounds and chips.

## 3. Verification

### Manual Tests
- [x] **Navigation:** Tapping a card in Library opens the details screen.
- [x] **Display:** Banner, Title, and Chips render correctly.
- [x] **Interaction:**
    - Changing Status highlights the correct chip.
    - Tapping stars updates the rating count (X/10).
    - Typing in comment works.
- [x] **Persistence:** Clicking "Enregistrer" saves data to Supabase and redirects back.
- [x] **UI Polish:** Verified on Dark Mode (Carbon).

## 4. Next Steps
- Proceed to **Settings & Profile Expansion** (Phase 4B).
