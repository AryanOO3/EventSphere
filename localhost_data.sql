--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-09-28 21:34:32

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
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 236 (class 1259 OID 49189)
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: eventsphere_user
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer,
    activity_type character varying(50) NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.activity_logs OWNER TO eventsphere_user;

--
-- TOC entry 235 (class 1259 OID 49188)
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: eventsphere_user
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.activity_logs_id_seq OWNER TO eventsphere_user;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 235
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eventsphere_user
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- TOC entry 220 (class 1259 OID 24613)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24612)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 234 (class 1259 OID 40997)
-- Name: check_ins; Type: TABLE; Schema: public; Owner: eventsphere_user
--

CREATE TABLE public.check_ins (
    id integer NOT NULL,
    user_id integer,
    event_id integer,
    checked_in_by integer,
    checked_in_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.check_ins OWNER TO eventsphere_user;

--
-- TOC entry 233 (class 1259 OID 40996)
-- Name: check_ins_id_seq; Type: SEQUENCE; Schema: public; Owner: eventsphere_user
--

CREATE SEQUENCE public.check_ins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.check_ins_id_seq OWNER TO eventsphere_user;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 233
-- Name: check_ins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eventsphere_user
--

ALTER SEQUENCE public.check_ins_id_seq OWNED BY public.check_ins.id;


--
-- TOC entry 232 (class 1259 OID 32806)
-- Name: event_files; Type: TABLE; Schema: public; Owner: eventsphere_user
--

CREATE TABLE public.event_files (
    id integer NOT NULL,
    event_id integer,
    filename character varying(255) NOT NULL,
    original_name character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    file_type character varying(100),
    uploaded_by integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.event_files OWNER TO eventsphere_user;

--
-- TOC entry 231 (class 1259 OID 32805)
-- Name: event_files_id_seq; Type: SEQUENCE; Schema: public; Owner: eventsphere_user
--

CREATE SEQUENCE public.event_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_files_id_seq OWNER TO eventsphere_user;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 231
-- Name: event_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eventsphere_user
--

ALTER SEQUENCE public.event_files_id_seq OWNED BY public.event_files.id;


--
-- TOC entry 228 (class 1259 OID 24686)
-- Name: event_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_tags (
    id integer NOT NULL,
    event_id integer,
    tag_id integer
);


ALTER TABLE public.event_tags OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 24685)
-- Name: event_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_tags_id_seq OWNER TO postgres;

--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_tags_id_seq OWNED BY public.event_tags.id;


--
-- TOC entry 224 (class 1259 OID 24642)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    location character varying(255),
    date timestamp without time zone NOT NULL,
    organizer_id integer,
    category_id integer,
    is_published boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "time" time without time zone
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 24641)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 223
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 226 (class 1259 OID 24664)
-- Name: registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.registrations (
    id integer NOT NULL,
    user_id integer,
    event_id integer,
    status character varying(20) DEFAULT 'registered'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.registrations OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 24663)
-- Name: registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.registrations_id_seq OWNER TO postgres;

--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.registrations_id_seq OWNED BY public.registrations.id;


--
-- TOC entry 230 (class 1259 OID 24707)
-- Name: rsvps; Type: TABLE; Schema: public; Owner: eventsphere_user
--

CREATE TABLE public.rsvps (
    id integer NOT NULL,
    user_id integer,
    event_id integer,
    status character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rsvps_status_check CHECK (((status)::text = ANY ((ARRAY['yes'::character varying, 'no'::character varying])::text[])))
);


ALTER TABLE public.rsvps OWNER TO eventsphere_user;

--
-- TOC entry 229 (class 1259 OID 24706)
-- Name: rsvps_id_seq; Type: SEQUENCE; Schema: public; Owner: eventsphere_user
--

CREATE SEQUENCE public.rsvps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rsvps_id_seq OWNER TO eventsphere_user;

--
-- TOC entry 5005 (class 0 OID 0)
-- Dependencies: 229
-- Name: rsvps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: eventsphere_user
--

ALTER SEQUENCE public.rsvps_id_seq OWNED BY public.rsvps.id;


--
-- TOC entry 222 (class 1259 OID 24623)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24622)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- TOC entry 5007 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- TOC entry 218 (class 1259 OID 24594)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'user'::text,
    is_blocked boolean DEFAULT false,
    reset_token character varying(255),
    reset_token_expires timestamp without time zone,
    profile_picture character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24593)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5010 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4766 (class 2604 OID 49192)
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- TOC entry 4746 (class 2604 OID 24616)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4764 (class 2604 OID 41000)
-- Name: check_ins id; Type: DEFAULT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.check_ins ALTER COLUMN id SET DEFAULT nextval('public.check_ins_id_seq'::regclass);


--
-- TOC entry 4762 (class 2604 OID 32809)
-- Name: event_files id; Type: DEFAULT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.event_files ALTER COLUMN id SET DEFAULT nextval('public.event_files_id_seq'::regclass);


--
-- TOC entry 4758 (class 2604 OID 24689)
-- Name: event_tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags ALTER COLUMN id SET DEFAULT nextval('public.event_tags_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 24645)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 4754 (class 2604 OID 24667)
-- Name: registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations ALTER COLUMN id SET DEFAULT nextval('public.registrations_id_seq'::regclass);


--
-- TOC entry 4759 (class 2604 OID 24710)
-- Name: rsvps id; Type: DEFAULT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.rsvps ALTER COLUMN id SET DEFAULT nextval('public.rsvps_id_seq'::regclass);


--
-- TOC entry 4748 (class 2604 OID 24626)
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- TOC entry 4742 (class 2604 OID 24597)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4983 (class 0 OID 49189)
-- Dependencies: 236
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

COPY public.activity_logs (id, user_id, activity_type, description, created_at) FROM stdin;
1	10	category_deleted	Deleted category: Seminar	2025-09-27 16:53:11.452179
\.


--
-- TOC entry 4967 (class 0 OID 24613)
-- Dependencies: 220
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at) FROM stdin;
6	Workshop	2025-09-24 11:24:53.400183
\.


--
-- TOC entry 4981 (class 0 OID 40997)
-- Dependencies: 234
-- Data for Name: check_ins; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

COPY public.check_ins (id, user_id, event_id, checked_in_by, checked_in_at) FROM stdin;
6	12	8	10	2025-09-21 12:56:12.569259
7	10	8	10	2025-09-21 12:57:02.258823
8	10	11	10	2025-09-28 13:51:46.379829
\.


--
-- TOC entry 4979 (class 0 OID 32806)
-- Dependencies: 232
-- Data for Name: event_files; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

COPY public.event_files (id, event_id, filename, original_name, file_path, file_type, uploaded_by, created_at) FROM stdin;
8	8	cover_image-1758433512889-927803029.png	cover_image	/uploads/covers/cover_image-1758433512889-927803029.png	image/cover	10	2025-09-21 11:15:12.897557
23	10	cover_image-1758957167405-21724453.jpg	cover_image	/uploads/covers/cover_image-1758957167405-21724453.jpg	image/cover	10	2025-09-27 12:42:47.491336
24	11	cover_image-1758966573274-329034675.jpg	3240220_10.jpg	/uploads/covers/cover_image-1758966573274-329034675.jpg	image/cover	10	2025-09-27 15:19:33.33303
\.


--
-- TOC entry 4975 (class 0 OID 24686)
-- Dependencies: 228
-- Data for Name: event_tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_tags (id, event_id, tag_id) FROM stdin;
9	11	9
\.


--
-- TOC entry 4971 (class 0 OID 24642)
-- Dependencies: 224
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, title, description, location, date, organizer_id, category_id, is_published, created_at, updated_at, "time") FROM stdin;
10	test	test	test	2025-11-10 00:00:00	10	\N	t	2025-09-27 12:39:15.521092	2025-09-27 12:39:15.521092	\N
8	event	event	haria college jamnagar	2025-09-30 00:00:00	10	6	t	2025-09-21 11:07:16.148098	2025-09-24 13:35:27.113005	12:42:00
11	1	1	1	2025-10-01 00:00:00	10	6	t	2025-09-27 15:19:33.325745	2025-09-27 15:19:33.325745	\N
\.


--
-- TOC entry 4973 (class 0 OID 24664)
-- Dependencies: 226
-- Data for Name: registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.registrations (id, user_id, event_id, status, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4977 (class 0 OID 24707)
-- Dependencies: 230
-- Data for Name: rsvps; Type: TABLE DATA; Schema: public; Owner: eventsphere_user
--

COPY public.rsvps (id, user_id, event_id, status, created_at, updated_at) FROM stdin;
46	12	8	yes	2025-09-21 11:57:59.872643	2025-09-21 12:08:37.863312
71	10	8	yes	2025-09-21 12:56:47.410652	2025-09-21 12:56:47.410652
72	10	10	no	2025-09-27 12:42:57.856812	2025-09-27 12:45:09.22865
77	10	11	yes	2025-09-28 13:48:59.783389	2025-09-28 13:48:59.783389
\.


--
-- TOC entry 4969 (class 0 OID 24623)
-- Dependencies: 222
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, created_at) FROM stdin;
9	#trending	2025-09-24 11:25:09.113998
\.


--
-- TOC entry 4965 (class 0 OID 24594)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role, is_blocked, reset_token, reset_token_expires, profile_picture, created_at) FROM stdin;
13	Aryan	tankariyaaryan@gmail.com	$2b$10$rPKR./Gp8dZ6MHT9sviv8.K117VQL0bcmugXlIsW.cN01ROHiQ.ei	user	f	\N	\N	\N	2025-09-24 13:42:40.367046
12	User	user@eventsphere.com	$2b$10$kby/GJ5BDWBEJFo8zzaDHu8q.uHADFJB0Xh1cRzIFK/Yq0/XQp6nG	user	f	\N	\N	/uploads/profiles/profile-1759044984156-971572110.jpg	2025-09-21 10:21:41.592691
11	Admin	admin@eventsphere.com	$2b$10$XPkPV7DwxmrncilHPRny2uGDCJTxGLKvJtW2kg9cY5A9WRDOz5dvm	admin	f	\N	\N	/uploads/profiles/profile-1759045096887-490773833.jpeg	2025-09-21 10:21:41.592691
10	Super Admin	superadmin@eventsphere.com	$2b$10$lxuOR0IzO5g.GmUg0OiyHOZjsPrjZjwWD2H6wmw6Phpa00rb3gGJC	superadmin	f	\N	\N	/uploads/profiles/profile-1758430684724-82087180.png	2025-09-21 10:21:41.592691
\.


--
-- TOC entry 5012 (class 0 OID 0)
-- Dependencies: 235
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, true);


--
-- TOC entry 5013 (class 0 OID 0)
-- Dependencies: 219
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- TOC entry 5014 (class 0 OID 0)
-- Dependencies: 233
-- Name: check_ins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.check_ins_id_seq', 8, true);


--
-- TOC entry 5015 (class 0 OID 0)
-- Dependencies: 231
-- Name: event_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.event_files_id_seq', 24, true);


--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 227
-- Name: event_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_tags_id_seq', 9, true);


--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 223
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 11, true);


--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 225
-- Name: registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.registrations_id_seq', 1, false);


--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 229
-- Name: rsvps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: eventsphere_user
--

SELECT pg_catalog.setval('public.rsvps_id_seq', 77, true);


--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 221
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 9, true);


--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 13, true);


--
-- TOC entry 4802 (class 2606 OID 49197)
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 24621)
-- Name: categories categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_name_key UNIQUE (name);


--
-- TOC entry 4776 (class 2606 OID 24619)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4798 (class 2606 OID 41003)
-- Name: check_ins check_ins_pkey; Type: CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.check_ins
    ADD CONSTRAINT check_ins_pkey PRIMARY KEY (id);


--
-- TOC entry 4800 (class 2606 OID 41005)
-- Name: check_ins check_ins_user_id_event_id_key; Type: CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.check_ins
    ADD CONSTRAINT check_ins_user_id_event_id_key UNIQUE (user_id, event_id);


--
-- TOC entry 4796 (class 2606 OID 32814)
-- Name: event_files event_files_pkey; Type: CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_pkey PRIMARY KEY (id);


--
-- TOC entry 4788 (class 2606 OID 24693)
-- Name: event_tags event_tags_event_id_tag_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_event_id_tag_id_key UNIQUE (event_id, tag_id);


--
-- TOC entry 4790 (class 2606 OID 24691)
-- Name: event_tags event_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 24652)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 4784 (class 2606 OID 24672)
-- Name: registrations registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4786 (class 2606 OID 24674)
-- Name: registrations registrations_user_id_event_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_user_id_event_id_key UNIQUE (user_id, event_id);


--
-- TOC entry 4792 (class 2606 OID 24715)
-- Name: rsvps rsvps_pkey; Type: CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_pkey PRIMARY KEY (id);


--
-- TOC entry 4794 (class 2606 OID 24717)
-- Name: rsvps rsvps_user_id_event_id_key; Type: CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_user_id_event_id_key UNIQUE (user_id, event_id);


--
-- TOC entry 4778 (class 2606 OID 24631)
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- TOC entry 4780 (class 2606 OID 24629)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 4770 (class 2606 OID 24605)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4772 (class 2606 OID 24603)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4803 (class 1259 OID 49203)
-- Name: idx_activity_logs_created_at; Type: INDEX; Schema: public; Owner: eventsphere_user
--

CREATE INDEX idx_activity_logs_created_at ON public.activity_logs USING btree (created_at DESC);


--
-- TOC entry 4804 (class 1259 OID 49204)
-- Name: idx_activity_logs_user_id; Type: INDEX; Schema: public; Owner: eventsphere_user
--

CREATE INDEX idx_activity_logs_user_id ON public.activity_logs USING btree (user_id);


--
-- TOC entry 4818 (class 2606 OID 49198)
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4815 (class 2606 OID 41016)
-- Name: check_ins check_ins_checked_in_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.check_ins
    ADD CONSTRAINT check_ins_checked_in_by_fkey FOREIGN KEY (checked_in_by) REFERENCES public.users(id);


--
-- TOC entry 4816 (class 2606 OID 41011)
-- Name: check_ins check_ins_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.check_ins
    ADD CONSTRAINT check_ins_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4817 (class 2606 OID 41006)
-- Name: check_ins check_ins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.check_ins
    ADD CONSTRAINT check_ins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4813 (class 2606 OID 32815)
-- Name: event_files event_files_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4814 (class 2606 OID 32820)
-- Name: event_files event_files_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.event_files
    ADD CONSTRAINT event_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.users(id);


--
-- TOC entry 4809 (class 2606 OID 24694)
-- Name: event_tags event_tags_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4810 (class 2606 OID 24699)
-- Name: event_tags event_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_tags
    ADD CONSTRAINT event_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 4805 (class 2606 OID 24658)
-- Name: events events_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 4806 (class 2606 OID 24653)
-- Name: events events_organizer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id);


--
-- TOC entry 4807 (class 2606 OID 24680)
-- Name: registrations registrations_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- TOC entry 4808 (class 2606 OID 24675)
-- Name: registrations registrations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.registrations
    ADD CONSTRAINT registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 4811 (class 2606 OID 24723)
-- Name: rsvps rsvps_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;


--
-- TOC entry 4812 (class 2606 OID 24718)
-- Name: rsvps rsvps_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: eventsphere_user
--

ALTER TABLE ONLY public.rsvps
    ADD CONSTRAINT rsvps_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO eventsphere_user;


--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.categories TO eventsphere_user;


--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 219
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.categories_id_seq TO eventsphere_user;


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 228
-- Name: TABLE event_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.event_tags TO eventsphere_user;


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 227
-- Name: SEQUENCE event_tags_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.event_tags_id_seq TO eventsphere_user;


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE events; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.events TO eventsphere_user;


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 223
-- Name: SEQUENCE events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.events_id_seq TO eventsphere_user;


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 226
-- Name: TABLE registrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.registrations TO eventsphere_user;


--
-- TOC entry 5004 (class 0 OID 0)
-- Dependencies: 225
-- Name: SEQUENCE registrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.registrations_id_seq TO eventsphere_user;


--
-- TOC entry 5006 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tags TO eventsphere_user;


--
-- TOC entry 5008 (class 0 OID 0)
-- Dependencies: 221
-- Name: SEQUENCE tags_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tags_id_seq TO eventsphere_user;


--
-- TOC entry 5009 (class 0 OID 0)
-- Dependencies: 218
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.users TO eventsphere_user;


--
-- TOC entry 5011 (class 0 OID 0)
-- Dependencies: 217
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO eventsphere_user;


--
-- TOC entry 2090 (class 826 OID 24705)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO eventsphere_user;


--
-- TOC entry 2089 (class 826 OID 24704)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO eventsphere_user;


-- Completed on 2025-09-28 21:34:32

--
-- PostgreSQL database dump complete
--

