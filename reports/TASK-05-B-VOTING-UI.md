# TASK-05-B: Voting UI & Realtime Logic

**Status:** ✅ Completed
**Date:** 2025-12-14

## 1. Goal
Implement the frontend interfaces and logic for creating, viewing, and participating in an anime duel (poll).

## 2. Implementation Details

### Hooks (`src/features/voting/`)
- `useActivePoll`: Detects if an 'OPEN' poll exists for a group.
- `usePollRealtime`: Fetches initial state and updates via `supabase.channel` (Postgres Changes) on the `votes` table.
- `useCreatePoll`: Transaction-like helper to insert Poll + Candidates.
- `useVote`: Casts a vote.
- `useClosePoll`: Updates status to 'CLOSED'.

### Components
- **`ActivePollWidget`**:
    - Embedded in `GroupDetailsScreen`.
    - Shows progress bars (Gold vs Carbon) for candidates.
    - Updates in real-time as other users (or self) vote.
    - Admin controls: "Lock" icon to close the poll.

- **`CreatePollScreen`**:
    - Accessible only by Admins.
    - Lists "Plan to Watch" items from the group's shared library.
    - Limits selection to 5 items.

### Integration
- `GroupDetailsScreen` dynamically switches between "Admin Create Button" (if no poll) and the `ActivePollWidget`.

## 3. Verification Steps
1.  **Admin:** Go to a group -> Click "Démarrer un Duel".
2.  **Creation:** Select 2 items -> "Lancer".
3.  **Widget:** Verify widget appears on Group screen.
4.  **Vote:** Tap an item -> Progress bar updates.
5.  **Realtime:** (Requires 2 clients/simulators) Vote on one, see update on other.
6.  **Close:** Click Lock icon -> Confirm -> Poll closes.

## 4. Remaining Work
- **Results Screen:** Currently, closing a poll just hides the widget (or stops updating). We need a "Winner" announcement.
