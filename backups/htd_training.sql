--
-- PostgreSQL database dump
--

\restrict wVyOoK2uAFchNVAWTYxRMZXVUVH9o42owzkpCb6zwwZb3laHED0ZdreQrLwz9gu

-- Dumped from database version 18.3 (Postgres.app)
-- Dumped by pg_dump version 18.3

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

--
-- Name: AuthRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."AuthRole" AS ENUM (
    'super_admin',
    'trainer',
    'trainee'
);


--
-- Name: TraineePlanProgressStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TraineePlanProgressStatus" AS ENUM (
    'not_started',
    'in_progress',
    'paused',
    'completed'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ClientMaster; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ClientMaster" (
    id text NOT NULL,
    name text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Exercise; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Exercise" (
    id text NOT NULL,
    name text NOT NULL,
    details text,
    "order" integer NOT NULL,
    "trainingPlanId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TraineePlanProgress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TraineePlanProgress" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "trainingPlanId" text NOT NULL,
    status public."TraineePlanProgressStatus" DEFAULT 'not_started'::public."TraineePlanProgressStatus" NOT NULL,
    "highestCompletedOrder" integer DEFAULT '-1'::integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedEntryIds" text[] DEFAULT ARRAY[]::text[] NOT NULL
);


--
-- Name: TrainingPlan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TrainingPlan" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "isDraft" boolean DEFAULT false NOT NULL,
    "clientMasterId" text NOT NULL,
    "traineeUserId" text
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    "passwordHash" text,
    role public."AuthRole" DEFAULT 'trainee'::public."AuthRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "mappedMasterClientId" text
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: ClientMaster; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ClientMaster" (id, name, "createdAt", "updatedAt") FROM stdin;
cm_seed_avaya	Avaya	2026-05-02 08:38:06.049	2026-05-02 08:38:06.049
cm_seed_nokia	Tawrid	2026-05-02 08:38:06.049	2026-05-03 22:55:35.142
\.


--
-- Data for Name: Exercise; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Exercise" (id, name, details, "order", "trainingPlanId", "createdAt", "updatedAt") FROM stdin;
cmopy8h1l0029vegaz5pn2yjw	blkid, lsblk, findmnt, and persistent mounts via /etc/fstab (UUID vs. labels)	{"entryId":"st:int-storage:0","contentId":"d88c2d5b-dc0c-4ba7-9542-c29b9e702444","subtitle":"Under: Storage & filesystems (advanced)","sectionHeader":"LINUX › Intermediate"}	0	cmop02cet0001ves44lygdhtc	2026-05-03 15:52:22.857	2026-05-03 15:52:22.857
cmopy8h1l002avegapb56r7ot	File-system types: ext4, XFS — mkfs, fsck, and mount options (noatime, quotas intro)	{"entryId":"st:int-storage:1","contentId":"f748d116-8cf3-4c84-92b7-3e1a5e7eda3c","subtitle":"Under: Storage & filesystems (advanced)","sectionHeader":"LINUX › Intermediate"}	1	cmop02cet0001ves44lygdhtc	2026-05-03 15:52:22.857	2026-05-03 15:52:22.857
cmopy8h1l002bvegamafgrhuq	LVM: physical volumes, volume groups, logical volumes; extend/reduce workflows	{"entryId":"st:int-storage:2","contentId":"950d4cb8-db18-40d2-a884-f5be80307675","subtitle":"Under: Storage & filesystems (advanced)","sectionHeader":"LINUX › Intermediate"}	2	cmop02cet0001ves44lygdhtc	2026-05-03 15:52:22.857	2026-05-03 15:52:22.857
cmopy8h1l002cvegaft796jym	Stratis & VDO awareness; swap: files vs. partitions; troubleshooting full disks	{"entryId":"st:int-storage:3","contentId":"1a580065-d611-4ab0-a2a0-8409cf7bf6e4","subtitle":"Under: Storage & filesystems (advanced)","sectionHeader":"LINUX › Intermediate"}	3	cmop02cet0001ves44lygdhtc	2026-05-03 15:52:22.857	2026-05-03 15:52:22.857
cmoqe5fcy0002ves430onlptl	Avaya AOC overview & architecture	{"entryId":"aoc-overview","contentId":"4e1e7289-f4c5-4ee9-b1ea-fd7beb51527d","subtitle":"4 sub-topics: Role of AOC in the Avaya enterprise stack …","sectionHeader":"Avaya AOC"}	0	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
cmoqe5fcy0003ves44bbd95pq	Console access & navigation	{"entryId":"aoc-console","contentId":"fe80d220-ea98-4bd8-8178-9bcf85fc31b0","subtitle":"4 sub-topics: Login, session management, and supported browsers …","sectionHeader":"Avaya AOC"}	1	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
cmoqe5fcy0004ves4vdv4n650	Directory, users & groups	{"entryId":"aoc-directory","contentId":"0397e9ad-015f-426d-93d0-8ca8b74670e0","subtitle":"4 sub-topics: User lifecycle: create, modify, disable, and templates …","sectionHeader":"Avaya AOC"}	2	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
cmoqe5fcy0005ves48qyc7f48	Messaging & collaboration policies	{"entryId":"aoc-messaging","contentId":"51defa5e-5fdf-4d50-b298-bf54adb55773","subtitle":"4 sub-topics: Spaces, channels, and retention policies …","sectionHeader":"Avaya AOC"}	3	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
cmoqe5fcy0006ves4rj1mqn3u	Integrations & APIs	{"entryId":"aoc-integrations","contentId":"ab1f7636-9a44-46ea-b9d1-5854d87017c3","subtitle":"4 sub-topics: Webhooks, event subscriptions, and rate limits …","sectionHeader":"Avaya AOC"}	4	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
cmoqe5fcy0007ves4okh09wur	Operations, monitoring & backup	{"entryId":"aoc-ops","contentId":"50c76339-0787-42e7-8f26-fcbf326341e3","subtitle":"4 sub-topics: Health indicators, alerts, and escalation paths …","sectionHeader":"Avaya AOC"}	5	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
cmoqe5fcy0008ves45st7d690	Troubleshooting & support handoff	{"entryId":"aoc-troubleshoot","contentId":"196a82b7-2282-4d25-93a0-95f03f62f827","subtitle":"4 sub-topics: Top failure modes and first-response checks …","sectionHeader":"Avaya AOC"}	6	cmoqe5fct0001ves48bw89ldj	2026-05-03 23:17:54.562	2026-05-03 23:17:54.562
\.


--
-- Data for Name: TraineePlanProgress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TraineePlanProgress" (id, "userId", "trainingPlanId", status, "highestCompletedOrder", "createdAt", "updatedAt", "completedEntryIds") FROM stdin;
cmop18ul90001ve8jlottbnip	cmonc26m30002ve5x2xdp3eff	cmop02cet0001ves44lygdhtc	in_progress	-1	2026-05-03 00:28:53.086	2026-05-03 16:11:11.774	{}
cmoqectfs000aves49esc7r19	cmoozrmz60004vet8vvx8wby9	cmoqe5fct0001ves48bw89ldj	in_progress	-1	2026-05-03 23:23:39.4	2026-05-04 18:19:22.978	{__trainee_study__:__cid:4e1e7289-f4c5-4ee9-b1ea-fd7beb51527d}
\.


--
-- Data for Name: TrainingPlan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TrainingPlan" (id, title, description, "createdAt", "updatedAt", "isDraft", "clientMasterId", "traineeUserId") FROM stdin;
cmop02cet0001ves44lygdhtc	Linux Intermediate A	\N	2026-05-02 23:55:49.973	2026-05-03 15:52:22.857	f	cm_seed_avaya	cmonc26m30002ve5x2xdp3eff
cmoqe5fct0001ves48bw89ldj	Avaya AOC A	\N	2026-05-03 23:17:54.557	2026-05-03 23:17:54.557	f	cm_seed_avaya	cmoozrmz60004vet8vvx8wby9
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, name, "passwordHash", role, "createdAt", "updatedAt", "mappedMasterClientId") FROM stdin;
cmond9a030000ve5nl8l9om5j	avayatrainer@training.local	Trainer	$2b$12$Ml5DHCW7bhjDjbwVmUJ/RuWiy8GicDrTBbmL3O3KGhz2YNUyPG/pq	trainer	2026-05-01 20:29:36.1	2026-05-02 14:43:45.268	cm_seed_avaya
cmonc26m30002ve5x2xdp3eff	avayatrainee@training.local	Avaya	$2b$12$DYQzMgmPc7CczWMKoUs.aOiXos6ynNV0gF01g0xek71hVHuMqtsaG	trainee	2026-05-01 19:56:05.499	2026-05-02 15:01:35.292	cm_seed_avaya
cmonc26m20001ve5xu4x3x040	tawridtrainer@training.local	Trainer	$2b$12$oICyVvfOmfdGqQZBd.q/ouB3onw1ZjImF0yr02CJfM3PXwZlnDMVq	trainer	2026-05-01 19:56:05.499	2026-05-03 23:15:28.917	cm_seed_nokia
cmon8c63e0003vepxk1p7dm7j	tawridtrainee@training.local	Tawrid	$2b$12$9rkouioAr1mLs3/L5Og67ew/nt2eRq74E8w.PseFwClW9fiok/QqG	trainee	2026-05-01 18:11:52.922	2026-05-03 23:15:54.284	cm_seed_nokia
cmomz3bfp0000venys3wf4pxw	satyamevk@infinite.com	Satyam EVK	$2b$12$d3nPOyc7rZCSU5DXmVTKH.dCk45Z7Yn6GZITC3kNdDE8Qq03E/cy2	super_admin	2026-05-01 13:53:03.397	2026-06-03 15:42:34.072	\N
cmoozrmz50003vet8psf9va50	trainer@training.local	Trainer	$2b$12$d3nPOyc7rZCSU5DXmVTKH.dCk45Z7Yn6GZITC3kNdDE8Qq03E/cy2	trainer	2026-05-02 23:47:30.45	2026-06-03 15:42:34.086	cm_seed_avaya
cmoozrmz60004vet8vvx8wby9	avaya@training.local	Avaya	$2b$12$d3nPOyc7rZCSU5DXmVTKH.dCk45Z7Yn6GZITC3kNdDE8Qq03E/cy2	trainee	2026-05-02 23:47:30.45	2026-06-03 15:42:34.087	cm_seed_avaya
cmoozrmz60005vet8hlorlegt	tawrid@training.local	Tawrid	$2b$12$d3nPOyc7rZCSU5DXmVTKH.dCk45Z7Yn6GZITC3kNdDE8Qq03E/cy2	trainee	2026-05-02 23:47:30.451	2026-06-03 15:42:34.087	cm_seed_nokia
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
32e1e74f-f25f-4c56-886c-c139eee3a173	af5d8ded01ddb6e18636b2c6446be69024d64b9d604ce9c440bacf1ece198409	\N	20260502130000_client_master_table	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260502130000_client_master_table\n\nDatabase error code: 42P01\n\nDatabase error:\nERROR: invalid reference to FROM-clause entry for table "u"\nDETAIL: There is an entry for table "u", but it cannot be referenced from this part of the query.\n\nPosition:\n[1m 22[0m\n[1m 23[0m -- Backfill from former self-referential mapped client (match Avaya/Nokia portal users by name)\n[1m 24[0m UPDATE "User" AS u\n[1m 25[0m SET "mappedMasterClientId" = cm."id"\n[1m 26[0m FROM "ClientMaster" AS cm\n[1m 27[1;31m INNER JOIN "User" AS mu ON mu."id" = u."mappedClientId"[0m\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42P01), message: "invalid reference to FROM-clause entry for table \\"u\\"", detail: Some("There is an entry for table \\"u\\", but it cannot be referenced from this part of the query."), hint: None, position: Some(Original(910)), where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("parse_relation.c"), line: Some(3754), routine: Some("errorMissingRTE") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260502130000_client_master_table"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260502130000_client_master_table"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2026-05-02 08:38:05.498235-04	2026-05-02 08:37:36.003009-04	0
bad431ee-1bc2-48e4-9852-76f721965d28	e428fddfdd01dd36e8370e75fb39e91338bf46a2e92f66415b8a976a48e61d6f	2026-05-01 09:53:02.631553-04	20250501133000_init_schema	\N	\N	2026-05-01 09:53:02.626839-04	1
78317000-9060-4b9a-98ef-1638bc6c1e5f	e9cc28539f0fa6bddd9efaf0a1406e9eaa7529413b7056e02ed8b425ae962eed	\N	20250501162000_remove_admin_role	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250501162000_remove_admin_role\n\nDatabase error code: 42804\n\nDatabase error:\nERROR: default for column "role" cannot be cast automatically to type "AuthRole_new"\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42804), message: "default for column \\"role\\" cannot be cast automatically to type \\"AuthRole_new\\"", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(14826), routine: Some("ATExecAlterColumnType") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250501162000_remove_admin_role"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20250501162000_remove_admin_role"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2026-05-01 11:00:44.76673-04	2026-05-01 11:00:13.92426-04	0
2278f4c0-b9ea-4667-8318-9d041b12bacc	ac5d0867e86d59fd3c151e31517931d34907b623c9b969eb69b83c17d11499d6	2026-05-01 11:00:45.358844-04	20250501162000_remove_admin_role	\N	\N	2026-05-01 11:00:45.337276-04	1
40dbc279-bb61-4f95-8f07-02a63d483d8f	14b9e9e74567b60e069ca66a1eb089874ed3709818f2bae38b8381865786949e	2026-05-02 08:38:06.062578-04	20260502130000_client_master_table	\N	\N	2026-05-02 08:38:06.048138-04	1
d3c8503f-d0ae-42c8-9efe-7d7bfbcfe4e9	1ae1c50fa31cbd0847b14082f9010a595674dbc541101574492f173d17bcbbc7	2026-05-01 15:04:07.421083-04	20260201130000_training_plan_is_draft	\N	\N	2026-05-01 15:04:07.417053-04	1
f0d45aff-4829-481d-b533-af46da589458	b1e9a8945e7ae46a0226abcd19d624e44539352dbb8d38715d0672a133d80890	2026-05-01 15:29:05.871295-04	20260201140000_user_mapped_client	\N	\N	2026-05-01 15:29:05.867647-04	1
dfbf9eff-3fce-492d-b435-12f541e1b685	d1b5fa4e36c26d1c424132d0cdd9146acf9e8ff0fca4f8915a6b9c597aa6cb55	2026-05-02 08:44:23.996132-04	20260502160000_auth_role_trainee	\N	\N	2026-05-02 08:44:23.978486-04	1
96f81516-f0fd-4e37-ada2-f65ff99bab47	ef51cfed0a686018a3bfc0976050e2720086dd1baff443cc1439cab858bef3d0	2026-05-02 08:40:06.126039-04	20260502150000_training_plan_client_master_fk	\N	\N	2026-05-02 08:40:06.121907-04	1
385639fa-399d-467e-b664-90c6c5efbb33	ad321fb2f74c3ab2bbe7e28d69dc05e457f4f0be4ab29849b2f729d36f344148	2026-05-03 12:40:35.623078-04	20260504120000_merge_study_into_completed_entry_ids	\N	\N	2026-05-03 12:40:35.530375-04	1
73096078-b116-46c5-968a-bb27d4a95022	b17991d1130ce4a70438a9c60ea7197baafd7f9a6fcc2af9bfb7494677a3f395	2026-05-02 12:13:43.64177-04	20260503120000_training_plan_trainee_user	\N	\N	2026-05-02 12:13:43.617686-04	1
03cbff44-9aa8-4c17-bf57-67ec6fc2b708	054e1f1cffa45196de8fcfab64182b3795ac826236fd99ac65be4f0eb85ab1f7	2026-05-02 20:20:25.263309-04	20260504100000_trainee_plan_progress	\N	\N	2026-05-02 20:20:25.226826-04	1
cbec0b53-a1db-4717-a4b8-7610dac2cc42	1394a715a649a9ad8aff96e61f2d22f1caaa3701d64284327ff09699228286a1	2026-05-03 11:11:28.146399-04	20260503180000_trainee_completed_entry_ids	\N	\N	2026-05-03 11:11:28.121035-04	1
1f2674c7-be4b-4d70-a10a-ae389b13d9d2	9b1371d5bb5b25fdcaa32946bbd1722596e639ce02be1e4cfcbc1fd412cb3753	2026-05-03 19:05:17.527748-04	20260504130000_remap_nokia_trainers_trainees_to_tawrid	\N	\N	2026-05-03 19:05:17.449304-04	1
2dfb4d2b-0177-4d75-ac04-da423dbfa1f3	d82567e2c97a8c3df2c2b4bcca193529d2e2d5a17dda9bfe1a103a0d07e01806	2026-05-03 12:40:35.53016-04	20260504110000_studied_entry_ids	\N	\N	2026-05-03 12:40:35.509319-04	1
83aba5a1-c611-4e9f-8103-a40fde0e36f6	1394a715a649a9ad8aff96e61f2d22f1caaa3701d64284327ff09699228286a1	\N	20260504101500_trainee_completed_entry_ids	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260504101500_trainee_completed_entry_ids\n\nDatabase error code: 42701\n\nDatabase error:\nERROR: column "completedEntryIds" of relation "TraineePlanProgress" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42701), message: "column \\"completedEntryIds\\" of relation \\"TraineePlanProgress\\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("tablecmds.c"), line: Some(7689), routine: Some("check_for_column_name_collision") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260504101500_trainee_completed_entry_ids"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260504101500_trainee_completed_entry_ids"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:260	2026-05-04 20:41:35.00192-04	2026-05-04 20:41:28.490328-04	0
85afe0ff-6801-461c-907c-c02808a22cbe	1394a715a649a9ad8aff96e61f2d22f1caaa3701d64284327ff09699228286a1	2026-05-04 20:41:35.002582-04	20260504101500_trainee_completed_entry_ids		\N	2026-05-04 20:41:35.002582-04	0
\.


--
-- Name: ClientMaster ClientMaster_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ClientMaster"
    ADD CONSTRAINT "ClientMaster_pkey" PRIMARY KEY (id);


--
-- Name: Exercise Exercise_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_pkey" PRIMARY KEY (id);


--
-- Name: TraineePlanProgress TraineePlanProgress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TraineePlanProgress"
    ADD CONSTRAINT "TraineePlanProgress_pkey" PRIMARY KEY (id);


--
-- Name: TrainingPlan TrainingPlan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingPlan"
    ADD CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: ClientMaster_name_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "ClientMaster_name_key" ON public."ClientMaster" USING btree (name);


--
-- Name: TraineePlanProgress_userId_trainingPlanId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TraineePlanProgress_userId_trainingPlanId_key" ON public."TraineePlanProgress" USING btree ("userId", "trainingPlanId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Exercise Exercise_trainingPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Exercise"
    ADD CONSTRAINT "Exercise_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES public."TrainingPlan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TraineePlanProgress TraineePlanProgress_trainingPlanId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TraineePlanProgress"
    ADD CONSTRAINT "TraineePlanProgress_trainingPlanId_fkey" FOREIGN KEY ("trainingPlanId") REFERENCES public."TrainingPlan"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TraineePlanProgress TraineePlanProgress_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TraineePlanProgress"
    ADD CONSTRAINT "TraineePlanProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TrainingPlan TrainingPlan_clientMasterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingPlan"
    ADD CONSTRAINT "TrainingPlan_clientMasterId_fkey" FOREIGN KEY ("clientMasterId") REFERENCES public."ClientMaster"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TrainingPlan TrainingPlan_traineeUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TrainingPlan"
    ADD CONSTRAINT "TrainingPlan_traineeUserId_fkey" FOREIGN KEY ("traineeUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_mappedMasterClientId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_mappedMasterClientId_fkey" FOREIGN KEY ("mappedMasterClientId") REFERENCES public."ClientMaster"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict wVyOoK2uAFchNVAWTYxRMZXVUVH9o42owzkpCb6zwwZb3laHED0ZdreQrLwz9gu

