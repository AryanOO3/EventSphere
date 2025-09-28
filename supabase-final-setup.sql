-- Final Supabase Setup - Exact localhost schema match
-- Run this in Supabase SQL Editor after clearing database

-- Users table with correct column names
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    is_blocked BOOLEAN DEFAULT false,
    reset_token VARCHAR(255),
    reset_token_expires TIMESTAMP,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Other tables
CREATE TABLE public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    date TIMESTAMP NOT NULL,
    organizer_id INTEGER REFERENCES users(id),
    category_id INTEGER REFERENCES categories(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    time TIME
);

CREATE TABLE public.event_tags (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(event_id, tag_id)
);

CREATE TABLE public.registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'registered',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE public.rsvps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(10) NOT NULL CHECK (status IN ('yes', 'no')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE public.event_files (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.check_ins (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    checked_in_by INTEGER REFERENCES users(id),
    checked_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

CREATE TABLE public.activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert localhost data
INSERT INTO users (id, name, email, password_hash, role, is_blocked, reset_token, reset_token_expires, profile_picture, created_at) VALUES
(13, 'Aryan', 'tankariyaaryan@gmail.com', '$2b$10$rPKR./Gp8dZ6MHT9sviv8.K117VQL0bcmugXlIsW.cN01ROHiQ.ei', 'user', false, NULL, NULL, NULL, '2025-09-24 13:42:40.367046'),
(12, 'User', 'user@eventsphere.com', '$2b$10$kby/GJ5BDWBEJFo8zzaDHu8q.uHADFJB0Xh1cRzIFK/Yq0/XQp6nG', 'user', false, NULL, NULL, '/uploads/profiles/profile-1759044984156-971572110.jpg', '2025-09-21 10:21:41.592691'),
(11, 'Admin', 'admin@eventsphere.com', '$2b$10$XPkPV7DwxmrncilHPRny2uGDCJTxGLKvJtW2kg9cY5A9WRDOz5dvm', 'admin', false, NULL, NULL, '/uploads/profiles/profile-1759045096887-490773833.jpeg', '2025-09-21 10:21:41.592691'),
(10, 'Super Admin', 'superadmin@eventsphere.com', '$2b$10$lxuOR0IzO5g.GmUg0OiyHOZjsPrjZjwWD2H6wmw6Phpa00rb3gGJC', 'superadmin', false, NULL, NULL, '/uploads/profiles/profile-1758430684724-82087180.png', '2025-09-21 10:21:41.592691');

INSERT INTO categories (id, name, created_at) VALUES
(6, 'Workshop', '2025-09-24 11:24:53.400183');

INSERT INTO tags (id, name, created_at) VALUES
(9, '#trending', '2025-09-24 11:25:09.113998');

INSERT INTO events (id, title, description, location, date, organizer_id, category_id, is_published, created_at, updated_at, time) VALUES
(10, 'test', 'test', 'test', '2025-11-10 00:00:00', 10, NULL, true, '2025-09-27 12:39:15.521092', '2025-09-27 12:39:15.521092', NULL),
(8, 'event', 'event', 'haria college jamnagar', '2025-09-30 00:00:00', 10, 6, true, '2025-09-21 11:07:16.148098', '2025-09-24 13:35:27.113005', '12:42:00'),
(11, '1', '1', '1', '2025-10-01 00:00:00', 10, 6, true, '2025-09-27 15:19:33.325745', '2025-09-27 15:19:33.325745', NULL);

INSERT INTO event_tags (id, event_id, tag_id) VALUES
(9, 11, 9);

INSERT INTO rsvps (id, user_id, event_id, status, created_at, updated_at) VALUES
(46, 12, 8, 'yes', '2025-09-21 11:57:59.872643', '2025-09-21 12:08:37.863312'),
(71, 10, 8, 'yes', '2025-09-21 12:56:47.410652', '2025-09-21 12:56:47.410652'),
(72, 10, 10, 'no', '2025-09-27 12:42:57.856812', '2025-09-27 12:45:09.22865'),
(77, 10, 11, 'yes', '2025-09-28 13:48:59.783389', '2025-09-28 13:48:59.783389');

INSERT INTO check_ins (id, user_id, event_id, checked_in_by, checked_in_at) VALUES
(6, 12, 8, 10, '2025-09-21 12:56:12.569259'),
(7, 10, 8, 10, '2025-09-21 12:57:02.258823'),
(8, 10, 11, 10, '2025-09-28 13:51:46.379829');

INSERT INTO event_files (id, event_id, filename, original_name, file_path, file_type, uploaded_by, created_at) VALUES
(8, 8, 'cover_image-1758433512889-927803029.png', 'cover_image', '/uploads/covers/cover_image-1758433512889-927803029.png', 'image/cover', 10, '2025-09-21 11:15:12.897557'),
(23, 10, 'cover_image-1758957167405-21724453.jpg', 'cover_image', '/uploads/covers/cover_image-1758957167405-21724453.jpg', 'image/cover', 10, '2025-09-27 12:42:47.491336'),
(24, 11, 'cover_image-1758966573274-329034675.jpg', '3240220_10.jpg', '/uploads/covers/cover_image-1758966573274-329034675.jpg', 'image/cover', 10, '2025-09-27 15:19:33.33303');

INSERT INTO activity_logs (id, user_id, activity_type, description, created_at) VALUES
(1, 10, 'category_deleted', 'Deleted category: Seminar', '2025-09-27 16:53:11.452179');

-- Set sequences
SELECT setval('users_id_seq', 13, true);
SELECT setval('categories_id_seq', 8, true);
SELECT setval('tags_id_seq', 9, true);
SELECT setval('events_id_seq', 11, true);
SELECT setval('event_tags_id_seq', 9, true);
SELECT setval('registrations_id_seq', 1, false);
SELECT setval('rsvps_id_seq', 77, true);
SELECT setval('event_files_id_seq', 24, true);
SELECT setval('check_ins_id_seq', 8, true);
SELECT setval('activity_logs_id_seq', 1, true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user ON rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_event ON check_ins(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tags_event ON event_tags(event_id);
CREATE INDEX IF NOT EXISTS idx_event_tags_tag ON event_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);