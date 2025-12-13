-- Enable deletion of group members
-- 1. Self-Delete (Leave Group)
-- A user can delete their own row in group_members.
CREATE POLICY "Users can leave groups (delete own membership)"
ON group_members
FOR DELETE
USING (
  auth.uid() = user_id
);

-- 2. Admin-Delete (Kick Member)
-- An ADMIN of a group can delete other members in the same group.
-- We check if the current user has an 'ADMIN' role for the target group_id.
CREATE POLICY "Admins can kick members"
ON group_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM group_members AS gm
    WHERE gm.group_id = group_members.group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'ADMIN'
  )
);
