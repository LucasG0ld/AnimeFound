# TASK-05-A: Voting System Database Schema

**Status:** ✅ Completed
**Date:** 2025-12-14

## 1. Goal
Establish the backend foundation for the "C'est l'Heure du Duel" voting feature, enabling groups to democratically decide the next anime to watch.

## 2. Implementation Details

### Database Tables (PostgreSQL)

#### `polls`
- Represents a single voting session.
- **Constraints:** `status` must be 'OPEN' or 'CLOSED'.
- **Security:** Visible to members, editable only by Admins.

#### `poll_candidates`
- Links a Poll to Anime items.
- **Cascade:** Deleting a poll deletes its candidates.

#### `votes`
- Records a user's choice.
- **Uniqueness:** A user can only have ONE vote record per poll (`UNIQUE(poll_id, user_id)`).
- **Realtime:** Table added to `supabase_realtime` publication for live UI updates.

### Security (RLS)
Robust policies ensure data integrity:
- **Vote Integrity:** Users can only vote in 'OPEN' polls.
- **Group Isolation:** Users can only see/vote in polls belonging to their groups.
- **Admin Control:** Only group admins can create or close polls.

## 3. Next Steps
- Implement `usePollRealtime` hook in the frontend.
- Build the "Create Duel" Admin UI.

## 4. How to Use
Run the contents of `voting_schema.sql` in the Supabase SQL Editor.
