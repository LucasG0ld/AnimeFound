### 📄 05_DATABASE_SCHEMA_AND_RLS.md

C'est le plan de construction de la base de données. Très important pour le "dédoublonnage" des animes.

```markdown
# 05_DATABASE_SCHEMA_AND_RLS.md

## 1. Conceptual Model
*   **Users** exist in `profiles`.
*   **Animes** are unique in the `animes` table (fetched from API, cached in DB).
*   **Library** links Users to Animes (`library_items`).
*   **Groups** link Users together (`group_members`).

## 2. Table Definitions (Supabase SQL)

### `profiles`
*   `id` (uuid, PK, references auth.users)
*   `username` (text, unique)
*   `avatar_url` (text)
*   `created_at` (timestamptz)

### `animes` (The Master Catalog)
*   `id` (uuid, PK)
*   `mal_id` (int, unique - ID from Jikan/MyAnimeList)
*   `title_en` (text)
*   `image_url` (text)
*   `type` (text - TV/Movie)
*   `year` (int)
*   `total_episodes` (int)

### `library_items` (User's Watchlist)
*   `id` (uuid, PK)
*   `user_id` (uuid, FK -> profiles.id)
*   `anime_id` (uuid, FK -> animes.id)
*   `status` (enum: 'WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'DROPPED')
*   `rating` (float, 0-5)
*   `comment` (text)
*   `updated_at` (timestamptz)
*   *Constraint:* Unique combination of (user_id, anime_id).

### `groups`
*   `id` (uuid, PK)
*   `name` (text)
*   `owner_id` (uuid, FK -> profiles.id)
*   `invite_code` (text, unique)

### `group_members`
*   `group_id` (uuid, FK -> groups.id)
*   `user_id` (uuid, FK -> profiles.id)
*   `role` (text: 'ADMIN', 'MEMBER')
*   *Constraint:* PK is (group_id, user_id).

## 3. Row Level Security (RLS) Policies
*   **profiles:** Public read. Update only own profile.
*   **animes:** Public read. Authenticated users can insert (when adding from API).
*   **library_items:**
    *   Read: Public (or restricted to friends/group members in V2).
    *   Insert/Update/Delete: Only `user_id = auth.uid()`.
*   **groups:** Read if member. Update if owner.
*   **group_members:** Read if member of the group.

## 4. Key Logic: The "Group View" Query
To display the "Shared Catalogue" in a group without duplicates:
*   Perform a query on `library_items` where `user_id` is in the list of `group_members`.
*   Group by `anime_id`.
*   Aggregate: Calculate average rating, list participating avatars.