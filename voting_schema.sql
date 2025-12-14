-- =============================================
-- PHASE 5: VOTING SYSTEM SCHEMA
-- =============================================

-- 1. POLLS TABLE
-- Represents a voting session within a group.
CREATE TABLE public.polls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    status TEXT CHECK (status IN ('OPEN', 'CLOSED')) DEFAULT 'OPEN' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 2. POLL CANDIDATES TABLE
-- The anime options available in a specific poll.
CREATE TABLE public.poll_candidates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    anime_id UUID REFERENCES public.animes(id) NOT NULL
);

-- 3. VOTES TABLE
-- Individual votes cast by members.
CREATE TABLE public.votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
    candidate_id UUID REFERENCES public.poll_candidates(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- Constraint: A user can only vote ONCE per poll
    UNIQUE(poll_id, user_id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- --- POLLS POLICIES ---

-- READ: Group Members can view polls.
CREATE POLICY "Group members can view polls" ON public.polls
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.group_id = polls.group_id
        AND gm.user_id = auth.uid()
    )
);

-- WRITE: Group Admins can create/update polls (e.g., close them).
CREATE POLICY "Group admins can manage polls" ON public.polls
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.group_members gm
        WHERE gm.group_id = polls.group_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'ADMIN'
    )
);

-- --- POLL CANDIDATES POLICIES ---

-- READ: Group Members can view candidates via the poll.
CREATE POLICY "Group members can view candidates" ON public.poll_candidates
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.polls p
        JOIN public.group_members gm ON p.group_id = gm.group_id
        WHERE p.id = poll_candidates.poll_id
        AND gm.user_id = auth.uid()
    )
);

-- WRITE: Group Admins can add candidates (usually at poll creation).
CREATE POLICY "Group admins can add candidates" ON public.poll_candidates
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.polls p
        JOIN public.group_members gm ON p.group_id = gm.group_id
        WHERE p.id = poll_candidates.poll_id
        AND gm.user_id = auth.uid()
        AND gm.role = 'ADMIN'
    )
);

-- --- VOTES POLICIES ---

-- READ: Group Members can see who voted for what (Transparency).
CREATE POLICY "Group members can view votes" ON public.votes
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.polls p
        JOIN public.group_members gm ON p.group_id = gm.group_id
        WHERE p.id = votes.poll_id
        AND gm.user_id = auth.uid()
    )
);

-- INSERT: Members can vote if Poll is OPEN.
CREATE POLICY "Members can vote in open polls" ON public.votes
FOR INSERT WITH CHECK (
    -- 1. Must be the authenticated user
    auth.uid() = user_id
    AND
    -- 2. Poll must be OPEN
    EXISTS (
        SELECT 1 FROM public.polls p
        WHERE p.id = votes.poll_id
        AND p.status = 'OPEN'
    )
    AND
    -- 3. Must be a member of the group
    EXISTS (
        SELECT 1 FROM public.polls p
        JOIN public.group_members gm ON p.group_id = gm.group_id
        WHERE p.id = votes.poll_id
        AND gm.user_id = auth.uid()
    )
);

-- =============================================
-- REALTIME SUBSCRIPTION
-- =============================================

-- Add 'votes' to the publication to enable Realtime events
ALTER PUBLICATION supabase_realtime ADD TABLE public.votes;
