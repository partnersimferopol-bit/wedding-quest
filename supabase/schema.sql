-- Supabase schema for Wedding Quest

CREATE TABLE weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date TIMESTAMPTZ NOT NULL,
  wedding_time TEXT NOT NULL,
  address TEXT NOT NULL,
  venue_description TEXT,
  coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}',
  organizer_contacts TEXT,
  cover_image TEXT,
  theme TEXT DEFAULT 'pirates',
  video_url TEXT,
  show_countdown BOOLEAN DEFAULT true,
  countdown_hidden_after_date BOOLEAN DEFAULT true,
  dress_code JSONB,
  wish_list JSONB,
  telegram_bot_token TEXT,
  telegram_chat_ids TEXT[],
  organizer_email TEXT,
  couple_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  "order" INT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  story TEXT,
  image TEXT,
  photos TEXT[] DEFAULT '{}',
  mini_game_type TEXT NOT NULL,
  hint TEXT,
  map_x FLOAT NOT NULL,
  map_y FLOAT NOT NULL,
  quiz JSONB,
  puzzle_size INT,
  puzzle_image TEXT,
  matching_facts JSONB,
  code_word TEXT,
  code_hint TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  category TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE story_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  photos TEXT[] DEFAULT '{}',
  video_url TEXT,
  "order" INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  attending BOOLEAN NOT NULL,
  guest_count INT DEFAULT 1,
  comment TEXT,
  has_children BOOLEAN DEFAULT false,
  children_count INT DEFAULT 0,
  needs_transfer BOOLEAN DEFAULT false,
  needs_parking BOOLEAN DEFAULT false,
  menu_preference TEXT DEFAULT 'none',
  staying_until_end BOOLEAN DEFAULT true,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Storage buckets: weddings/{wedding-id}/cover, story, date, proposal, gallery, video

CREATE INDEX idx_weddings_slug ON weddings(slug);
CREATE INDEX idx_locations_wedding ON locations(wedding_id);
CREATE INDEX idx_rsvp_wedding ON rsvp_responses(wedding_id);
