-- Clear Supabase Database
-- Run this in Supabase SQL Editor to clear all data and tables

-- Drop all tables in correct order (respecting foreign keys)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS check_ins CASCADE;
DROP TABLE IF EXISTS event_files CASCADE;
DROP TABLE IF EXISTS rsvps CASCADE;
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS event_tags CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop all indexes if they exist
DROP INDEX IF EXISTS idx_events_date;
DROP INDEX IF EXISTS idx_events_category;
DROP INDEX IF EXISTS idx_rsvps_event;
DROP INDEX IF EXISTS idx_rsvps_user;
DROP INDEX IF EXISTS idx_check_ins_event;
DROP INDEX IF EXISTS idx_event_tags_event;
DROP INDEX IF EXISTS idx_event_tags_tag;

-- Reset sequences (if they exist)
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;
DROP SEQUENCE IF EXISTS categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS tags_id_seq CASCADE;
DROP SEQUENCE IF EXISTS events_id_seq CASCADE;
DROP SEQUENCE IF EXISTS event_tags_id_seq CASCADE;
DROP SEQUENCE IF EXISTS registrations_id_seq CASCADE;
DROP SEQUENCE IF EXISTS rsvps_id_seq CASCADE;
DROP SEQUENCE IF EXISTS event_files_id_seq CASCADE;
DROP SEQUENCE IF EXISTS check_ins_id_seq CASCADE;
DROP SEQUENCE IF EXISTS activity_logs_id_seq CASCADE;