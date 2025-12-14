# TASK-05-C: Voting System Wrap-up

**Status:** ✅ Completed
**Date:** 2025-12-14

## 1. Goal
Finalize the Voting System by implementing the "Results" view and the ability to archive complete polls to start fresh.

## 2. Implementation Details

### Winner Widget (`PollWinnerWidget.tsx`)
- Appears when a poll status is CLOSED.
- Calculates the winning anime (highest votes).
- Displays a celebratory UI with the Winner's cover.
- **Admin Action:** "Terminer le Duel" -> Calls `useArchivePoll`.

### Poll Lifecycle Management
1.  **Creation:** Admin selects items -> Poll OPEN.
2.  **Voting:** Members vote -> Realtime updates.
3.  **Closing:** Admin clicks "Lock" -> Poll CLOSED -> Votes locked.
4.  **Results:** Winner Widget shown.
5.  **Archiving:** Admin clicks "Terminer" -> Poll DELETED -> Clean slate.

### Logic Updates
- Refactored `useActivePoll` to fetch the **Latest** poll (regardless of status), enabling the app to persist the "Winner" view until explicit archiving.

## 3. Conclusion
Phase 5 is fully implemented. Groups can now engage in the core loop: **Plan -> Vote -> Watch**.
