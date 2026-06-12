-- =============================================
-- SitSpot Clans V1 — Migration SQL
-- À exécuter dans l'éditeur SQL de Supabase
-- =============================================

-- TYPEs
DO $$ BEGIN
  CREATE TYPE clan_role AS ENUM ('chef', 'sous_chef', 'admin', 'membre');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE invitation_status AS ENUM ('pending', 'accepted', 'declined', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- TABLE: clans
CREATE TABLE IF NOT EXISTS clans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(30) UNIQUE NOT NULL,
  description  VARCHAR(200),
  logo_url     TEXT,
  created_by   UUID NOT NULL REFERENCES profiles(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  is_dissolved BOOLEAN DEFAULT FALSE
);

-- TABLE: clan_members
CREATE TABLE IF NOT EXISTS clan_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id     UUID NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role        clan_role NOT NULL DEFAULT 'membre',
  joined_at   TIMESTAMPTZ DEFAULT NOW(),
  invited_by  UUID REFERENCES profiles(id),
  UNIQUE(clan_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_clan_members_user ON clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_clan ON clan_members(clan_id);

-- TABLE: clan_invitations
CREATE TABLE IF NOT EXISTS clan_invitations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clan_id          UUID NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  invited_user_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invited_by       UUID NOT NULL REFERENCES profiles(id),
  status           invitation_status DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  responded_at     TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invitations_pending
  ON clan_invitations(clan_id, invited_user_id)
  WHERE status = 'pending';

-- TABLE: bench_sessions (check-ins)
CREATE TABLE IF NOT EXISTS bench_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bench_id         VARCHAR(255) NOT NULL,
  user_id          UUID NOT NULL REFERENCES profiles(id),
  clan_id          UUID REFERENCES clans(id),
  checked_in_at    TIMESTAMPTZ DEFAULT NOW(),
  checked_out_at   TIMESTAMPTZ,
  duration_minutes INTEGER,
  points_awarded   INTEGER,
  lat_checkin      DOUBLE PRECISION,
  lng_checkin      DOUBLE PRECISION,
  is_auto_checkout BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_sessions_bench  ON bench_sessions(bench_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user   ON bench_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_clan   ON bench_sessions(clan_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON bench_sessions(bench_id) WHERE checked_out_at IS NULL;

-- VIEW: bench_clan_scores
CREATE OR REPLACE VIEW bench_clan_scores AS
SELECT
  bench_id,
  clan_id,
  SUM(points_awarded)  AS total_points,
  COUNT(*)             AS session_count,
  MAX(checked_in_at)   AS last_visit
FROM bench_sessions
WHERE clan_id IS NOT NULL
  AND points_awarded IS NOT NULL
GROUP BY bench_id, clan_id;

-- VIEW: bench_owners (clan #1 de chaque banc)
CREATE OR REPLACE VIEW bench_owners AS
SELECT DISTINCT ON (bench_id)
  bench_id,
  clan_id,
  total_points
FROM bench_clan_scores
ORDER BY bench_id, total_points DESC;

-- VIEW: clan_total_scores
CREATE OR REPLACE VIEW clan_total_scores AS
SELECT
  clan_id,
  SUM(total_points)         AS global_score,
  COUNT(DISTINCT bench_id)  AS benches_contributed
FROM bench_clan_scores
GROUP BY clan_id;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE clan_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bench_sessions ENABLE ROW LEVEL SECURITY;

-- CLANS : lisibles par tous
DROP POLICY IF EXISTS "clans_select" ON clans;
CREATE POLICY "clans_select" ON clans FOR SELECT USING (true);

DROP POLICY IF EXISTS "clans_update" ON clans;
CREATE POLICY "clans_update" ON clans FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM clan_members
    WHERE clan_id = clans.id AND user_id = auth.uid() AND role IN ('chef', 'sous_chef')
  ));

-- CLAN_MEMBERS
DROP POLICY IF EXISTS "members_select" ON clan_members;
CREATE POLICY "members_select" ON clan_members FOR SELECT USING (true);

-- CLAN_INVITATIONS
DROP POLICY IF EXISTS "invitations_select_own" ON clan_invitations;
CREATE POLICY "invitations_select_own" ON clan_invitations FOR SELECT
  USING (invited_user_id = auth.uid() OR invited_by = auth.uid());

-- BENCH_SESSIONS : propres sessions
DROP POLICY IF EXISTS "sessions_own" ON bench_sessions;
CREATE POLICY "sessions_own" ON bench_sessions FOR SELECT
  USING (user_id = auth.uid());

-- BENCH_SESSIONS : sessions actives visibles pour propriétaires du banc
DROP POLICY IF EXISTS "sessions_active_bench_owner" ON bench_sessions;
CREATE POLICY "sessions_active_bench_owner" ON bench_sessions FOR SELECT
  USING (
    checked_out_at IS NULL
    AND bench_id IN (
      SELECT bo.bench_id FROM bench_owners bo
      INNER JOIN clan_members cm ON cm.clan_id = bo.clan_id
      WHERE cm.user_id = auth.uid()
    )
  );

-- Activer Supabase Realtime sur bench_sessions
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE bench_sessions;
EXCEPTION WHEN others THEN NULL;
END $$;
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE clan_invitations;
EXCEPTION WHEN others THEN NULL;
END $$;
