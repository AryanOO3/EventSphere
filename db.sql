--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-28 21:20:45

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

--
-- TOC entry 4962 (class 1262 OID 24577)
-- Name: eventsphere_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE eventsphere_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';


ALTER DATABASE eventsphere_db OWNER TO postgres;

\connect eventsphere_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = on;

--
-- TOC entry 4938 (class 0 OID 24594)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, name, email, password_hash, role, is_blocked, reset_token, reset_token_expires, profile_picture, created_at) VALUES (13, 'Aryan', 'tankariyaaryan@gmail.com', '$2b$10$rPKR./Gp8dZ6MHT9sviv8.K117VQL0bcmugXlIsW.cN01ROHiQ.ei', 'user', false, NULL, NULL, NULL, '2025-09-24 13:42:40.367046') ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, name, email, password_hash, role, is_blocked, reset_token, reset_token_expires, profile_picture, created_at) VALUES (12, 'User', 'user@eventsphere.com', '$2b$10$kby/GJ5BDWBEJFo8zzaDHu8q.uHADFJB0Xh1cRzIFK/Yq0/XQp6nG', 'user', false, NULL, NULL, '/uploads/profiles/profile-1759044984156-971572110.jpg', '2025-09-21 10:21:41.592691') ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, name, email, password_hash, role, is_blocked, reset_token, reset_token_expires, profile_picture, created_at) VALUES (11, 'Admin', 'admin@eventsphere.com', '$2b$10$XPkPV7DwxmrncilHPRny2uGDCJTxGLKvJtW2kg9cY5A9WRDOz5dvm', 'admin', false, NULL, NULL, '/uploads/profiles/profile-1759045096887-490773833.jpeg', '2025-09-21 10:21:41.592691') ON CONFLICT DO NOTHING;
INSERT INTO public.users (id, name, email, password_hash, role, is_blocked, reset_token, reset_token_expires, profile_picture, created_at) VALUES (10, 'Super Admin', 'superadmin@eventsphere.com', '$2b$10$lxuOR0IzO5g.GmUg0OiyHOZjsPrjZjwWD2H6wmw6Phpa00rb3gGJC', 'superadmin', false, NULL, NULL, '/uploads/profiles/profile-1758430684724-82087180.png', '2025-09-21 10:21:41.592691') ON CONFLICT DO NOTHING;


--
-- TOC entry 4956 (class 0 OID 49189)
-- Dependencies: 236
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

INSERT INTO public.activity_logs (id, user_id, activity_type, description, created_at) VALUES (1, 10, 'category_deleted', 'Deleted category: Seminar', '2025-09-27 16:53:11.452179') ON CONFLICT DO NOTHING;


--
-- TOC entry 4940 (class 0 OID 24613)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (id, name, created_at) VALUES (6, 'Workshop', '2025-09-24 11:24:53.400183') ON CONFLICT DO NOTHING;


--
-- TOC entry 4944 (class 0 OID 24642)
-- Dependencies: 224
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events (id, title, description, location, date, organizer_id, category_id, is_published, created_at, updated_at, "time") VALUES (10, 'test', 'test', 'test', '2025-11-10 00:00:00', 10, NULL, true, '2025-09-27 12:39:15.521092', '2025-09-27 12:39:15.521092', NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.events (id, title, description, location, date, organizer_id, category_id, is_published, created_at, updated_at, "time") VALUES (8, 'event', 'event', 'haria college jamnagar', '2025-09-30 00:00:00', 10, 6, true, '2025-09-21 11:07:16.148098', '2025-09-24 13:35:27.113005', '12:42:00') ON CONFLICT DO NOTHING;
INSERT INTO public.events (id, title, description, location, date, organizer_id, category_id, is_published, created_at, updated_at, "time") VALUES (11, '1', '1', '1', '2025-10-01 00:00:00', 10, 6, true, '2025-09-27 15:19:33.325745', '2025-09-27 15:19:33.325745', NULL) ON CONFLICT DO NOTHING;


--
-- TOC entry 4954 (class 0 OID 40997)
-- Dependencies: 234
-- Data for Name: check_ins; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

INSERT INTO public.check_ins (id, user_id, event_id, checked_in_by, checked_in_at) VALUES (6, 12, 8, 10, '2025-09-21 12:56:12.569259') ON CONFLICT DO NOTHING;
INSERT INTO public.check_ins (id, user_id, event_id, checked_in_by, checked_in_at) VALUES (7, 10, 8, 10, '2025-09-21 12:57:02.258823') ON CONFLICT DO NOTHING;
INSERT INTO public.check_ins (id, user_id, event_id, checked_in_by, checked_in_at) VALUES (8, 10, 11, 10, '2025-09-28 13:51:46.379829') ON CONFLICT DO NOTHING;


--
-- TOC entry 4952 (class 0 OID 32806)
-- Dependencies: 232
-- Data for Name: event_files; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

INSERT INTO public.event_files (id, event_id, filename, original_name, file_path, file_type, uploaded_by, created_at) VALUES (8, 8, 'cover_image-1758433512889-927803029.png', 'cover_image', '/uploads/covers/cover_image-1758433512889-927803029.png', 'image/cover', 10, '2025-09-21 11:15:12.897557') ON CONFLICT DO NOTHING;
INSERT INTO public.event_files (id, event_id, filename, original_name, file_path, file_type, uploaded_by, created_at) VALUES (23, 10, 'cover_image-1758957167405-21724453.jpg', 'cover_image', '/uploads/covers/cover_image-1758957167405-21724453.jpg', 'image/cover', 10, '2025-09-27 12:42:47.491336') ON CONFLICT DO NOTHING;
INSERT INTO public.event_files (id, event_id, filename, original_name, file_path, file_type, uploaded_by, created_at) VALUES (24, 11, 'cover_image-1758966573274-329034675.jpg', '3240220_10.jpg', '/uploads/covers/cover_image-1758966573274-329034675.jpg', 'image/cover', 10, '2025-09-27 15:19:33.33303') ON CONFLICT DO NOTHING;


--
-- TOC entry 4942 (class 0 OID 24623)
-- Dependencies: 222
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags (id, name, created_at) VALUES (9, '#trending', '2025-09-24 11:25:09.113998') ON CONFLICT DO NOTHING;


--
-- TOC entry 4948 (class 0 OID 24686)
-- Dependencies: 228
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_tags (id, event_id, tag_id) VALUES (9, 11, 9) ON CONFLICT DO NOTHING;


--
-- TOC entry 4946 (class 0 OID 24664)
-- Dependencies: 226
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4950 (class 0 OID 24707)
-- Dependencies: 230
-- Data for Name: rsvps; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

INSERT INTO public.rsvps (id, user_id, event_id, status, created_at, updated_at) VALUES (46, 12, 8, 'yes', '2025-09-21 11:57:59.872643', '2025-09-21 12:08:37.863312') ON CONFLICT DO NOTHING;
INSERT INTO public.rsvps (id, user_id, event_id, status, created_at, updated_at) VALUES (71, 10, 8, 'yes', '2025-09-21 12:56:47.410652', '2025-09-21 12:56:47.410652') ON CONFLICT DO NOTHING;
INSERT INTO public.rsvps (id, user_id, event_id, status, created_at, updated_at) VALUES (72, 10, 10, 'no', '2025-09-27 12:42:57.856812', '2025-09-27 12:45:09.22865') ON CONFLICT DO NOTHING;
INSERT INTO public.rsvps (id, user_id, event_id, status, created_at, updated_at) VALUES (77, 10, 11, 'yes', '2025-09-28 13:48:59.783389', '2025-09-28 13:48:59.783389') ON CONFLICT DO NOTHING;


--
-- TOC entry 4963 (class 0 OID 0)
-- Dependencies: 235
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, true);


--
-- TOC entry 4964 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- TOC entry 4965 (class 0 OID 0)
-- Dependencies: 233
-- Name: check_ins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.check_ins_id_seq', 8, true);


--
-- TOC entry 4966 (class 0 OID 0)
-- Dependencies: 231
-- Name: event_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.event_files_id_seq', 24, true);


--
-- TOC entry 4967 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_tags_id_seq', 9, true);


--
-- TOC entry 4968 (class 0 OID 0)
-- Dependencies: 223
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 11, true);


--
-- TOC entry 4969 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 1, false);


--
-- TOC entry 4970 (class 0 OID 0)
-- Dependencies: 229
-- Name: rsvps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.rsvps_id_seq', 77, true);


--
-- TOC entry 4971 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 9, true);


--
-- TOC entry 4972 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


-- Completed on 2025-09-28 21:20:45

--
-- PostgreSQL database dump complete
--

