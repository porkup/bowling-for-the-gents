import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const C = {
  bg:"#0B0D12", surface:"#12151C", card:"#181B25", border:"#252A38",
  accent:"#E8C84A", accentDim:"#6B5C1F", red:"#E85A4A", green:"#3DD68C",
  blue:"#5B9CF6", muted:"#5A6278", textDim:"#8B93A8", text:"#EEF0F8",
};
const DS = {fontFamily:"'Barlow Condensed',sans-serif"};
const MIN_GAMES = 6;

const PLAYERS = ["Logan","Aaron","Jared","Evan","Ethan","Danny","Aidan","Alon","Patchen","Elijah","Gabi","Benoit","Ari","Jaqueline","Gabe","Ben","Matan","Alex"];

// ─── CORRECTED DATA ────────────────────────────────────────────────────────────
// S1 corrections applied:
// 270,274,278: Matan→Gabi (78,92,98 on 7/10)
// 204,209: Matan→Ari (34,61 on 6/30)
// 337,345: Gabe→Jaqueline (53,57 on 7/20)
// 430,438: Ben→Gabe (68,60 on 8/5)
// 489,493: Alex→Ben (64,95 on 8/20)
// S2 corrections:
// 15: Ben→Matan (103 on 5/26)

const INIT_GAMES = [
  // S2
  {id:1,date:"2026-05-21",player:"Logan",score:109,season:"S2"},
  {id:2,date:"2026-05-21",player:"Aaron",score:136,season:"S2"},
  {id:3,date:"2026-05-21",player:"Logan",score:102,season:"S2"},
  {id:4,date:"2026-05-21",player:"Aaron",score:118,season:"S2"},
  {id:5,date:"2026-05-26",player:"Aidan",score:87,season:"S2"},
  {id:6,date:"2026-05-26",player:"Elijah",score:105,season:"S2"},
  {id:7,date:"2026-05-26",player:"Aidan",score:120,season:"S2"},
  {id:8,date:"2026-05-26",player:"Elijah",score:102,season:"S2"},
  {id:9,date:"2026-05-26",player:"Logan",score:126,season:"S2"},
  {id:10,date:"2026-05-26",player:"Aaron",score:149,season:"S2"},
  {id:11,date:"2026-05-26",player:"Evan",score:109,season:"S2"},
  {id:12,date:"2026-05-26",player:"Logan",score:104,season:"S2"},
  {id:13,date:"2026-05-26",player:"Aaron",score:149,season:"S2"},
  {id:14,date:"2026-05-26",player:"Evan",score:98,season:"S2"},
  {id:15,date:"2026-05-26",player:"Matan",score:103,season:"S2"}, // was Ben
  {id:16,date:"2026-05-27",player:"Logan",score:125,season:"S2"},
  {id:17,date:"2026-05-27",player:"Aaron",score:119,season:"S2"},
  {id:18,date:"2026-05-27",player:"Jared",score:113,season:"S2"},
  {id:19,date:"2026-05-27",player:"Evan",score:125,season:"S2"},
  {id:20,date:"2026-05-27",player:"Ethan",score:88,season:"S2"},
  {id:21,date:"2026-05-27",player:"Aidan",score:67,season:"S2"},
  {id:22,date:"2026-05-27",player:"Alon",score:86,season:"S2"},
  {id:23,date:"2026-05-27",player:"Elijah",score:73,season:"S2"},
  {id:24,date:"2026-05-27",player:"Logan",score:151,season:"S2"},
  {id:25,date:"2026-05-27",player:"Aaron",score:99,season:"S2"},
  {id:26,date:"2026-05-27",player:"Jared",score:90,season:"S2"},
  {id:27,date:"2026-05-27",player:"Evan",score:126,season:"S2"},
  {id:28,date:"2026-05-27",player:"Ethan",score:111,season:"S2"},
  {id:29,date:"2026-05-27",player:"Aidan",score:104,season:"S2"},
  {id:30,date:"2026-05-27",player:"Alon",score:79,season:"S2"},
  {id:31,date:"2026-05-27",player:"Patchen",score:118,season:"S2"},
  {id:32,date:"2026-05-27",player:"Elijah",score:81,season:"S2"},
  {id:33,date:"2026-05-28",player:"Logan",score:147,season:"S2"},
  {id:34,date:"2026-05-28",player:"Aaron",score:127,season:"S2"},
  {id:35,date:"2026-05-28",player:"Jared",score:132,season:"S2"},
  {id:36,date:"2026-05-28",player:"Ethan",score:147,season:"S2"},
  {id:37,date:"2026-05-28",player:"Danny",score:108,season:"S2"},
  {id:38,date:"2026-05-28",player:"Aidan",score:81,season:"S2"},
  {id:39,date:"2026-05-28",player:"Patchen",score:95,season:"S2"},
  {id:40,date:"2026-05-28",player:"Logan",score:140,season:"S2"},
  {id:41,date:"2026-05-28",player:"Aaron",score:107,season:"S2"},
  {id:42,date:"2026-05-28",player:"Jared",score:120,season:"S2"},
  {id:43,date:"2026-05-28",player:"Ethan",score:60,season:"S2"},
  {id:44,date:"2026-05-28",player:"Danny",score:147,season:"S2"},
  {id:45,date:"2026-05-28",player:"Aidan",score:86,season:"S2"},
  {id:46,date:"2026-05-28",player:"Patchen",score:60,season:"S2"},
  {id:47,date:"2026-05-30",player:"Logan",score:101,season:"S2"},
  {id:48,date:"2026-05-30",player:"Aaron",score:112,season:"S2"},
  {id:49,date:"2026-05-30",player:"Logan",score:169,season:"S2"},
  {id:50,date:"2026-05-30",player:"Aaron",score:179,season:"S2"},
  {id:51,date:"2026-06-01",player:"Logan",score:137,season:"S2"},
  {id:52,date:"2026-06-01",player:"Aaron",score:132,season:"S2"},
  {id:53,date:"2026-06-01",player:"Jared",score:105,season:"S2"},
  {id:54,date:"2026-06-01",player:"Danny",score:100,season:"S2"},
  {id:55,date:"2026-06-01",player:"Alon",score:146,season:"S2"},
  {id:56,date:"2026-06-01",player:"Logan",score:114,season:"S2"},
  {id:57,date:"2026-06-01",player:"Aaron",score:113,season:"S2"},
  {id:58,date:"2026-06-01",player:"Jared",score:119,season:"S2"},
  {id:59,date:"2026-06-01",player:"Danny",score:117,season:"S2"},
  {id:60,date:"2026-06-01",player:"Alon",score:85,season:"S2"},
  {id:61,date:"2026-06-02",player:"Logan",score:144,season:"S2"},
  {id:62,date:"2026-06-02",player:"Aaron",score:156,season:"S2"},
  {id:63,date:"2026-06-02",player:"Jared",score:74,season:"S2"},
  {id:64,date:"2026-06-02",player:"Danny",score:147,season:"S2"},
  {id:65,date:"2026-06-02",player:"Logan",score:99,season:"S2"},
  {id:66,date:"2026-06-02",player:"Aaron",score:131,season:"S2"},
  {id:67,date:"2026-06-02",player:"Jared",score:130,season:"S2"},
  {id:68,date:"2026-06-03",player:"Aaron",score:147,season:"S2"},
  {id:69,date:"2026-06-03",player:"Jared",score:122,season:"S2"},
  {id:70,date:"2026-06-03",player:"Aidan",score:91,season:"S2"},
  {id:71,date:"2026-06-03",player:"Aaron",score:133,season:"S2"},
  {id:72,date:"2026-06-03",player:"Jared",score:83,season:"S2"},
  {id:73,date:"2026-06-03",player:"Aidan",score:84,season:"S2"},
  {id:74,date:"2026-06-04",player:"Aaron",score:146,season:"S2"},
  {id:75,date:"2026-06-04",player:"Jared",score:98,season:"S2"},
  {id:76,date:"2026-06-04",player:"Danny",score:118,season:"S2"},
  {id:77,date:"2026-06-04",player:"Alon",score:94,season:"S2"},
  {id:78,date:"2026-06-04",player:"Patchen",score:72,season:"S2"},
  {id:79,date:"2026-06-04",player:"Aaron",score:164,season:"S2"},
  {id:80,date:"2026-06-04",player:"Jared",score:115,season:"S2"},
  {id:81,date:"2026-06-04",player:"Danny",score:88,season:"S2"},
  {id:82,date:"2026-06-04",player:"Alon",score:108,season:"S2"},
  {id:83,date:"2026-06-04",player:"Patchen",score:74,season:"S2"},
  {id:84,date:"2026-06-05",player:"Aaron",score:112,season:"S2"},
  {id:85,date:"2026-06-05",player:"Jared",score:105,season:"S2"},
  {id:86,date:"2026-06-05",player:"Evan",score:117,season:"S2"},
  {id:87,date:"2026-06-05",player:"Danny",score:123,season:"S2"},
  {id:88,date:"2026-06-05",player:"Aidan",score:67,season:"S2"},
  {id:89,date:"2026-06-05",player:"Elijah",score:124,season:"S2"},
  {id:90,date:"2026-06-05",player:"Jared",score:120,season:"S2"},
  {id:91,date:"2026-06-05",player:"Evan",score:115,season:"S2"},
  {id:92,date:"2026-06-05",player:"Danny",score:123,season:"S2"},
  {id:93,date:"2026-06-05",player:"Aidan",score:109,season:"S2"},
  {id:94,date:"2026-06-05",player:"Elijah",score:151,season:"S2"},
  {id:95,date:"2026-06-10",player:"Logan",score:80,season:"S2"},
  {id:96,date:"2026-06-10",player:"Aaron",score:151,season:"S2"},
  {id:97,date:"2026-06-10",player:"Jared",score:105,season:"S2"},
  {id:98,date:"2026-06-10",player:"Danny",score:146,season:"S2"},
  {id:99,date:"2026-06-10",player:"Aidan",score:77,season:"S2"},
  {id:100,date:"2026-06-10",player:"Alon",score:134,season:"S2"},
  {id:101,date:"2026-06-10",player:"Patchen",score:92,season:"S2"},
  {id:102,date:"2026-06-10",player:"Jared",score:139,season:"S2"},
  {id:103,date:"2026-06-10",player:"Danny",score:150,season:"S2"},
  {id:104,date:"2026-06-10",player:"Aidan",score:65,season:"S2"},
  {id:105,date:"2026-06-10",player:"Alon",score:85,season:"S2"},
  {id:106,date:"2026-06-11",player:"Aaron",score:149,season:"S2"},
  {id:107,date:"2026-06-11",player:"Aaron",score:148,season:"S2"},
  {id:108,date:"2026-06-11",player:"Aaron",score:127,season:"S2"},
  {id:109,date:"2026-06-11",player:"Jared",score:118,season:"S2"},
  {id:110,date:"2026-06-11",player:"Evan",score:133,season:"S2"},
  {id:111,date:"2026-06-11",player:"Danny",score:118,season:"S2"},
  {id:112,date:"2026-06-11",player:"Aidan",score:66,season:"S2"},
  {id:113,date:"2026-06-11",player:"Elijah",score:88,season:"S2"},
  {id:114,date:"2026-06-11",player:"Jared",score:103,season:"S2"},
  {id:115,date:"2026-06-11",player:"Danny",score:104,season:"S2"},
  {id:116,date:"2026-06-11",player:"Aidan",score:71,season:"S2"},
  {id:117,date:"2026-06-11",player:"Elijah",score:128,season:"S2"},
  {id:118,date:"2026-06-12",player:"Logan",score:115,season:"S2"},
  {id:119,date:"2026-06-12",player:"Aaron",score:143,season:"S2"},
  {id:120,date:"2026-06-12",player:"Evan",score:113,season:"S2"},
  {id:121,date:"2026-06-12",player:"Aidan",score:87,season:"S2"},
  {id:122,date:"2026-06-12",player:"Elijah",score:116,season:"S2"},
  {id:123,date:"2026-06-12",player:"Logan",score:91,season:"S2"},
  {id:124,date:"2026-06-12",player:"Aaron",score:134,season:"S2"},
  {id:125,date:"2026-06-12",player:"Evan",score:121,season:"S2"},
  {id:126,date:"2026-06-12",player:"Aidan",score:98,season:"S2"},
  {id:127,date:"2026-06-12",player:"Elijah",score:122,season:"S2"},
  {id:128,date:"2026-06-12",player:"Evan",score:112,season:"S2"},
  {id:129,date:"2026-06-12",player:"Aidan",score:121,season:"S2"},
  {id:130,date:"2026-06-12",player:"Logan",score:114,season:"S2"},
  {id:131,date:"2026-06-12",player:"Aidan",score:92,season:"S2"},
  {id:132,date:"2026-06-14",player:"Logan",score:133,season:"S2"},
  {id:133,date:"2026-06-14",player:"Jared",score:83,season:"S2"},
  {id:134,date:"2026-06-14",player:"Aidan",score:97,season:"S2"},
  {id:135,date:"2026-06-14",player:"Elijah",score:121,season:"S2"},
  {id:136,date:"2026-06-14",player:"Alex",score:50,season:"S2"},
  {id:137,date:"2026-06-14",player:"Logan",score:121,season:"S2"},
  {id:138,date:"2026-06-14",player:"Jared",score:101,season:"S2"},
  {id:139,date:"2026-06-14",player:"Aidan",score:91,season:"S2"},
  {id:140,date:"2026-06-14",player:"Elijah",score:93,season:"S2"},
  {id:141,date:"2026-06-14",player:"Alex",score:76,season:"S2"},
  {id:142,date:"2026-06-15",player:"Logan",score:119,season:"S2"},
  {id:143,date:"2026-06-15",player:"Aaron",score:121,season:"S2"},
  {id:144,date:"2026-06-15",player:"Jared",score:102,season:"S2"},
  {id:145,date:"2026-06-15",player:"Aidan",score:85,season:"S2"},
  {id:146,date:"2026-06-15",player:"Patchen",score:99,season:"S2"},
  {id:147,date:"2026-06-15",player:"Elijah",score:132,season:"S2"},
  {id:148,date:"2026-06-15",player:"Alex",score:68,season:"S2"},
  {id:149,date:"2026-06-15",player:"Logan",score:139,season:"S2"},
  {id:150,date:"2026-06-15",player:"Aaron",score:180,season:"S2"},
  {id:151,date:"2026-06-15",player:"Jared",score:113,season:"S2"},
  {id:152,date:"2026-06-15",player:"Aidan",score:96,season:"S2"},
  {id:153,date:"2026-06-15",player:"Patchen",score:88,season:"S2"},
  {id:154,date:"2026-06-15",player:"Elijah",score:138,season:"S2"},
  {id:155,date:"2026-06-15",player:"Alex",score:58,season:"S2"},
  {id:156,date:"2026-06-15",player:"Aaron",score:126,season:"S2"},
  {id:157,date:"2026-06-15",player:"Jared",score:112,season:"S2"},
  {id:158,date:"2026-06-15",player:"Aidan",score:121,season:"S2"},
  {id:159,date:"2026-06-15",player:"Patchen",score:68,season:"S2"},
  {id:160,date:"2026-06-15",player:"Elijah",score:100,season:"S2"},
  {id:161,date:"2026-06-15",player:"Alex",score:53,season:"S2"},
  // S1 — corrected
  {id:162,date:"2025-06-16",player:"Evan",score:171,season:"S1"},
  {id:163,date:"2025-06-17",player:"Aaron",score:159,season:"S1"},
  {id:164,date:"2025-06-17",player:"Jared",score:91,season:"S1"},
  {id:165,date:"2025-06-17",player:"Evan",score:139,season:"S1"},
  {id:166,date:"2025-06-17",player:"Ethan",score:94,season:"S1"},
  {id:167,date:"2025-06-17",player:"Danny",score:99,season:"S1"},
  {id:168,date:"2025-06-17",player:"Aaron",score:132,season:"S1"},
  {id:169,date:"2025-06-17",player:"Jared",score:88,season:"S1"},
  {id:170,date:"2025-06-17",player:"Evan",score:109,season:"S1"},
  {id:171,date:"2025-06-17",player:"Ethan",score:93,season:"S1"},
  {id:172,date:"2025-06-17",player:"Danny",score:112,season:"S1"},
  {id:173,date:"2025-06-18",player:"Aaron",score:152,season:"S1"},
  {id:174,date:"2025-06-18",player:"Jared",score:108,season:"S1"},
  {id:175,date:"2025-06-18",player:"Evan",score:116,season:"S1"},
  {id:176,date:"2025-06-18",player:"Danny",score:165,season:"S1"},
  {id:177,date:"2025-06-18",player:"Aidan",score:85,season:"S1"},
  {id:178,date:"2025-06-18",player:"Gabi",score:125,season:"S1"},
  {id:179,date:"2025-06-18",player:"Aaron",score:145,season:"S1"},
  {id:180,date:"2025-06-18",player:"Jared",score:109,season:"S1"},
  {id:181,date:"2025-06-18",player:"Danny",score:116,season:"S1"},
  {id:182,date:"2025-06-18",player:"Gabi",score:109,season:"S1"},
  {id:183,date:"2025-06-23",player:"Logan",score:134,season:"S1"},
  {id:184,date:"2025-06-23",player:"Aaron",score:128,season:"S1"},
  {id:185,date:"2025-06-23",player:"Jared",score:94,season:"S1"},
  {id:186,date:"2025-06-23",player:"Evan",score:145,season:"S1"},
  {id:187,date:"2025-06-23",player:"Logan",score:204,season:"S1"},
  {id:188,date:"2025-06-23",player:"Aaron",score:112,season:"S1"},
  {id:189,date:"2025-06-23",player:"Jared",score:86,season:"S1"},
  {id:190,date:"2025-06-23",player:"Evan",score:113,season:"S1"},
  {id:191,date:"2025-06-24",player:"Logan",score:128,season:"S1"},
  {id:192,date:"2025-06-24",player:"Aaron",score:160,season:"S1"},
  {id:193,date:"2025-06-24",player:"Jared",score:93,season:"S1"},
  {id:194,date:"2025-06-24",player:"Ethan",score:120,season:"S1"},
  {id:195,date:"2025-06-24",player:"Logan",score:139,season:"S1"},
  {id:196,date:"2025-06-24",player:"Aaron",score:141,season:"S1"},
  {id:197,date:"2025-06-24",player:"Jared",score:89,season:"S1"},
  {id:198,date:"2025-06-24",player:"Ethan",score:99,season:"S1"},
  {id:199,date:"2025-06-30",player:"Logan",score:102,season:"S1"},
  {id:200,date:"2025-06-30",player:"Aaron",score:132,season:"S1"},
  {id:201,date:"2025-06-30",player:"Jared",score:87,season:"S1"},
  {id:202,date:"2025-06-30",player:"Ethan",score:147,season:"S1"},
  {id:203,date:"2025-06-30",player:"Danny",score:143,season:"S1"},
  {id:204,date:"2025-06-30",player:"Ari",score:34,season:"S1"},   // was Matan
  {id:205,date:"2025-06-30",player:"Aaron",score:87,season:"S1"},
  {id:206,date:"2025-06-30",player:"Jared",score:122,season:"S1"},
  {id:207,date:"2025-06-30",player:"Ethan",score:139,season:"S1"},
  {id:208,date:"2025-06-30",player:"Danny",score:119,season:"S1"},
  {id:209,date:"2025-06-30",player:"Ari",score:61,season:"S1"},   // was Matan
  {id:210,date:"2025-07-06",player:"Logan",score:148,season:"S1"},
  {id:211,date:"2025-07-06",player:"Aaron",score:156,season:"S1"},
  {id:212,date:"2025-07-06",player:"Jared",score:114,season:"S1"},
  {id:213,date:"2025-07-06",player:"Evan",score:95,season:"S1"},
  {id:214,date:"2025-07-06",player:"Logan",score:136,season:"S1"},
  {id:215,date:"2025-07-06",player:"Aaron",score:120,season:"S1"},
  {id:216,date:"2025-07-06",player:"Jared",score:112,season:"S1"},
  {id:217,date:"2025-07-06",player:"Evan",score:114,season:"S1"},
  {id:218,date:"2025-07-07",player:"Logan",score:153,season:"S1"},
  {id:219,date:"2025-07-07",player:"Aaron",score:149,season:"S1"},
  {id:220,date:"2025-07-07",player:"Jared",score:90,season:"S1"},
  {id:221,date:"2025-07-07",player:"Danny",score:108,season:"S1"},
  {id:222,date:"2025-07-07",player:"Logan",score:107,season:"S1"},
  {id:223,date:"2025-07-07",player:"Aaron",score:131,season:"S1"},
  {id:224,date:"2025-07-07",player:"Jared",score:125,season:"S1"},
  {id:225,date:"2025-07-08",player:"Logan",score:107,season:"S1"},
  {id:226,date:"2025-07-08",player:"Aaron",score:138,season:"S1"},
  {id:227,date:"2025-07-08",player:"Jared",score:75,season:"S1"},
  {id:228,date:"2025-07-08",player:"Logan",score:139,season:"S1"},
  {id:229,date:"2025-07-08",player:"Aaron",score:145,season:"S1"},
  {id:230,date:"2025-07-08",player:"Jared",score:94,season:"S1"},
  {id:231,date:"2025-07-08",player:"Logan",score:168,season:"S1"},
  {id:232,date:"2025-07-08",player:"Aaron",score:96,season:"S1"},
  {id:233,date:"2025-07-08",player:"Jared",score:80,season:"S1"},
  {id:234,date:"2025-07-08",player:"Logan",score:100,season:"S1"},
  {id:235,date:"2025-07-08",player:"Aaron",score:124,season:"S1"},
  {id:236,date:"2025-07-08",player:"Jared",score:96,season:"S1"},
  {id:237,date:"2025-07-08",player:"Logan",score:139,season:"S1"},
  {id:238,date:"2025-07-08",player:"Aaron",score:144,season:"S1"},
  {id:239,date:"2025-07-08",player:"Jared",score:142,season:"S1"},
  {id:240,date:"2025-07-09",player:"Logan",score:109,season:"S1"},
  {id:241,date:"2025-07-09",player:"Aaron",score:157,season:"S1"},
  {id:242,date:"2025-07-09",player:"Ethan",score:92,season:"S1"},
  {id:243,date:"2025-07-09",player:"Danny",score:116,season:"S1"},
  {id:244,date:"2025-07-09",player:"Logan",score:84,season:"S1"},
  {id:245,date:"2025-07-09",player:"Aaron",score:132,season:"S1"},
  {id:246,date:"2025-07-09",player:"Ethan",score:126,season:"S1"},
  {id:247,date:"2025-07-09",player:"Danny",score:189,season:"S1"},
  {id:248,date:"2025-07-10",player:"Logan",score:125,season:"S1"},
  {id:249,date:"2025-07-10",player:"Aaron",score:107,season:"S1"},
  {id:250,date:"2025-07-10",player:"Danny",score:107,season:"S1"},
  {id:251,date:"2025-07-10",player:"Logan",score:141,season:"S1"},
  {id:252,date:"2025-07-10",player:"Aaron",score:152,season:"S1"},
  {id:253,date:"2025-07-10",player:"Jared",score:116,season:"S1"},
  {id:254,date:"2025-07-10",player:"Danny",score:152,season:"S1"},
  {id:255,date:"2025-07-10",player:"Logan",score:87,season:"S1"},
  {id:256,date:"2025-07-10",player:"Aaron",score:124,season:"S1"},
  {id:257,date:"2025-07-10",player:"Jared",score:89,season:"S1"},
  {id:258,date:"2025-07-10",player:"Danny",score:158,season:"S1"},
  {id:259,date:"2025-07-10",player:"Logan",score:113,season:"S1"},
  {id:260,date:"2025-07-10",player:"Aaron",score:106,season:"S1"},
  {id:261,date:"2025-07-10",player:"Jared",score:116,season:"S1"},
  {id:262,date:"2025-07-10",player:"Danny",score:104,season:"S1"},
  {id:263,date:"2025-07-10",player:"Logan",score:147,season:"S1"},
  {id:264,date:"2025-07-10",player:"Aaron",score:133,season:"S1"},
  {id:265,date:"2025-07-10",player:"Jared",score:108,season:"S1"},
  {id:266,date:"2025-07-10",player:"Danny",score:113,season:"S1"},
  {id:267,date:"2025-07-10",player:"Aaron",score:150,season:"S1"},
  {id:268,date:"2025-07-10",player:"Jared",score:105,season:"S1"},
  {id:269,date:"2025-07-10",player:"Danny",score:130,season:"S1"},
  {id:270,date:"2025-07-10",player:"Gabi",score:78,season:"S1"},  // was Matan
  {id:271,date:"2025-07-10",player:"Aaron",score:143,season:"S1"},
  {id:272,date:"2025-07-10",player:"Jared",score:117,season:"S1"},
  {id:273,date:"2025-07-10",player:"Danny",score:138,season:"S1"},
  {id:274,date:"2025-07-10",player:"Gabi",score:92,season:"S1"},  // was Matan
  {id:275,date:"2025-07-10",player:"Aaron",score:144,season:"S1"},
  {id:276,date:"2025-07-10",player:"Jared",score:122,season:"S1"},
  {id:277,date:"2025-07-10",player:"Danny",score:219,season:"S1"},
  {id:278,date:"2025-07-10",player:"Gabi",score:98,season:"S1"},  // was Matan
  {id:279,date:"2025-07-13",player:"Logan",score:117,season:"S1"},
  {id:280,date:"2025-07-13",player:"Aaron",score:165,season:"S1"},
  {id:281,date:"2025-07-13",player:"Jared",score:100,season:"S1"},
  {id:282,date:"2025-07-13",player:"Evan",score:141,season:"S1"},
  {id:283,date:"2025-07-13",player:"Ethan",score:122,season:"S1"},
  {id:284,date:"2025-07-13",player:"Danny",score:109,season:"S1"},
  {id:285,date:"2025-07-13",player:"Gabi",score:115,season:"S1"},
  {id:286,date:"2025-07-13",player:"Logan",score:176,season:"S1"},
  {id:287,date:"2025-07-13",player:"Aaron",score:96,season:"S1"},
  {id:288,date:"2025-07-13",player:"Jared",score:119,season:"S1"},
  {id:289,date:"2025-07-13",player:"Evan",score:96,season:"S1"},
  {id:290,date:"2025-07-13",player:"Ethan",score:98,season:"S1"},
  {id:291,date:"2025-07-13",player:"Danny",score:168,season:"S1"},
  {id:292,date:"2025-07-13",player:"Gabi",score:80,season:"S1"},
  {id:293,date:"2025-07-15",player:"Logan",score:107,season:"S1"},
  {id:294,date:"2025-07-15",player:"Aaron",score:120,season:"S1"},
  {id:295,date:"2025-07-15",player:"Jared",score:99,season:"S1"},
  {id:296,date:"2025-07-15",player:"Evan",score:82,season:"S1"},
  {id:297,date:"2025-07-15",player:"Ethan",score:90,season:"S1"},
  {id:298,date:"2025-07-15",player:"Danny",score:161,season:"S1"},
  {id:299,date:"2025-07-15",player:"Logan",score:127,season:"S1"},
  {id:300,date:"2025-07-15",player:"Aaron",score:134,season:"S1"},
  {id:301,date:"2025-07-15",player:"Jared",score:95,season:"S1"},
  {id:302,date:"2025-07-15",player:"Evan",score:87,season:"S1"},
  {id:303,date:"2025-07-15",player:"Ethan",score:91,season:"S1"},
  {id:304,date:"2025-07-15",player:"Danny",score:171,season:"S1"},
  {id:305,date:"2025-07-15",player:"Aidan",score:88,season:"S1"},
  {id:306,date:"2025-07-15",player:"Aaron",score:129,season:"S1"},
  {id:307,date:"2025-07-15",player:"Jared",score:80,season:"S1"},
  {id:308,date:"2025-07-15",player:"Ethan",score:109,season:"S1"},
  {id:309,date:"2025-07-15",player:"Danny",score:124,season:"S1"},
  {id:310,date:"2025-07-15",player:"Aaron",score:112,season:"S1"},
  {id:311,date:"2025-07-15",player:"Danny",score:125,season:"S1"},
  {id:312,date:"2025-07-16",player:"Aaron",score:133,season:"S1"},
  {id:313,date:"2025-07-16",player:"Jared",score:115,season:"S1"},
  {id:314,date:"2025-07-16",player:"Evan",score:130,season:"S1"},
  {id:315,date:"2025-07-16",player:"Ethan",score:113,season:"S1"},
  {id:316,date:"2025-07-16",player:"Jared",score:72,season:"S1"},
  {id:317,date:"2025-07-16",player:"Ethan",score:137,season:"S1"},
  {id:318,date:"2025-07-17",player:"Logan",score:107,season:"S1"},
  {id:319,date:"2025-07-17",player:"Aaron",score:101,season:"S1"},
  {id:320,date:"2025-07-17",player:"Ethan",score:98,season:"S1"},
  {id:321,date:"2025-07-17",player:"Danny",score:177,season:"S1"},
  {id:322,date:"2025-07-17",player:"Logan",score:93,season:"S1"},
  {id:323,date:"2025-07-17",player:"Aaron",score:155,season:"S1"},
  {id:324,date:"2025-07-17",player:"Ethan",score:98,season:"S1"},
  {id:325,date:"2025-07-17",player:"Danny",score:126,season:"S1"},
  {id:326,date:"2025-07-19",player:"Logan",score:137,season:"S1"},
  {id:327,date:"2025-07-19",player:"Aaron",score:155,season:"S1"},
  {id:328,date:"2025-07-19",player:"Logan",score:102,season:"S1"},
  {id:329,date:"2025-07-19",player:"Aaron",score:149,season:"S1"},
  {id:330,date:"2025-07-20",player:"Logan",score:130,season:"S1"},
  {id:331,date:"2025-07-20",player:"Aaron",score:169,season:"S1"},
  {id:332,date:"2025-07-20",player:"Jared",score:81,season:"S1"},
  {id:333,date:"2025-07-20",player:"Evan",score:93,season:"S1"},
  {id:334,date:"2025-07-20",player:"Ethan",score:92,season:"S1"},
  {id:335,date:"2025-07-20",player:"Danny",score:144,season:"S1"},
  {id:336,date:"2025-07-20",player:"Aidan",score:98,season:"S1"},
  {id:337,date:"2025-07-20",player:"Jaqueline",score:53,season:"S1"}, // was Gabe
  {id:338,date:"2025-07-20",player:"Logan",score:130,season:"S1"},
  {id:339,date:"2025-07-20",player:"Aaron",score:122,season:"S1"},
  {id:340,date:"2025-07-20",player:"Jared",score:130,season:"S1"},
  {id:341,date:"2025-07-20",player:"Evan",score:93,season:"S1"},
  {id:342,date:"2025-07-20",player:"Ethan",score:193,season:"S1"},
  {id:343,date:"2025-07-20",player:"Danny",score:151,season:"S1"},
  {id:344,date:"2025-07-20",player:"Aidan",score:108,season:"S1"},
  {id:345,date:"2025-07-20",player:"Jaqueline",score:57,season:"S1"}, // was Gabe
  {id:346,date:"2025-07-21",player:"Logan",score:122,season:"S1"},
  {id:347,date:"2025-07-21",player:"Aaron",score:132,season:"S1"},
  {id:348,date:"2025-07-21",player:"Ethan",score:93,season:"S1"},
  {id:349,date:"2025-07-21",player:"Aidan",score:73,season:"S1"},
  {id:350,date:"2025-07-21",player:"Logan",score:141,season:"S1"},
  {id:351,date:"2025-07-21",player:"Ethan",score:100,season:"S1"},
  {id:352,date:"2025-07-21",player:"Aidan",score:74,season:"S1"},
  {id:353,date:"2025-07-23",player:"Aaron",score:111,season:"S1"},
  {id:354,date:"2025-07-23",player:"Ethan",score:115,season:"S1"},
  {id:355,date:"2025-07-23",player:"Danny",score:140,season:"S1"},
  {id:356,date:"2025-07-23",player:"Aidan",score:104,season:"S1"},
  {id:357,date:"2025-07-23",player:"Gabi",score:83,season:"S1"},
  {id:358,date:"2025-07-23",player:"Ethan",score:111,season:"S1"},
  {id:359,date:"2025-07-23",player:"Danny",score:142,season:"S1"},
  {id:360,date:"2025-07-23",player:"Aidan",score:103,season:"S1"},
  {id:361,date:"2025-07-27",player:"Aaron",score:148,season:"S1"},
  {id:362,date:"2025-07-27",player:"Ethan",score:98,season:"S1"},
  {id:363,date:"2025-07-27",player:"Danny",score:131,season:"S1"},
  {id:364,date:"2025-07-27",player:"Aidan",score:96,season:"S1"},
  {id:365,date:"2025-07-27",player:"Gabi",score:84,season:"S1"},
  {id:366,date:"2025-07-27",player:"Aaron",score:120,season:"S1"},
  {id:367,date:"2025-07-27",player:"Ethan",score:111,season:"S1"},
  {id:368,date:"2025-07-27",player:"Danny",score:136,season:"S1"},
  {id:369,date:"2025-07-27",player:"Aidan",score:84,season:"S1"},
  {id:370,date:"2025-07-27",player:"Gabi",score:83,season:"S1"},
  {id:371,date:"2025-07-27",player:"Ethan",score:98,season:"S1"},
  {id:372,date:"2025-07-27",player:"Aidan",score:98,season:"S1"},
  {id:373,date:"2025-07-28",player:"Aaron",score:123,season:"S1"},
  {id:374,date:"2025-07-28",player:"Danny",score:102,season:"S1"},
  {id:375,date:"2025-07-28",player:"Aaron",score:148,season:"S1"},
  {id:376,date:"2025-07-28",player:"Danny",score:108,season:"S1"},
  {id:377,date:"2025-07-29",player:"Logan",score:151,season:"S1"},
  {id:378,date:"2025-07-29",player:"Aaron",score:165,season:"S1"},
  {id:379,date:"2025-07-29",player:"Logan",score:137,season:"S1"},
  {id:380,date:"2025-07-29",player:"Aaron",score:122,season:"S1"},
  {id:381,date:"2025-07-29",player:"Logan",score:117,season:"S1"},
  {id:382,date:"2025-07-29",player:"Aaron",score:225,season:"S1"},
  {id:383,date:"2025-07-29",player:"Logan",score:116,season:"S1"},
  {id:384,date:"2025-07-29",player:"Aaron",score:131,season:"S1"},
  {id:385,date:"2025-07-29",player:"Logan",score:132,season:"S1"},
  {id:386,date:"2025-07-29",player:"Aaron",score:124,season:"S1"},
  {id:387,date:"2025-07-29",player:"Logan",score:131,season:"S1"},
  {id:388,date:"2025-07-29",player:"Aaron",score:139,season:"S1"},
  {id:389,date:"2025-07-29",player:"Logan",score:114,season:"S1"},
  {id:390,date:"2025-07-29",player:"Aaron",score:120,season:"S1"},
  {id:391,date:"2025-07-29",player:"Ethan",score:113,season:"S1"},
  {id:392,date:"2025-07-29",player:"Danny",score:120,season:"S1"},
  {id:393,date:"2025-07-29",player:"Aidan",score:100,season:"S1"},
  {id:394,date:"2025-07-29",player:"Logan",score:123,season:"S1"},
  {id:395,date:"2025-07-29",player:"Aaron",score:110,season:"S1"},
  {id:396,date:"2025-07-29",player:"Ethan",score:86,season:"S1"},
  {id:397,date:"2025-07-29",player:"Aidan",score:91,season:"S1"},
  {id:398,date:"2025-07-30",player:"Aaron",score:138,season:"S1"},
  {id:399,date:"2025-07-30",player:"Aidan",score:75,season:"S1"},
  {id:400,date:"2025-07-30",player:"Aaron",score:147,season:"S1"},
  {id:401,date:"2025-07-30",player:"Aidan",score:76,season:"S1"},
  {id:402,date:"2025-07-31",player:"Logan",score:123,season:"S1"},
  {id:403,date:"2025-07-31",player:"Aaron",score:150,season:"S1"},
  {id:404,date:"2025-07-31",player:"Logan",score:121,season:"S1"},
  {id:405,date:"2025-07-31",player:"Aaron",score:115,season:"S1"},
  {id:406,date:"2025-08-03",player:"Logan",score:99,season:"S1"},
  {id:407,date:"2025-08-03",player:"Aaron",score:134,season:"S1"},
  {id:408,date:"2025-08-03",player:"Logan",score:122,season:"S1"},
  {id:409,date:"2025-08-03",player:"Aaron",score:153,season:"S1"},
  {id:410,date:"2025-08-04",player:"Logan",score:103,season:"S1"},
  {id:411,date:"2025-08-04",player:"Aaron",score:98,season:"S1"},
  {id:412,date:"2025-08-04",player:"Ethan",score:108,season:"S1"},
  {id:413,date:"2025-08-04",player:"Aidan",score:119,season:"S1"},
  {id:414,date:"2025-08-04",player:"Alon",score:99,season:"S1"},
  {id:415,date:"2025-08-04",player:"Gabi",score:91,season:"S1"},
  {id:416,date:"2025-08-04",player:"Benoit",score:88,season:"S1"},
  {id:417,date:"2025-08-04",player:"Logan",score:125,season:"S1"},
  {id:418,date:"2025-08-04",player:"Aaron",score:164,season:"S1"},
  {id:419,date:"2025-08-04",player:"Ethan",score:95,season:"S1"},
  {id:420,date:"2025-08-04",player:"Aidan",score:84,season:"S1"},
  {id:421,date:"2025-08-04",player:"Alon",score:101,season:"S1"},
  {id:422,date:"2025-08-04",player:"Benoit",score:59,season:"S1"},
  {id:423,date:"2025-08-05",player:"Logan",score:114,season:"S1"},
  {id:424,date:"2025-08-05",player:"Aaron",score:113,season:"S1"},
  {id:425,date:"2025-08-05",player:"Jared",score:92,season:"S1"},
  {id:426,date:"2025-08-05",player:"Evan",score:92,season:"S1"},
  {id:427,date:"2025-08-05",player:"Ethan",score:90,season:"S1"},
  {id:428,date:"2025-08-05",player:"Alon",score:98,season:"S1"},
  {id:429,date:"2025-08-05",player:"Gabi",score:109,season:"S1"},
  {id:430,date:"2025-08-05",player:"Gabe",score:68,season:"S1"},  // was Ben
  {id:431,date:"2025-08-05",player:"Logan",score:112,season:"S1"},
  {id:432,date:"2025-08-05",player:"Aaron",score:127,season:"S1"},
  {id:433,date:"2025-08-05",player:"Jared",score:108,season:"S1"},
  {id:434,date:"2025-08-05",player:"Evan",score:117,season:"S1"},
  {id:435,date:"2025-08-05",player:"Ethan",score:130,season:"S1"},
  {id:436,date:"2025-08-05",player:"Alon",score:86,season:"S1"},
  {id:437,date:"2025-08-05",player:"Gabi",score:100,season:"S1"},
  {id:438,date:"2025-08-05",player:"Gabe",score:60,season:"S1"},  // was Ben
  {id:439,date:"2025-08-06",player:"Logan",score:112,season:"S1"},
  {id:440,date:"2025-08-06",player:"Aaron",score:126,season:"S1"},
  {id:441,date:"2025-08-06",player:"Jared",score:92,season:"S1"},
  {id:442,date:"2025-08-06",player:"Ethan",score:70,season:"S1"},
  {id:443,date:"2025-08-06",player:"Aidan",score:60,season:"S1"},
  {id:444,date:"2025-08-06",player:"Alon",score:75,season:"S1"},
  {id:445,date:"2025-08-06",player:"Patchen",score:61,season:"S1"},
  {id:446,date:"2025-08-08",player:"Logan",score:100,season:"S1"},
  {id:447,date:"2025-08-08",player:"Aaron",score:128,season:"S1"},
  {id:448,date:"2025-08-08",player:"Logan",score:158,season:"S1"},
  {id:449,date:"2025-08-08",player:"Aaron",score:129,season:"S1"},
  {id:450,date:"2025-08-09",player:"Logan",score:158,season:"S1"},
  {id:451,date:"2025-08-09",player:"Aaron",score:145,season:"S1"},
  {id:452,date:"2025-08-09",player:"Logan",score:157,season:"S1"},
  {id:453,date:"2025-08-09",player:"Aaron",score:170,season:"S1"},
  {id:454,date:"2025-08-09",player:"Logan",score:124,season:"S1"},
  {id:455,date:"2025-08-09",player:"Aaron",score:124,season:"S1"},
  {id:456,date:"2025-08-09",player:"Logan",score:94,season:"S1"},
  {id:457,date:"2025-08-09",player:"Aaron",score:151,season:"S1"},
  {id:458,date:"2025-08-14",player:"Logan",score:148,season:"S1"},
  {id:459,date:"2025-08-14",player:"Evan",score:136,season:"S1"},
  {id:460,date:"2025-08-14",player:"Logan",score:103,season:"S1"},
  {id:461,date:"2025-08-14",player:"Evan",score:127,season:"S1"},
  {id:462,date:"2025-08-16",player:"Logan",score:113,season:"S1"},
  {id:463,date:"2025-08-16",player:"Aaron",score:171,season:"S1"},
  {id:464,date:"2025-08-16",player:"Logan",score:134,season:"S1"},
  {id:465,date:"2025-08-16",player:"Aaron",score:143,season:"S1"},
  {id:466,date:"2025-08-17",player:"Logan",score:131,season:"S1"},
  {id:467,date:"2025-08-17",player:"Aaron",score:152,season:"S1"},
  {id:468,date:"2025-08-17",player:"Jared",score:117,season:"S1"},
  {id:469,date:"2025-08-17",player:"Ethan",score:132,season:"S1"},
  {id:470,date:"2025-08-17",player:"Alon",score:95,season:"S1"},
  {id:471,date:"2025-08-17",player:"Elijah",score:105,season:"S1"},
  {id:472,date:"2025-08-17",player:"Logan",score:133,season:"S1"},
  {id:473,date:"2025-08-17",player:"Aaron",score:134,season:"S1"},
  {id:474,date:"2025-08-17",player:"Jared",score:79,season:"S1"},
  {id:475,date:"2025-08-17",player:"Ethan",score:139,season:"S1"},
  {id:476,date:"2025-08-17",player:"Alon",score:104,season:"S1"},
  {id:477,date:"2025-08-17",player:"Elijah",score:109,season:"S1"},
  {id:478,date:"2025-08-18",player:"Aaron",score:144,season:"S1"},
  {id:479,date:"2025-08-18",player:"Jared",score:127,season:"S1"},
  {id:480,date:"2025-08-18",player:"Ethan",score:125,season:"S1"},
  {id:481,date:"2025-08-18",player:"Alon",score:58,season:"S1"},
  {id:482,date:"2025-08-18",player:"Aaron",score:159,season:"S1"},
  {id:483,date:"2025-08-18",player:"Jared",score:120,season:"S1"},
  {id:484,date:"2025-08-18",player:"Ethan",score:101,season:"S1"},
  {id:485,date:"2025-08-18",player:"Alon",score:90,season:"S1"},
  {id:486,date:"2025-08-20",player:"Aaron",score:174,season:"S1"},
  {id:487,date:"2025-08-20",player:"Ethan",score:109,season:"S1"},
  {id:488,date:"2025-08-20",player:"Alon",score:80,season:"S1"},
  {id:489,date:"2025-08-20",player:"Ben",score:64,season:"S1"},   // was Alex
  {id:490,date:"2025-08-20",player:"Aaron",score:167,season:"S1"},
  {id:491,date:"2025-08-20",player:"Ethan",score:99,season:"S1"},
  {id:492,date:"2025-08-20",player:"Alon",score:59,season:"S1"},
  {id:493,date:"2025-08-20",player:"Ben",score:95,season:"S1"},   // was Alex
  {id:494,date:"2025-11-26",player:"Aaron",score:186,season:"S1"},
  {id:495,date:"2025-11-26",player:"Jared",score:89,season:"S1"},
  {id:496,date:"2025-11-26",player:"Danny",score:148,season:"S1"},
  {id:497,date:"2025-11-26",player:"Aaron",score:116,season:"S1"},
  {id:498,date:"2025-11-26",player:"Jared",score:142,season:"S1"},
  {id:499,date:"2025-11-26",player:"Danny",score:136,season:"S1"},
  {id:500,date:"2025-11-26",player:"Aaron",score:116,season:"S1"},
  {id:501,date:"2025-11-26",player:"Jared",score:79,season:"S1"},
  {id:502,date:"2025-11-26",player:"Danny",score:155,season:"S1"},
  {id:503,date:"2025-12-14",player:"Jared",score:50,season:"S1"},
  {id:504,date:"2025-12-14",player:"Danny",score:109,season:"S1"},
  {id:505,date:"2025-12-14",player:"Jared",score:111,season:"S1"},
  {id:506,date:"2025-12-14",player:"Danny",score:194,season:"S1"},
  {id:507,date:"2025-12-14",player:"Jared",score:96,season:"S1"},
  {id:508,date:"2025-12-14",player:"Danny",score:180,season:"S1"},
];

// ─── GLOSSARY ──────────────────────────────────────────────────────────────────
const GLOSSARY = {
  avg: {label:"Average", def:"Your mean score across all games this season. The most reliable measure of where your game actually sits."},
  high: {label:"High Game", def:"Your best single game of the season. Just the one — your personal best."},
  low: {label:"Low Game", def:"Your worst single game of the season. Everyone has them."},
  stdDev: {label:"Consistency", def:"How much your scores jump around. Lower = more predictable. Higher = more streaky. Neither is better — it's just your style."},
  last5: {label:"Last 5 Avg", def:"Your average over your 5 most recent games. The best quick read on how you're bowling right now."},
  momentum: {label:"Momentum", def:"Your last 5 average minus your season average. Positive means you're bowling above your usual level lately. Negative means you're below it. Needs at least 5 games."},
  stretch: {label:"Best Stretch", def:"Your highest 5-game rolling average — basically your peak run of the season. Captures when you were in your best groove."},
  swing: {label:"Biggest Swing", def:"The largest gap between your best and worst game in a single night. Big number = wild night."},
  bestNight: {label:"Best Night", def:"Your highest single-session average — the night where, across all your games, you averaged the most."},
  hotCold: {label:"Hot / Cold", def:"Based on your momentum (last 5 avg vs season avg). +5 or above = Hot 🔥. -1 or below = Cold ❄️. Needs 6+ games."},
  trend: {label:"Trend Arrow", def:"↑ means your rolling average has been climbing. ↓ means it's been dropping. → means it's flat. Based on the slope of your 5-game rolling average."},
  gameCount: {label:"Games Played", def:"Total number of individual games you've bowled this season. Each time you bowl a full game counts as one."},
};

// ─── ANALYTICS ─────────────────────────────────────────────────────────────────
function mean(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:null;}
function sd(a){if(a.length<2)return 0;const m=mean(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length);}
function rolling(sc,n=5){return sc.map((_,i)=>i<n-1?null:mean(sc.slice(i-n+1,i+1)));}
function bestStretch(sc,rawGames,n=5){
  if(!sc||sc.length<n)return null;
  let b=-Infinity,bestStart=0,bestEnd=n-1;
  for(let i=n-1;i<sc.length;i++){
    const a=mean(sc.slice(i-n+1,i+1));
    if(a>b){b=a;bestStart=i-n+1;bestEnd=i;}
  }
  const startDate=rawGames?rawGames[bestStart]?.date:null;
  const endDate=rawGames?rawGames[bestEnd]?.date:null;
  return{avg:b,startDate,endDate};
}
function worstStretch(sc,rawGames,n=5){
  if(!sc||sc.length<n)return null;
  let worst=Infinity,worstStart=0,worstEnd=n-1;
  for(let i=n-1;i<sc.length;i++){
    const a=mean(sc.slice(i-n+1,i+1));
    if(a<worst){worst=a;worstStart=i-n+1;worstEnd=i;}
  }
  const startDate=rawGames?rawGames[worstStart]?.date:null;
  const endDate=rawGames?rawGames[worstEnd]?.date:null;
  return{avg:worst,startDate,endDate};
}

function sessionSwings(rawGames){
  // Group by date, find consecutive game pairs within same date
  const by={};
  rawGames.forEach(g=>{if(!by[g.date])by[g.date]=[];by[g.date].push(g);});
  let biggestUp={swing:0,date:null,from:0,to:0};
  let biggestDown={swing:0,date:null,from:0,to:0};
  Object.entries(by).forEach(([date,gs])=>{
    // sort by ts/id for insertion order
    const sorted=[...gs].sort((a,b)=>(a.ts??a.id)-(b.ts??b.id));
    for(let i=1;i<sorted.length;i++){
      const diff=sorted[i].score-sorted[i-1].score;
      if(diff>biggestUp.swing)biggestUp={swing:diff,date,from:sorted[i-1].score,to:sorted[i].score};
      if(-diff>biggestDown.swing)biggestDown={swing:-diff,date,from:sorted[i-1].score,to:sorted[i].score};
    }
  });
  return{biggestUp,biggestDown};
}

function longestColdStreak(rawGames,seasonAvg){
  if(!rawGames||rawGames.length<2)return{count:0,startDate:null,endDate:null};
  let best=0,cur=0,curStart=0,bestStart=0,bestEnd=0;
  rawGames.forEach((g,i)=>{
    if(g.score<seasonAvg){
      if(cur===0)curStart=i;
      cur++;
      if(cur>best){best=cur;bestStart=curStart;bestEnd=i;}
    } else cur=0;
  });
  return{count:best,startDate:best>0?rawGames[bestStart]?.date:null,endDate:best>0?rawGames[bestEnd]?.date:null};
}
function longestHotStreak(rawGames,seasonAvg){
  if(!rawGames||rawGames.length<2)return{count:0,startDate:null,endDate:null};
  let best=0,cur=0,curStart=0,bestStart=0,bestEnd=0;
  rawGames.forEach((g,i)=>{
    if(g.score>seasonAvg){
      if(cur===0)curStart=i;
      cur++;
      if(cur>best){best=cur;bestStart=curStart;bestEnd=i;}
    } else cur=0;
  });
  return{count:best,startDate:best>0?rawGames[bestStart]?.date:null,endDate:best>0?rawGames[bestEnd]?.date:null};
}
function biggestSwing(gs){
  const by={};gs.forEach(g=>{if(!by[g.date])by[g.date]=[];by[g.date].push(g.score);});
  let best=null;
  Object.entries(by).forEach(([d,s])=>{if(s.length<2)return;const sw=Math.max(...s)-Math.min(...s);if(!best||sw>best.swing)best={date:d,swing:sw};});
  return best;
}
function bestDay(gs){
  const by={};gs.forEach(g=>{if(!by[g.date])by[g.date]=[];by[g.date].push(g.score);});
  let best=null;
  Object.entries(by).forEach(([d,s])=>{const a=mean(s);if(!best||a>best.avg)best={date:d,avg:a};});
  return best;
}
function hotCold(scores,seasonAvg){
  // placeholder — actual hot/cold assigned after all players calculated
  if(scores.length<MIN_GAMES)return"neutral";
  const last5=mean(scores.slice(-5));
  return last5-seasonAvg;
}
function trendDir(sc){
  const r=rolling(sc,5).filter(Boolean);if(r.length<3)return"flat";
  const xs=r.map((_,i)=>i),mx=mean(xs),my=mean(r);
  const sl=xs.reduce((s,x,i)=>s+(x-mx)*(r[i]-my),0)/xs.reduce((s,x)=>s+(x-mx)**2,0);
  return sl>0.25?"up":sl<-0.25?"down":"flat";
}

function calcStats(gs,player,season){
  const pg=gs.filter(g=>g.player===player&&g.season===season).sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(!pg.length)return{player,gameCount:0,season,hasEnough:false,canAvg:false,canCons:false,canStretch:false,canLast5:false,canMomentum:false};
  const sc=pg.map(g=>g.score);
  const n=sc.length;
  const canAvg=n>=1;
  const canCons=n>=2;
  const canStretch=n>=5;
  const canLast5=n>=5;
  const canMomentum=n>=MIN_GAMES;
  const hasEnough=n>=MIN_GAMES;
  const avg=mean(sc);
  const last5Avg=canLast5?mean(sc.slice(-5)):null;
  const momentum=canMomentum&&avg!=null?last5Avg-avg:null;
  return{
    player,season,gameCount:n,hasEnough,canAvg,canCons,canStretch,canLast5,canMomentum,
    avg,high:Math.max(...sc),low:Math.min(...sc),
    stdDev:canCons?sd(sc):null,
    last5:last5Avg,momentum,
    stretch:canStretch?bestStretch(sc,pg):null,
    swing:biggestSwing(pg),
    bestDay:bestDay(pg),
    roll:rolling(sc,5),scores:sc,rawGames:pg,
    hc:"neutral",
    trend:hasEnough?trendDir(sc):"flat",
  };
}
function getStats(gs,season){
  const all=PLAYERS.map(p=>calcStats(gs,p,season)).filter(s=>s.gameCount>0);
  // hot/cold: momentum >= +5 = hot, momentum <= -1 = cold
  all.forEach(s=>{
    if(!s.hasEnough||s.momentum==null){s.hc="neutral";return;}
    s.hc=s.momentum>=5?"hot":s.momentum<=-1?"cold":"neutral";
  });
  return all.sort((a,b)=>(b.avg||0)-(a.avg||0));
}
function groupStats(gs,season){
  const g=gs.filter(x=>x.season===season);
  const sc=g.map(x=>x.score);
  const dates=[...new Set(g.map(x=>x.date))];
  return{total:sc.length,avg:mean(sc),high:sc.length?Math.max(...sc):0,sessions:dates.length,active:new Set(g.map(x=>x.player)).size};
}
function fd(d){if(!d)return"—";return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"});}
function fdelta(v,d=1){if(v==null)return"—";return(v>0?"+":"")+v.toFixed(d);}

// ─── MICRO COMPONENTS ──────────────────────────────────────────────────────────
function Pill({label,color=C.accent}){
  return<span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:999,background:color+"22",color,fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>;
}
function StatusPill({s}){
  if(s==="hot")return<span style={{display:"inline-flex",alignItems:"center",padding:"3px 8px",borderRadius:999,background:C.red+"22",color:C.red,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>🔥 Hot</span>;
  if(s==="cold")return<span style={{display:"inline-flex",alignItems:"center",padding:"3px 8px",borderRadius:999,background:C.blue+"22",color:C.blue,fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>❄️ Cold</span>;
  return null;
}
function Arrow({dir}){return<span style={{color:dir==="up"?C.green:dir==="down"?C.red:C.muted,fontSize:14}}>{dir==="up"?"↑":dir==="down"?"↓":"→"}</span>;}
function rankColor(i){return i===0?C.accent:i===1?"#C0C0C0":i===2?"#CD7F32":C.muted;}

// Info popover component
function InfoPop({k}){
  const [open,setOpen]=useState(false);
  const g=GLOSSARY[k];
  if(!g)return null;
  return<span style={{position:"relative",display:"inline-flex",alignItems:"center"}}>
    <button onClick={e=>{e.stopPropagation();setOpen(o=>!o);}} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",padding:"0 3px",lineHeight:1}}>ⓘ</button>
    {open&&<>
      <div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,zIndex:300}}/>
      <div style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",background:C.card,border:`1px solid ${C.accent}`,borderRadius:10,padding:"11px 13px",zIndex:301,width:220,boxShadow:"0 4px 20px #00000066"}}>
        <div style={{fontSize:11,fontWeight:700,color:C.accent,marginBottom:5}}>{g.label}</div>
        <div style={{fontSize:12,color:C.text,lineHeight:1.55}}>{g.def}</div>
        <div style={{position:"absolute",bottom:-6,left:"50%",transform:"translateX(-50%)",width:10,height:10,background:C.card,border:`1px solid ${C.accent}`,borderBottom:"none",borderRight:"none",transform:"translateX(-50%) rotate(225deg)"}}/>
      </div>
    </>}
  </span>;
}

function StatBox({label,value,sub,accent=false,glossaryKey}){
  return<div style={{background:C.surface,border:`1px solid ${accent?C.accent+"55":C.border}`,borderRadius:10,padding:"11px 12px",flex:1,minWidth:0}}>
    <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>
      {label}{glossaryKey&&<InfoPop k={glossaryKey}/>}
    </div>
    <div style={{...DS,fontSize:accent?28:22,fontWeight:800,color:accent?C.accent:C.text,lineHeight:1}}>{value??<span style={{color:C.muted}}>—</span>}</div>
    {sub&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{sub}</div>}
  </div>;
}

function LockedCard({player,gameCount}){
  const needed=MIN_GAMES-gameCount;
  return<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 14px",display:"flex",alignItems:"center",gap:12,opacity:0.6}}>
    <span style={{...DS,fontSize:20,fontWeight:800,color:C.muted,width:28,flexShrink:0,textAlign:"center"}}>—</span>
    <div style={{flex:1}}>
      <div style={{fontWeight:600,fontSize:14,color:C.textDim}}>{player}</div>
      <div style={{fontSize:11,color:C.muted,marginTop:2}}>Bowl {needed} more game{needed!==1?"s":""} to unlock insights</div>
    </div>
    <div style={{fontSize:18,opacity:0.4}}>🔒</div>
  </div>;
}

// ─── NAV ───────────────────────────────────────────────────────────────────────
const BOTTOM_TABS=[
  {id:"home",l:"Home",icon:"🏠"},
  {id:"standings",l:"Standings",icon:"🏆"},
  {id:"players",l:"Players",icon:"🎳"},
  {id:"scores",l:"Scores",icon:"📋"},
  {id:"records",l:"All Time",icon:"⭐"},
];
const MORE_PAGES=[
  {id:"sessions",l:"Sessions",icon:"📅"},
  {id:"records",l:"All Time",icon:"⭐"},
];

function Nav({page,setPage,season,setSeason}){
  function go(id){setPage(id);}
  return<>
    <nav style={{background:C.surface+"F8",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:680,margin:"0 auto",padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:48}}>
        <button onClick={()=>go("home")} style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:0}}>
          <span style={{fontSize:17}}>🎳</span>
          <span style={{...DS,fontSize:15,fontWeight:800,color:C.accent,letterSpacing:"0.03em"}}>Bowling for the Gënts</span>
        </button>
        <select value={season} onChange={e=>setSeason(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text,padding:"5px 8px",borderRadius:7,fontSize:11,outline:"none",cursor:"pointer"}}>
          <option value="S2">Season 2</option>
          <option value="S1">Season 1</option>
        </select>
      </div>
    </nav>
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:C.surface+"F8",backdropFilter:"blur(12px)",borderTop:`1px solid ${C.border}`,display:"flex",paddingBottom:"env(safe-area-inset-bottom)"}}>
      {BOTTOM_TABS.map(t=>{
        const active=page===t.id;
        return<button key={t.id} onClick={()=>go(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,padding:"10px 4px 8px",background:"none",border:"none",cursor:"pointer",color:active?C.accent:C.muted,minHeight:54,position:"relative"}}>
          {active&&<span style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,background:C.accent,borderRadius:1}}/>}
          <span style={{fontSize:19,lineHeight:1}}>{t.icon}</span>
          <span style={{fontSize:9,fontWeight:active?700:400,whiteSpace:"nowrap"}}>{t.l}</span>
        </button>;
      })}
    </div>
    <div style={{height:54}}/>
  </>;
}

// ─── HOME ──────────────────────────────────────────────────────────────────────
// Development scoring constants
const DEV_BASE = {
  alltime_pb: 100,
  season_high: 75,
  top5_record: 75,
  hot_streak: 60,
  upswing: 45,
  cold_streak: 48,
  downswing: 35,
};

function devRecency(eventDate, magnitudeScore, allDates){
  // allDates = sorted array of all session dates in current season
  const idx = allDates.indexOf(eventDate);
  const sessionsAgo = idx === -1 ? 99 : allDates.length - 1 - idx;
  if(sessionsAgo === 0) return 1.0;
  // exponential decay, magnitude extends shelf life
  return Math.exp(-sessionsAgo * 0.10 * (1 - magnitudeScore * 0.5));
}

function buildDevelopments(games, stats, season){
  const sg = games.filter(g => g.season === season);
  const allDates = [...new Set(sg.map(g => g.date))].sort();
  const allTimeGames = games; // for PB check

  const raw = [];

  stats.forEach(st => {
    if(!st.rawGames || st.gameCount < 2) return;
    const pg = st.rawGames; // already sorted oldest->newest
    const scores = st.scores;
    const avg = st.avg;
    const lastDate = pg[pg.length-1]?.date;

    // All-time high across both seasons
    const allTimeHigh = Math.max(...allTimeGames.filter(g=>g.player===st.player).map(g=>g.score));
    const recentScores = scores.slice(-3);

    // All-time personal best
    if(st.high >= allTimeHigh && recentScores.includes(st.high)){
      const highGame = [...pg].reverse().find(g => g.score === st.high);
      const mag = Math.min(1.0, (st.high - 80) / 150);
      const rec = devRecency(highGame?.date, mag, allDates);
      raw.push({
        player: st.player, category: 'alltime_pb',
        text: `${st.player} set an all-time personal best of ${st.high}`,
        icon: '🎳', bc: '#E8C84A',
        date: highGame?.date, mag, rec,
        score: DEV_BASE.alltime_pb * mag * rec,
      });
    }
    // Season high (not all-time)
    else if(recentScores.includes(st.high) && st.high < allTimeHigh){
      const highGame = [...pg].reverse().find(g => g.score === st.high);
      const mag = Math.min(1.0, (st.high - 80) / 150);
      const rec = devRecency(highGame?.date, mag, allDates);
      raw.push({
        player: st.player, category: 'season_high',
        text: `${st.player} hit a season high of ${st.high}`,
        icon: '🎳', bc: '#E8C84A',
        date: highGame?.date, mag, rec,
        score: DEV_BASE.season_high * mag * rec,
      });
    }

    // Hot streak
    if(st.hasEnough && st.momentum != null && st.momentum >= 5){
      const mag = Math.min(1.0, st.momentum / 20);
      const rec = devRecency(lastDate, mag, allDates);
      raw.push({
        player: st.player, category: 'hot_streak',
        text: `${st.player} is on fire — last 5 avg ${st.last5?.toFixed(1)} vs ${avg?.toFixed(1)} season avg`,
        icon: '🔥', bc: '#E85A4A',
        date: lastDate, mag, rec,
        score: DEV_BASE.hot_streak * mag * rec,
      });
    }

    // Cold streak
    if(st.hasEnough && st.momentum != null && st.momentum <= -5){
      const mag = Math.min(1.0, Math.abs(st.momentum) / 20);
      const rec = devRecency(lastDate, mag, allDates);
      raw.push({
        player: st.player, category: 'cold_streak',
        text: `${st.player} is running cold — last 5 avg ${st.last5?.toFixed(1)} vs ${avg?.toFixed(1)} season avg`,
        icon: '❄️', bc: '#5B9CF6',
        date: lastDate, mag, rec,
        score: DEV_BASE.cold_streak * mag * rec,
      });
    }

    // Session swings — consecutive games within same night
    const byDate = {};
    pg.forEach(g => { if(!byDate[g.date]) byDate[g.date] = []; byDate[g.date].push(g); });
    let bestUp = null, bestDown = null;
    Object.entries(byDate).forEach(([date, dg]) => {
      if(dg.length < 2) return;
      const sorted = [...dg].sort((a,b) => (a.ts??a.id)-(b.ts??b.id));
      for(let i = 1; i < sorted.length; i++){
        const diff = sorted[i].score - sorted[i-1].score;
        if(diff >= 30 && (!bestUp || diff > bestUp.swing))
          bestUp = {swing:diff, date, from:sorted[i-1].score, to:sorted[i].score};
        if(-diff >= 30 && (!bestDown || -diff > bestDown.swing))
          bestDown = {swing:-diff, date, from:sorted[i-1].score, to:sorted[i].score};
      }
    });
    if(bestUp){
      const mag = Math.min(1.0, bestUp.swing / 80);
      const rec = devRecency(bestUp.date, mag, allDates);
      raw.push({
        player: st.player, category: 'upswing',
        text: `${st.player} bounced back ${bestUp.swing} pins in one session (${bestUp.from}→${bestUp.to})`,
        icon: '📈', bc: '#3DD68C',
        date: bestUp.date, mag, rec,
        score: DEV_BASE.upswing * mag * rec,
      });
    }
    if(bestDown){
      const mag = Math.min(1.0, bestDown.swing / 80);
      const rec = devRecency(bestDown.date, mag, allDates);
      raw.push({
        player: st.player, category: 'downswing',
        text: `${st.player} dropped ${bestDown.swing} pins in one session (${bestDown.from}→${bestDown.to})`,
        icon: '📉', bc: '#E85A4A',
        date: bestDown.date, mag, rec,
        score: DEV_BASE.downswing * mag * rec,
      });
    }
  });

  // Deduplicate: best score per player+category
  const seen = {};
  raw.forEach(d => {
    const key = `${d.player}_${d.category}`;
    if(!seen[key] || d.score > seen[key].score) seen[key] = d;
  });

  return Object.values(seen).sort((a,b) => b.score - a.score);
}

function fds(d){
  if(!d) return '';
  return new Date(d+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'});
}

function HomePage({games,season,setPage,setFP}){
  const grp=useMemo(()=>groupStats(games,season),[games,season]);
  const stats=useMemo(()=>getStats(games,season),[games,season]);
  const qualified=stats.filter(s=>s.hasEnough);
  const leader=qualified[0];
  const devs=useMemo(()=>buildDevelopments(games,stats,season).slice(0,5),[games,stats,season]);
  const hot=useMemo(()=>qualified.filter(s=>s.hc==="hot").sort((a,b)=>(b.momentum||0)-(a.momentum||0)),[qualified]);
  const cold=useMemo(()=>qualified.filter(s=>s.hc==="cold").sort((a,b)=>(a.momentum||0)-(b.momentum||0)),[qualified]);

  return<div>
    <div style={{background:`linear-gradient(160deg,${C.bg} 0%,#161020 60%,${C.bg} 100%)`,padding:"22px 16px 18px",textAlign:"center",borderBottom:`1px solid ${C.border}`}}>
      <h1 style={{...DS,fontSize:34,fontWeight:800,color:C.accent,letterSpacing:"-0.01em",lineHeight:1,margin:"0 0 4px"}}>Bowling for the Gënts</h1>
      <p style={{color:C.muted,fontSize:12,marginBottom:14}}>{season==="S2"?"Season 2":"Season 1"} · {grp.sessions} sessions · {grp.active} players · {grp.total} games</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxWidth:360,margin:"0 auto"}}>
        <div style={{background:C.card,border:`1px solid ${C.accent}55`,borderRadius:12,padding:"12px 8px",gridColumn:"1/-1"}}>
          <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Group Average</div>
          <div style={{...DS,fontSize:38,fontWeight:800,color:C.accent,lineHeight:1}}>{grp.avg?.toFixed(1)||"—"}</div>
        </div>
        {[{l:"Season High",v:grp.high||"—"},{l:"Sessions",v:grp.sessions},{l:"Games Bowled",v:grp.total},{l:"Active Players",v:grp.active}].map(k=><div key={k.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 8px"}}>
          <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k.l}</div>
          <div style={{...DS,fontSize:24,fontWeight:800,color:C.text,lineHeight:1}}>{k.v}</div>
        </div>)}
      </div>
    </div>
    <div style={{padding:"14px 14px",maxWidth:640,margin:"0 auto"}}>
      {/* Recent Developments */}
      {devs.length>0&&<div style={{marginBottom:18}}>
        <div style={{...DS,fontSize:16,fontWeight:800,color:C.text,marginBottom:9}}>Recent Developments</div>
        {devs.map((d,i)=><div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${d.bc}`,borderRadius:10,padding:"10px 13px",display:"flex",gap:10,alignItems:"center",marginBottom:5}}>
          <span style={{fontSize:14,lineHeight:1,flexShrink:0}}>{d.icon}</span>
          <p style={{fontSize:12,color:C.text,lineHeight:1.45,margin:0,flex:1}}>{d.text}</p>
          <span style={{fontSize:10,color:C.muted,flexShrink:0,marginLeft:6,whiteSpace:"nowrap"}}>{fds(d.date)}</span>
        </div>)}
      </div>}

      {/* Season Leader */}
      {leader&&<div onClick={()=>{setFP(leader.player);setPage("players");}} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.accent}`,borderRadius:12,padding:"13px 15px",marginBottom:8,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:9,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:".09em",marginBottom:3}}>🏆 Season Leader</div>
          <div style={{...DS,fontSize:26,fontWeight:800}}>{leader.player}</div>
          <div style={{color:C.muted,fontSize:12,marginTop:2}}>{leader.avg?.toFixed(1)} avg · {leader.gameCount} games</div>
        </div>
        <div style={{textAlign:"right"}}><StatusPill s={leader.hc}/><div style={{...DS,fontSize:22,fontWeight:800,color:C.accent,marginTop:5}}>{leader.high}</div><div style={{fontSize:10,color:C.muted}}>high</div></div>
      </div>}

      {/* Hot and Cold */}
      {(hot.length>0||cold.length>0)&&<div style={{display:"grid",gridTemplateColumns:hot.length&&cold.length?"1fr 1fr":"1fr",gap:8,marginBottom:8}}>
        {hot.length>0&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.red}`,borderRadius:12,padding:"12px 13px"}}>
          <div style={{fontSize:10,color:C.red,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>🔥 Hot</div>
          {hot.map(p=><div key={p.player} onClick={()=>{setFP(p.player);setPage("players");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
            <span style={{fontWeight:600,fontSize:13}}>{p.player}</span>
            <span style={{color:C.red,fontSize:13,...DS,fontWeight:700}}>{p.momentum!=null?(p.momentum>0?"+":"")+p.momentum.toFixed(1):""}</span>
          </div>)}
        </div>}
        {cold.length>0&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${C.blue}`,borderRadius:12,padding:"12px 13px"}}>
          <div style={{fontSize:10,color:C.blue,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>❄️ Cold</div>
          {cold.map(p=><div key={p.player} onClick={()=>{setFP(p.player);setPage("players");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
            <span style={{fontWeight:600,fontSize:13}}>{p.player}</span>
            <span style={{color:C.blue,fontSize:13,...DS,fontWeight:700}}>{p.momentum!=null?(p.momentum>0?"+":"")+p.momentum.toFixed(1):""}</span>
          </div>)}
        </div>}
      </div>}

      <button onClick={()=>setPage("standings")} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,borderRadius:10,padding:"12px",color:C.accent,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:4}}>View Full Standings →</button>

      {/* Glossary */}
      <div style={{marginTop:22,paddingTop:18,borderTop:`1px solid ${C.border}`}}>
        <div style={{...DS,fontSize:15,fontWeight:800,color:C.text,marginBottom:12}}>📖 Glossary</div>

        {[
          {stat:"Average",min:1,def:"Mean score across all games this season."},
          {stat:"High / Low Game",min:1,def:"Your best and worst single game of the season."},
          {stat:"Games Played",min:1,def:"Total individual games bowled. Each lane counts as one game."},
          {stat:"Last 5 Avg",min:5,def:"Average of your 5 most recent games — the best quick read on how you're bowling right now."},
          {stat:"Momentum",min:6,def:"Last 5 avg minus your season avg. Positive = you're above your baseline lately. Negative = below it. Formula: Last5Avg − SeasonAvg."},
          {stat:"Consistency (Std Dev)",min:2,def:"How much your scores jump around. Lower = more predictable. Calculated as the standard deviation of all your scores."},
          {stat:"Best Stretch",min:5,def:"Your highest 5-game rolling average — your peak run of the season."},
          {stat:"Hot 🔥",min:6,def:"Momentum ≥ +5. Your last 5 are meaningfully above your season average."},
          {stat:"Cold ❄️",min:6,def:"Momentum ≤ −5. Your last 5 are meaningfully below your season average."},
          {stat:"Best / Worst Night",min:1,def:"Session where your average across all games that night was highest or lowest."},
          {stat:"Biggest Swing",min:1,def:"Largest score change between two consecutive games on the same night. Upward = big comeback. Downward = big collapse."},
          {stat:"Wins",min:3,def:"Games where you had the highest score among all players. Requires 3+ participants in that game."},
          {stat:"Win Rate",min:6,def:"Wins divided by total games played, as a percentage."},
          {stat:"Avg Placement",min:6,def:"Your average finishing position across all games. 1st = best score that game. Lower number = better."},
          {stat:"Avg Opponents Per Win/Loss",min:6,def:"Average number of other players in games you won or lost. Higher = you tend to win/lose in bigger fields."},
          {stat:"Weighted Expected Wins",min:6,def:"Not used — we kept it simple."},
          {stat:"Hot Streak",min:6,def:"Consecutive games where your score was above your season average."},
          {stat:"Cold Streak",min:6,def:"Consecutive games where your score was below your season average."},
          {stat:"Group Game Score",min:1,def:"Average score across all players in a single game row. Used to rank the best and worst group performances."},
        ].filter(g=>g.stat!=="Weighted Expected Wins").map((g,i)=><div key={i} style={{
          padding:"10px 0",
          borderBottom:`1px solid ${C.border}`,
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:3}}>
            <span style={{fontWeight:700,fontSize:13,color:C.text}}>{g.stat}</span>
            {g.min>1&&<span style={{fontSize:10,color:C.muted,background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:"2px 8px",whiteSpace:"nowrap",flexShrink:0}}>{g.min}+ games</span>}
          </div>
          <p style={{fontSize:12,color:C.muted,lineHeight:1.5,margin:0}}>{g.def}</p>
        </div>)}
      </div>
    </div>
  </div>;
}

// ─── STANDINGS ─────────────────────────────────────────────────────────────────
function StandingsPage({games,season,setPage,setFP}){
  const stats=useMemo(()=>getStats(games,season),[games,season]);
  const wpStats=useMemo(()=>calcWinsAndPlacement(games,season),[games,season]);
  const [sortBy,setSortBy]=useState("avg");

  const sorted=useMemo(()=>[...stats].sort((a,b)=>{
    if(sortBy==="avg")return(b.avg||0)-(a.avg||0);
    if(sortBy==="high")return(b.high||0)-(a.high||0);
    if(sortBy==="last5")return(b.last5||-999)-(a.last5||-999);
    if(sortBy==="momentum")return(b.momentum??-999)-(a.momentum??-999);
    if(sortBy==="stretch")return(b.stretch?.avg||0)-(a.stretch?.avg||0);
    if(sortBy==="cons")return(a.stdDev??999)-(b.stdDev??999);
    if(sortBy==="games")return(b.gameCount||0)-(a.gameCount||0);
    if(sortBy==="wins")return(wpStats[b.player]?.wins||0)-(wpStats[a.player]?.wins||0);
    return 0;
  }),[stats,sortBy,wpStats]);

  const SORT_COLS=[
    {id:"avg",l:"Avg"},
    {id:"high",l:"High"},
    {id:"last5",l:"Last 5"},
    {id:"momentum",l:"Momentum"},
    {id:"stretch",l:"Stretch"},
    {id:"cons",l:"Consistency"},
    {id:"games",l:"Games"},
    {id:"wins",l:"Wins"},
  ];

  function mainVal(s){
    if(sortBy==="avg")return s.avg!=null?s.avg.toFixed(1):"—";
    if(sortBy==="high")return s.high||"—";
    if(sortBy==="last5")return s.last5!=null?s.last5.toFixed(1):"—";
    if(sortBy==="momentum")return s.momentum!=null?fdelta(s.momentum):"—";
    if(sortBy==="stretch")return s.stretch?.avg!=null?s.stretch.avg.toFixed(1):"—";
    if(sortBy==="cons")return s.stdDev!=null?`±${s.stdDev.toFixed(1)}`:"—";
    if(sortBy==="games")return s.gameCount||0;
    if(sortBy==="wins")return wpStats[s.player]?.wins||0;
    return"—";
  }
  function mainColor(s){
    if(sortBy==="momentum")return s.momentum==null?"—":s.momentum>0?C.green:s.momentum<0?C.red:C.muted;
    return C.accent;
  }
  function subtitle(s){
    if(sortBy==="avg")return`${s.gameCount} game${s.gameCount!==1?"s":""}`;
    if(sortBy==="high"){
      const g=s.rawGames?.find(g=>g.score===s.high);
      return g?fd(g.date):`${s.gameCount} games`;
    }
    if(sortBy==="last5")return s.avg!=null?`vs ${s.avg.toFixed(1)} season avg`:`${s.gameCount} games`;
    if(sortBy==="momentum")return s.last5!=null?`${s.last5.toFixed(1)} last 5 vs ${s.avg?.toFixed(1)} avg`:"needs 6+ games";
    if(sortBy==="stretch")return"best 5-game run";
    if(sortBy==="cons")return s.avg!=null?`avg ${s.avg.toFixed(1)}`:`${s.gameCount} games`;
    if(sortBy==="games")return s.avg!=null?`${s.avg.toFixed(1)} avg`:"no avg yet";
    if(sortBy==="wins"){const wr=wpStats[s.player];return wr?.totalGames>0?`${((wr.wins||0)/wr.totalGames*100).toFixed(1)}% win rate`:"0 wins";}
    return`${s.gameCount} games`;
  }

  return<div style={{maxWidth:640,margin:"0 auto",padding:"14px 14px"}}>
    {/* Sort pills */}
    <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:3}}>
      {SORT_COLS.map(col=><button key={col.id} onClick={()=>setSortBy(col.id)} style={{background:sortBy===col.id?C.accent:C.card,border:`1px solid ${sortBy===col.id?C.accent:C.border}`,color:sortBy===col.id?C.bg:C.text,padding:"7px 13px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{col.l}</button>)}
    </div>

    {/* Player rows */}
    {sorted.map((s,i)=>{
      // per-stat lock logic
      const statLocked=(sortBy==="momentum"&&!s.canMomentum)||(sortBy==="stretch"&&!s.canStretch)||(sortBy==="cons"&&!s.canCons)||(sortBy==="last5"&&!s.canLast5)||(sortBy==="wins"&&s.gameCount<MIN_GAMES);
      const dimmed=statLocked;
      return<div key={s.player} onClick={()=>{setFP(s.player);setPage("players");}} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"12px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:12,cursor:"pointer",opacity:dimmed?0.65:1}}>
        <span style={{...DS,fontSize:20,fontWeight:800,color:statLocked?C.muted:rankColor(i),width:26,flexShrink:0,textAlign:"center"}}>{statLocked?"—":i+1}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
            <span style={{fontWeight:700,fontSize:14}}>{s.player}</span>
            <StatusPill s={s.hc}/>
          </div>
          <div style={{color:C.muted,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
            {statLocked?`bowl ${Math.max(1,(sortBy==="momentum"?MIN_GAMES:sortBy==="stretch"?5:sortBy==="cons"?2:5)-s.gameCount)} more to rank here`:subtitle(s)}
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{...DS,fontSize:22,fontWeight:800,color:statLocked?C.muted:mainColor(s)}}>
            {statLocked?"—":mainVal(s)}
          </div>
        </div>
      </div>;
    })}
  </div>;
}

// ─── PLAYERS ───────────────────────────────────────────────────────────────────
function PlayersPage({games,players,season,focusPlayer,setFP}){
  const stats=useMemo(()=>getStats(games,season),[games,season]);
  const sel=focusPlayer||PLAYERS[0];
  const ps=useMemo(()=>calcStats(games,sel,season),[games,sel,season]);
  const chartData=useMemo(()=>ps?.rawGames?.map((g,i)=>({n:i+1,score:g.score,rolling:ps.roll[i]!=null?+ps.roll[i].toFixed(1):undefined}))||[],[ps]);

  return<div style={{maxWidth:640,margin:"0 auto"}}>
    {/* Horizontal player selector */}
    <div style={{overflowX:"auto",padding:"10px 14px 8px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{display:"flex",gap:6,width:"max-content"}}>
        {players.map(p=>{
          const ps2=stats.find(x=>x.player===p);
          const active=sel===p;
          return<button key={p} onClick={()=>setFP(p)} style={{background:active?C.accent:"none",border:`1px solid ${active?C.accent:C.border}`,borderRadius:20,padding:"7px 13px",color:active?C.bg:C.text,fontSize:12,fontWeight:active?700:400,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
            {p}{ps2?.hasEnough?` ${ps2.avg?.toFixed(0)}`:""}
            {ps2?.hc==="hot"?" 🔥":ps2?.hc==="cold"?" ❄️":""}
          </button>;
        })}
      </div>
    </div>

    {!ps||ps.gameCount===0
      ?<div style={{padding:40,textAlign:"center",color:C.muted}}>No games recorded for {sel} in {season==="S2"?"Season 2":"Season 1"}.</div>
      :!ps.hasEnough
        ?<div style={{padding:"14px 14px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <div>
              <h1 style={{...DS,fontSize:34,fontWeight:800,lineHeight:1,margin:"0 0 7px"}}>{ps.player}</h1>
              <Pill label={`${ps.gameCount} games · ${MIN_GAMES-ps.gameCount} to unlock insights`} color={C.muted}/>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div style={{background:C.surface,border:`1px solid ${C.accent}55`,borderRadius:10,padding:"11px 12px",gridColumn:"1/-1"}}>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>Season Avg<InfoPop k="avg"/></div>
              <div style={{...DS,fontSize:36,fontWeight:800,color:C.accent,lineHeight:1}}>{ps.avg?.toFixed(1)}</div>
            </div>
            {[{l:"High Game",v:ps.high,gk:"high"},{l:"Low Game",v:ps.low,gk:"low"},{l:"Games",v:ps.gameCount,gk:"gameCount"}].map(k=><div key={k.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>{k.l}{k.gk&&<InfoPop k={k.gk}/>}</div>
              <div style={{...DS,fontSize:22,fontWeight:800,lineHeight:1}}>{k.v??<span style={{color:C.muted}}>—</span>}</div>
            </div>)}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"14px 16px",textAlign:"center"}}>
            <div style={{fontSize:20,marginBottom:8}}>🔒</div>
            <div style={{fontSize:13,color:C.muted}}>Bowl {MIN_GAMES-ps.gameCount} more game{MIN_GAMES-ps.gameCount!==1?"s":""} to unlock momentum, consistency, trend, and hot/cold status</div>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginTop:10}}>
            <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Every Game</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {ps.rawGames.map((g,i)=><div key={i} style={{background:g.score===ps.high?C.accent+"22":C.surface,border:`1px solid ${g.score===ps.high?C.accent:C.border}`,borderRadius:7,padding:"5px 8px",textAlign:"center",minWidth:42}}>
                <div style={{...DS,fontSize:16,fontWeight:800,color:g.score===ps.high?C.accent:C.text}}>{g.score}</div>
                <div style={{fontSize:8,color:C.muted}}>{fd(g.date)}</div>
              </div>)}
            </div>
          </div>
        </div>
      :<div style={{padding:"14px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <h1 style={{...DS,fontSize:34,fontWeight:800,lineHeight:1,margin:"0 0 7px"}}>{ps.player}</h1>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              <StatusPill s={ps.hc}/>
              {ps.trend==="up"&&<Pill label="↑ Climbing" color={C.green}/>}
              <Pill label={`${ps.gameCount} games`} color={C.blue}/>
            </div>
          </div>
        </div>
        {/* Main stats grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
          <div style={{background:C.surface,border:`1px solid ${C.accent}55`,borderRadius:10,padding:"11px 12px",gridColumn:"1/-1",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>Season Avg<InfoPop k="avg"/></div>
              <div style={{...DS,fontSize:36,fontWeight:800,color:C.accent,lineHeight:1}}>{ps.avg?.toFixed(1)}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3}}>Recent Form<InfoPop k="momentum"/></div>
              <div style={{...DS,fontSize:28,fontWeight:800,color:ps.momentum>0?C.green:ps.momentum<0?C.red:C.text,lineHeight:1}}>{fdelta(ps.momentum)}</div>
              <div style={{fontSize:10,color:C.muted}}>last 5 vs avg</div>
            </div>
          </div>
          {[
            {l:"Last 5 Avg",v:ps.last5?.toFixed(1),s:ps.avg!=null?`vs ${ps.avg.toFixed(1)} season avg`:null,gk:"last5"},
            {l:"High Game",v:ps.high,s:ps.rawGames?fd(ps.rawGames.find(g=>g.score===ps.high)?.date):null,gk:"high"},
            {l:"Low Game",v:ps.low,s:ps.rawGames?fd(ps.rawGames.find(g=>g.score===ps.low)?.date):null,gk:"low"},
            {l:"Consistency",v:ps.stdDev!=null?`±${ps.stdDev.toFixed(1)}`:null,s:ps.avg!=null?`avg ${ps.avg.toFixed(1)}`:null,gk:"stdDev"},
            {l:"Best Stretch",v:ps.stretch?.avg?.toFixed(1),s:ps.stretch?.startDate?`${fd(ps.stretch.startDate)} – ${fd(ps.stretch.endDate||ps.stretch.startDate)}`:"5-game avg",gk:"stretch"},
            {l:"Games",v:ps.gameCount,s:season==="S2"?"Season 2":"Season 1",gk:"gameCount"},
          ].map(k=><div key={k.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>{k.l}{k.gk&&<InfoPop k={k.gk}/>}</div>
            <div style={{...DS,fontSize:22,fontWeight:800,lineHeight:1}}>{k.v??<span style={{color:C.muted}}>—</span>}</div>
            {k.s&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{k.s}</div>}
          </div>)}
        </div>
        {/* Extra stats */}
        {(ps.swing||ps.bestDay)&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
          {ps.bestDay&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>Best Night<InfoPop k="bestNight"/></div>
            <div style={{...DS,fontSize:22,fontWeight:800,lineHeight:1}}>{ps.bestDay.avg?.toFixed(1)}</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{fd(ps.bestDay.date)}</div>
          </div>}
          {ps.swing&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
            <div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2,display:"flex",alignItems:"center",gap:3}}>Biggest Swing<InfoPop k="swing"/></div>
            <div style={{...DS,fontSize:22,fontWeight:800,lineHeight:1}}>{ps.swing.swing}p</div>
            <div style={{fontSize:10,color:C.muted,marginTop:2}}>{fd(ps.swing.date)}</div>
          </div>}
        </div>}
        {/* Chart */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px",marginBottom:11}}>
          <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Score History + Rolling 5-Game Avg</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{top:4,right:6,bottom:2,left:-20}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="n" stroke={C.muted} tick={{fill:C.muted,fontSize:10}}/>
              <YAxis stroke={C.muted} tick={{fill:C.muted,fontSize:10}} domain={["auto","auto"]}/>
              <Tooltip contentStyle={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,fontSize:12}} labelStyle={{color:C.muted}} itemStyle={{color:C.text}} formatter={(v,n)=>[v,n==="score"?"Score":"5-Game Avg"]} labelFormatter={v=>`Game ${v}`}/>
              {ps.avg&&<ReferenceLine y={ps.avg} stroke={C.accentDim} strokeDasharray="4 3" label={{value:`${ps.avg?.toFixed(1)}`,fill:C.accentDim,fontSize:9,position:"right"}}/>}
              <Line type="monotone" dataKey="score" stroke={C.border} strokeWidth={1.5} dot={{fill:C.muted,r:2}} activeDot={{r:4}}/>
              <Line type="monotone" dataKey="rolling" stroke={C.accent} strokeWidth={2.5} dot={false} connectNulls/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Score log — individual games */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px"}}>
          <div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Every Game</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {ps.rawGames.map((g,i)=><div key={i} style={{background:g.score===ps.high?C.accent+"22":C.surface,border:`1px solid ${g.score===ps.high?C.accent:C.border}`,borderRadius:7,padding:"5px 8px",textAlign:"center",minWidth:42}}>
              <div style={{...DS,fontSize:16,fontWeight:800,color:g.score===ps.high?C.accent:g.score>=(ps.avg+10)?C.green:g.score<=(ps.avg-10)?C.red:C.text}}>{g.score}</div>
              <div style={{fontSize:8,color:C.muted}}>{fd(g.date)}</div>
            </div>)}
          </div>
        </div>
      </div>
    }
  </div>;
}

// ─── SCORE SHEET ───────────────────────────────────────────────────────────────
function ScoresPage({games,season,addGame,updateGame,deleteGame}){
  const today=new Date().toISOString().split("T")[0];
  const [newDate,setNewDate]=useState(today);
  const [newSeason,setNewSeason]=useState(season||"S2");
  const [saved,setSaved]=useState(false);
  const [pendingRows,setPendingRows]=useState([]); // {date, season, rowIndex}
  const idRef=useRef(Date.now());

  // Update newSeason when global season changes
  useEffect(()=>setNewSeason(season),[season]);

  // Sort players left-to-right by most games played in current season
  const orderedPlayers=useMemo(()=>{
    const counts={};
    games.filter(g=>g.season===season).forEach(g=>{counts[g.player]=(counts[g.player]||0)+1;});
    return [...PLAYERS].sort((a,b)=>(counts[b]||0)-(counts[a]||0));
  },[games,season]);

  const filtered=useMemo(()=>
    games.filter(g=>g.season===season)
  ,[games,season]);

  // Build lookup and rows: most recent date first, within date most recent game on top
  const {rows,lookup}=useMemo(()=>{
    const byDate={};
    filtered.forEach(g=>{
      if(!byDate[g.date])byDate[g.date]={season:g.season,byPlayer:{}};
      const bp=byDate[g.date].byPlayer;
      if(!bp[g.player])bp[g.player]=[];
      bp[g.player].push(g);
    });
    // Sort each player's games by ts ascending
    Object.values(byDate).forEach(({byPlayer})=>{
      Object.values(byPlayer).forEach(arr=>arr.sort((a,b)=>(a.ts??a.id)-(b.ts??b.id)));
    });
    // Add pending rows that aren't already in data
    pendingRows.forEach(pr=>{
      if(!byDate[pr.date])byDate[pr.date]={season:pr.season,byPlayer:{}};
    });
    // Build rows most recent first, within date most recent on top
    const rowList=[];
    const map={};
    // get max rows needed per date including pending
    const pendingByDate={};
    pendingRows.forEach(pr=>{
      if(!pendingByDate[pr.date])pendingByDate[pr.date]=0;
      pendingByDate[pr.date]++;
    });
    Object.entries(byDate).sort(([a],[b])=>new Date(b)-new Date(a)).forEach(([date,{season,byPlayer}])=>{
      const dataMaxRows=Object.values(byPlayer).length>0?Math.max(...Object.values(byPlayer).map(a=>a.length)):0;
      const pendingExtra=pendingByDate[date]||0;
      const maxRows=Math.max(dataMaxRows,1)+pendingExtra;
      for(let r=0;r<maxRows;r++){
        rowList.push({date,rowIndex:r,season});
        Object.entries(byPlayer).forEach(([player,gs])=>{
          const reversed=[...gs].reverse();
          if(reversed[r])map[`${date}_${r}_${player}`]=reversed[r];
        });
      }
    });
    return{rows:rowList,lookup:map};
  },[filtered,pendingRows]);

  function flash(){setSaved(true);setTimeout(()=>setSaved(false),1200);}

  function handleBlur(date,rowIndex,player,rowSeason,val){
    const key=`${date}_${rowIndex}_${player}`;
    const existing=lookup[key];
    const trimmed=val.trim();
    if(trimmed===""){
      if(existing){deleteGame(existing.id);flash();}
      return;
    }
    const score=parseInt(trimmed,10);
    if(isNaN(score)||score<0||score>300)return;
    if(existing){
      updateGame(existing.id,{date,player,score,season:rowSeason});
    } else {
      addGame({date,player,score,season:rowSeason});
    }
    flash();
  }

  function handleDateEdit(oldDate,newDateVal,rowSeason){
    const trimmed=newDateVal.trim();
    if(!trimmed||trimmed===oldDate)return;
    // Update all games on this date
    games.filter(g=>g.date===oldDate&&g.season===rowSeason).forEach(g=>{
      updateGame(g.id,{...g,date:trimmed});
    });
    flash();
  }

  function addRow(){
    if(!newDate)return;
    setPendingRows(prev=>[...prev,{date:newDate,season:newSeason}]);
  }

  const dateGroups=useMemo(()=>{
    const seen=new Set(),idx={};
    rows.forEach((r)=>{if(!seen.has(r.date)){seen.add(r.date);idx[r.date]=Object.keys(idx).length;}});
    return idx;
  },[rows]);

  const CW=56;

  return<div style={{padding:"10px 0"}}>
    <div style={{display:"flex",gap:8,alignItems:"center",padding:"0 14px",marginBottom:6}}>
      <div style={{...DS,fontSize:16,fontWeight:800,color:C.text,flex:1}}>Score Sheet</div>
      {saved&&<span style={{fontSize:11,color:C.green,fontWeight:600}}>✓ Saved</span>}
    </div>
    <div style={{fontSize:11,color:C.muted,padding:"0 14px",marginBottom:8}}>Tap a cell · clear to delete · Tab or Enter to move · tap date to edit</div>

    {/* Add row */}
    <div style={{padding:"0 14px 10px",display:"flex",gap:8,alignItems:"center"}}>
      <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)}
        style={{background:C.surface,border:`1px solid ${C.accent}`,borderRadius:8,color:C.text,padding:"8px 10px",fontSize:13,outline:"none",flex:1}}/>
      <button onClick={addRow}
        style={{background:C.accent,border:"none",color:C.bg,padding:"8px 16px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>
        + Add Row
      </button>
    </div>

    <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      <table style={{borderCollapse:"collapse",tableLayout:"fixed"}}>
        <colgroup>
          <col style={{width:84}}/>
          {orderedPlayers.map(p=><col key={p} style={{width:CW}}/>)}
        </colgroup>
        <thead>
          <tr style={{background:C.surface}}>
            <th style={{padding:"7px 8px",fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.04em",borderBottom:`1px solid ${C.border}`,textAlign:"left",position:"sticky",left:0,zIndex:3,background:C.surface,whiteSpace:"nowrap"}}>Date</th>
            {orderedPlayers.map(p=><th key={p} style={{padding:"7px 2px",fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.03em",borderBottom:`1px solid ${C.border}`,textAlign:"center",overflow:"hidden",whiteSpace:"nowrap",maxWidth:CW}} title={p}>{p.slice(0,5)}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,ri)=>{
            const isFirst=row.rowIndex===0;
            const dateIdx=dateGroups[row.date]??0;
            const rowBg=dateIdx%2===0?C.card:C.surface;
            return<tr key={`${row.date}_${row.rowIndex}`} style={{background:rowBg}}>
              <td style={{padding:"1px 4px",position:"sticky",left:0,zIndex:1,background:rowBg,minWidth:84,maxWidth:84,borderRight:`1px solid ${C.border}44`}}>
                {isFirst
                  ? <input
                      type="date"
                      defaultValue={row.date}
                      key={row.date}
                      onBlur={e=>handleDateEdit(row.date,e.target.value,row.season)}
                      onKeyDown={e=>{if(e.key==="Enter")e.target.blur();}}
                      style={{background:"transparent",border:"none",outline:"none",color:C.text,fontSize:11,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",width:"100%",padding:"5px 2px",cursor:"pointer"}}
                    />
                  : null
                }
              </td>
              {orderedPlayers.map(p=>{
                const game=lookup[`${row.date}_${row.rowIndex}_${p}`];
                const col=game?(game.score>=150?C.accent:game.score>=120?C.green:game.score<=80?C.red:C.text):C.muted+"33";
                return<td key={p} style={{padding:"0",textAlign:"center",maxWidth:CW}}>
                  <input
                    type="number" min={0} max={300}
                    defaultValue={game?.score??""}
                    key={`${game?.id??`${row.date}_${row.rowIndex}_${p}`}`}
                    placeholder="·"
                    onBlur={e=>handleBlur(row.date,row.rowIndex,p,row.season,e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"||e.key==="Tab")e.target.blur();}}
                    style={{background:"transparent",border:"none",outline:"none",color:col,fontSize:14,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",textAlign:"center",width:"100%",padding:"6px 1px",cursor:"text",minWidth:0}}
                  />
                </td>;
              })}
            </tr>;
          })}
        </tbody>
      </table>
    </div>
    <div style={{display:"flex",gap:12,padding:"8px 14px",fontSize:10,color:C.muted,flexWrap:"wrap"}}>
      <span><span style={{color:C.accent}}>■</span> 150+</span>
      <span><span style={{color:C.green}}>■</span> 120–149</span>
      <span><span style={{color:C.text}}>■</span> 81–119</span>
      <span><span style={{color:C.red}}>■</span> ≤80</span>
    </div>
  </div>;
}


function calcWinsAndPlacement(games, season){
  const filtered = season ? games.filter(g=>g.season===season) : games;
  const byDate = {};
  filtered.forEach(g=>{
    if(!byDate[g.date]) byDate[g.date] = {};
    if(!byDate[g.date][g.player]) byDate[g.date][g.player] = [];
    byDate[g.date][g.player].push(g);
  });
  Object.values(byDate).forEach(byPlayer=>{
    Object.values(byPlayer).forEach(gs=>{
      const hasRealTs=gs.some(g=>g.ts>10000);
      if(hasRealTs) gs.sort((a,b)=>(a.ts??0)-(b.ts??0));
    });
  });
  const stats = {};
  PLAYERS.forEach(p=>{ stats[p]={wins:0,losses:0,totalGames:0,totalPlace:0,placementGames:0,totalOpponentsInWins:0,totalOpponentsInLosses:0}; });
  Object.entries(byDate).forEach(([date, byPlayer])=>{
    const maxRows = Math.max(...Object.values(byPlayer).map(gs=>gs.length));
    for(let row=0; row<maxRows; row++){
      const rowGames = [];
      Object.entries(byPlayer).forEach(([player, gs])=>{
        if(gs[row]) rowGames.push({player, score:gs[row].score});
      });
      if(rowGames.length < 2) continue;
      const ranked = [...rowGames].sort((a,b)=>b.score-a.score);
      const winner = ranked[0];
      const opponents = rowGames.length - 1; // total players minus winner
      rowGames.forEach(({player})=>{
        const place = ranked.findIndex(r=>r.player===player) + 1;
        if(!stats[player]) stats[player]={wins:0,losses:0,totalGames:0,totalPlace:0,placementGames:0,totalOpponentsInWins:0,totalOpponentsInLosses:0};
        stats[player].totalGames++;
        stats[player].totalPlace += place;
        stats[player].placementGames++;
        // Win requires 3+ total participants (2+ opponents)
        if(player === winner.player && rowGames.length >= 3){
          stats[player].wins++;
          stats[player].totalOpponentsInWins += opponents;
        } else if(player !== winner.player && rowGames.length >= 3){
          stats[player].losses++;
          stats[player].totalOpponentsInLosses += opponents;
        }
      });
    }
  });
  return stats;
}
function RecordCard({cat,topColor}){
  return<div style={{background:"#181B25",border:"1px solid #252A38",borderRadius:12,padding:"13px 14px",marginBottom:9}}>
    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
      <span style={{fontSize:16}}>{cat.icon}</span>
      <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:topColor}}>{cat.t}</span>
    </div>
    {cat.rows.map((r,i)=><div key={r.p||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<cat.rows.length-1?"1px solid #252A38":"none"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:800,color:i===0?topColor:"#5A6278",width:15,textAlign:"center"}}>{i+1}</span>
        <div><div style={{fontSize:13,fontWeight:i===0?700:400}}>{r.p}</div><div style={{fontSize:10,color:"#5A6278"}}>{r.sub}</div></div>
      </div>
      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:19,fontWeight:800,color:i===0?topColor:"#EEF0F8",flexShrink:0,marginLeft:8}}>{r.v}</span>
    </div>)}
    {cat.rows.length===0&&<div style={{fontSize:12,color:"#5A6278",textAlign:"center",padding:"8px 0"}}>No data yet</div>}
  </div>;
}

function RecordsPage({games}){
  const [filter,setFilter]=useState("positive");
  
  const allStats=useMemo(()=>PLAYERS.map(p=>{
    const pg=games.filter(g=>g.player===p).sort((a,b)=>new Date(a.date)-new Date(b.date)||(a.ts??a.id)-(b.ts??b.id));
    if(!pg.length)return null;
    const sc=pg.map(g=>g.score);
    const n=sc.length;
    const avg=mean(sc);
    const by={};
    pg.forEach(g=>{if(!by[g.date])by[g.date]=[];by[g.date].push(g);});
    let bestNightAvg=0,bestNightDate=null,worstNightAvg=999,worstNightDate=null;
    let biggestUp={swing:0,date:null,from:0,to:0};
    let biggestDown={swing:0,date:null,from:0,to:0};
    Object.entries(by).forEach(([d,dg])=>{
      const a=mean(dg.map(g=>g.score));
      if(a>bestNightAvg){bestNightAvg=a;bestNightDate=d;}
      if(a<worstNightAvg){worstNightAvg=a;worstNightDate=d;}
      const sorted=[...dg].sort((a,b)=>(a.ts??a.id)-(b.ts??b.id));
      for(let i=1;i<sorted.length;i++){
        const diff=sorted[i].score-sorted[i-1].score;
        if(diff>biggestUp.swing)biggestUp={swing:diff,date:d,from:sorted[i-1].score,to:sorted[i].score};
        if(-diff>biggestDown.swing)biggestDown={swing:-diff,date:d,from:sorted[i-1].score,to:sorted[i].score};
      }
    });
    const hotStreak=longestHotStreak(pg,avg);
    const coldStreak=longestColdStreak(pg,avg);
    const bestStr=n>=5?bestStretch(sc,pg):null;
    const worstStr=n>=5?worstStretch(sc,pg):null;
    const highGame=pg.find(g=>g.score===Math.max(...sc));
    const lowGame=pg.find(g=>g.score===Math.min(...sc));
    return{player:p,gameCount:n,avg,high:Math.max(...sc),low:Math.min(...sc),
      stdDev:n>=2?sd(sc):null,
      bestNightAvg,bestNightDate,worstNightAvg,worstNightDate,
      biggestUp,biggestDown,hotStreak,coldStreak,
      bestStr,worstStr,highGame,lowGame};
  }).filter(Boolean),[games]);

  // Win/placement stats — all time
  const wpStats=useMemo(()=>calcWinsAndPlacement(games,null),[games]);

  function dateRange(d1,d2){
    if(!d1)return"";
    if(!d2||d1===d2)return fd(d1);
    return`${fd(d1)} – ${fd(d2)}`;
  }

  const withGames=useMemo(()=>allStats.filter(s=>s.gameCount>0),[allStats]);
  const qualified=useMemo(()=>allStats.filter(s=>s.gameCount>=MIN_GAMES),[allStats]);
  const qualified2=useMemo(()=>allStats.filter(s=>s.gameCount>=2),[allStats]);

  // Group score leaderboards — game level (each row = one game)
  const groupGames=useMemo(()=>{
    // Group by date then player, sort each player's games by ts within that date only
    const byDate={};
    games.forEach(g=>{
      if(!byDate[g.date])byDate[g.date]={};
      if(!byDate[g.date][g.player])byDate[g.date][g.player]=[];
      byDate[g.date][g.player].push(g);
    });
    // Sort each player's games within a date by ts ascending (chronological within that night)
    Object.values(byDate).forEach(byPlayer=>{
      Object.values(byPlayer).forEach(gs=>{
        // Use ts if available and meaningful (>1000 = real timestamp), else keep insertion order
        const hasRealTs=gs.some(g=>g.ts>10000);
        if(hasRealTs) gs.sort((a,b)=>(a.ts??0)-(b.ts??0));
        // otherwise keep as-is (insertion order = correct order for old data)
      });
    });
    const rows=[];
    Object.entries(byDate).forEach(([date,byPlayer])=>{
      const maxRows=Math.max(...Object.values(byPlayer).map(gs=>gs.length));
      for(let r=0;r<maxRows;r++){
        const rowScores=[];
        Object.entries(byPlayer).forEach(([player,gs])=>{
          if(gs[r])rowScores.push({player,score:gs[r].score});
        });
        if(rowScores.length>=2){
          const total=rowScores.reduce((s,g)=>s+g.score,0);
          const avg=total/rowScores.length;
          rows.push({date,playerCount:rowScores.length,avg,total,players:rowScores.map(g=>g.player)});
        }
      }
    });
    return rows;
  },[games]);

  const grpSmallBest=useMemo(()=>[...groupGames].filter(s=>s.playerCount<=4).sort((a,b)=>b.avg-a.avg).slice(0,5).map(s=>({p:s.players.join(", "),v:s.avg.toFixed(1),sub:`${s.playerCount} players · ${fd(s.date)}`})),[groupGames]);
  const grpSmallWorst=useMemo(()=>[...groupGames].filter(s=>s.playerCount<=4).sort((a,b)=>a.avg-b.avg).slice(0,5).map(s=>({p:s.players.join(", "),v:s.avg.toFixed(1),sub:`${s.playerCount} players · ${fd(s.date)}`})),[groupGames]);
  const grpLargeBest=useMemo(()=>[...groupGames].filter(s=>s.playerCount>=5).sort((a,b)=>b.avg-a.avg).slice(0,5).map(s=>({p:s.players.join(", "),v:s.avg.toFixed(1),sub:`${s.playerCount} players · ${fd(s.date)}`})),[groupGames]);
  const grpLargeWorst=useMemo(()=>[...groupGames].filter(s=>s.playerCount>=5).sort((a,b)=>a.avg-b.avg).slice(0,5).map(s=>({p:s.players.join(", "),v:s.avg.toFixed(1),sub:`${s.playerCount} players · ${fd(s.date)}`})),[groupGames]);

  // Wins/placement rows
  const winsRows=useMemo(()=>PLAYERS.filter(p=>(wpStats[p]?.totalGames||0)>=MIN_GAMES).map(p=>({
    p,wins:wpStats[p].wins||0,
    losses:wpStats[p].losses||0,
    winRate:wpStats[p].totalGames>0?((wpStats[p].wins||0)/wpStats[p].totalGames*100):0,
    avgPlace:wpStats[p].placementGames>0?(wpStats[p].totalPlace/wpStats[p].placementGames):99,
    avgOpp:wpStats[p].wins>0?(wpStats[p].totalOpponentsInWins/wpStats[p].wins):0,
    avgOppLoss:wpStats[p].losses>0?(wpStats[p].totalOpponentsInLosses/wpStats[p].losses):0,
    games:wpStats[p].totalGames||0,
  })),[wpStats]);

  const positive=[
    {t:"Highest Single Game",icon:"🎳",rows:[...withGames].sort((a,b)=>b.high-a.high).slice(0,5).map(s=>({p:s.player,v:s.high,sub:fd(s.highGame?.date)||""}))},
    {t:"Best Overall Average",icon:"📊",rows:[...qualified].sort((a,b)=>b.avg-a.avg).slice(0,5).map(s=>({p:s.player,v:s.avg.toFixed(1),sub:`${s.gameCount} games`}))},
    {t:"Best Night Average",icon:"🌙",rows:[...qualified].sort((a,b)=>b.bestNightAvg-a.bestNightAvg).slice(0,5).map(s=>({p:s.player,v:s.bestNightAvg.toFixed(1),sub:fd(s.bestNightDate)}))},
    {t:"Best 5-Game Stretch",icon:"🔥",rows:[...allStats].filter(s=>s.bestStr).sort((a,b)=>b.bestStr.avg-a.bestStr.avg).slice(0,5).map(s=>({p:s.player,v:s.bestStr.avg.toFixed(1),sub:dateRange(s.bestStr.startDate,s.bestStr.endDate)}))},
    {t:"Most Consistent",icon:"🎯",rows:[...qualified2].sort((a,b)=>(a.stdDev||999)-(b.stdDev||999)).slice(0,5).map(s=>({p:s.player,v:`±${s.stdDev.toFixed(1)}`,sub:`avg ${s.avg.toFixed(1)}`}))},
    {t:"Longest Hot Streak",icon:"🏃",rows:[...qualified].filter(s=>s.hotStreak.count>0).sort((a,b)=>b.hotStreak.count-a.hotStreak.count).slice(0,5).map(s=>({p:s.player,v:`${s.hotStreak.count}g`,sub:dateRange(s.hotStreak.startDate,s.hotStreak.endDate)}))},
    {t:"Biggest Upward Swing",icon:"📈",rows:[...withGames].filter(s=>s.biggestUp.swing>0).sort((a,b)=>b.biggestUp.swing-a.biggestUp.swing).slice(0,5).map(s=>({p:s.player,v:`+${s.biggestUp.swing}`,sub:`${s.biggestUp.from}→${s.biggestUp.to} · ${fd(s.biggestUp.date)}`}))},
    {t:"Most Games Bowled",icon:"📅",rows:[...withGames].sort((a,b)=>b.gameCount-a.gameCount).slice(0,5).map(s=>({p:s.player,v:s.gameCount,sub:`${s.avg?.toFixed(1)} avg`}))},
  ];

  const negative=[
    {t:"Lowest Single Game",icon:"😬",rows:[...withGames].sort((a,b)=>a.low-b.low).slice(0,5).map(s=>({p:s.player,v:s.low,sub:fd(s.lowGame?.date)||""}))},
    {t:"Lowest Average",icon:"📉",rows:[...qualified].sort((a,b)=>a.avg-b.avg).slice(0,5).map(s=>({p:s.player,v:s.avg.toFixed(1),sub:`${s.gameCount} games`}))},
    {t:"Worst Night Average",icon:"💀",rows:[...qualified].sort((a,b)=>a.worstNightAvg-b.worstNightAvg).slice(0,5).map(s=>({p:s.player,v:s.worstNightAvg.toFixed(1),sub:fd(s.worstNightDate)}))},
    {t:"Worst 5-Game Stretch",icon:"❄️",rows:[...allStats].filter(s=>s.worstStr).sort((a,b)=>a.worstStr.avg-b.worstStr.avg).slice(0,5).map(s=>({p:s.player,v:s.worstStr.avg.toFixed(1),sub:dateRange(s.worstStr.startDate,s.worstStr.endDate)}))},
    {t:"Most Inconsistent",icon:"🎲",rows:[...qualified2].sort((a,b)=>(b.stdDev||0)-(a.stdDev||0)).slice(0,5).map(s=>({p:s.player,v:`±${s.stdDev.toFixed(1)}`,sub:`avg ${s.avg.toFixed(1)}`}))},
    {t:"Longest Cold Streak",icon:"🦽",rows:[...qualified].filter(s=>s.coldStreak.count>0).sort((a,b)=>b.coldStreak.count-a.coldStreak.count).slice(0,5).map(s=>({p:s.player,v:`${s.coldStreak.count}g`,sub:dateRange(s.coldStreak.startDate,s.coldStreak.endDate)}))},
    {t:"Biggest Downward Swing",icon:"📉",rows:[...withGames].filter(s=>s.biggestDown.swing>0).sort((a,b)=>b.biggestDown.swing-a.biggestDown.swing).slice(0,5).map(s=>({p:s.player,v:`-${s.biggestDown.swing}`,sub:`${s.biggestDown.from}→${s.biggestDown.to} · ${fd(s.biggestDown.date)}`}))},
  ];

  const group=[
    {t:"Best Game (5 or more)",icon:"🏆",rows:grpLargeBest},
    {t:"Best Game (4 or fewer)",icon:"🏅",rows:grpSmallBest},
    {t:"Worst Game (5 or more)",icon:"💀",rows:grpLargeWorst},
    {t:"Worst Game (4 or fewer)",icon:"😶",rows:grpSmallWorst},
  ];

  const competitive=[
    {t:"Most Wins",icon:"🥇",rows:[...winsRows].sort((a,b)=>b.wins-a.wins).map(r=>({p:r.p,v:r.wins,sub:`${r.winRate.toFixed(1)}% win rate · ${r.games} games`}))},
    {t:"Best Win Rate",icon:"🎯",rows:[...winsRows].filter(r=>r.games>=MIN_GAMES).sort((a,b)=>b.winRate-a.winRate).map(r=>({p:r.p,v:`${r.winRate.toFixed(1)}%`,sub:`${r.wins} wins · ${r.games} games`}))},
    {t:"Best Average Placement",icon:"📊",rows:[...winsRows].filter(r=>r.games>=MIN_GAMES).sort((a,b)=>a.avgPlace-b.avgPlace).map(r=>({p:r.p,v:`#${r.avgPlace.toFixed(1)}`,sub:`${r.games} games`}))},
    {t:"Worst Average Placement",icon:"😬",rows:[...winsRows].filter(r=>r.games>=MIN_GAMES).sort((a,b)=>b.avgPlace-a.avgPlace).map(r=>({p:r.p,v:`#${r.avgPlace.toFixed(1)}`,sub:`${r.games} games`}))},
    {t:"Avg Opponents Per Win",icon:"👥",rows:[...winsRows].filter(r=>r.wins>0).sort((a,b)=>b.avgOpp-a.avgOpp).map(r=>({p:r.p,v:r.avgOpp.toFixed(1),sub:`${r.wins} wins`}))},
    {t:"Avg Opponents Per Loss",icon:"👥",rows:[...winsRows].filter(r=>r.losses>0).sort((a,b)=>b.avgOppLoss-a.avgOppLoss).map(r=>({p:r.p,v:r.avgOppLoss.toFixed(1),sub:`${r.losses} losses`}))},
  ];

  const FILTERS=[
    {id:"positive",l:"🏆 Positive"},
    {id:"negative",l:"📛 Negative"},
    {id:"group",l:"👥 Group"},
    {id:"competitive",l:"🏅 Competitive"},
  ];

  const activeCats=filter==="positive"?positive:filter==="negative"?negative:filter==="group"?group:competitive;
  const topColor=filter==="negative"?C.red:filter==="group"?C.blue:filter==="competitive"?"#A78BFA":C.accent;

  return<div style={{maxWidth:700,margin:"0 auto",padding:"14px 14px"}}>
    <div style={{...DS,fontSize:18,fontWeight:800,color:C.text,marginBottom:2}}>All Time Records</div>
    <div style={{fontSize:12,color:C.muted,marginBottom:14}}>Both seasons combined · {games.length} total games</div>

    {/* Filter tabs */}
    <div style={{display:"flex",gap:6,marginBottom:16,overflowX:"auto",paddingBottom:2}}>
      {FILTERS.map(f=><button key={f.id} onClick={()=>setFilter(f.id)} style={{
        background:filter===f.id?C.accent:C.card,
        border:`1px solid ${filter===f.id?C.accent:C.border}`,
        color:filter===f.id?C.bg:C.text,
        padding:"7px 14px",borderRadius:20,fontSize:12,fontWeight:600,
        cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,
      }}>{f.l}</button>)}
    </div>

    {activeCats.map(cat=><RecordCard key={cat.t} cat={cat} topColor={topColor}/>)}
  </div>;
}

// ─── FIREBASE ────────────────────────────────────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDP67M5Xr1XqMCcPzCmqrDWWEPmkDwoK5o",
  authDomain: "bowling-api-f6d1d.firebaseapp.com",
  databaseURL: "https://bowling-api-f6d1d-default-rtdb.firebaseio.com",
  projectId: "bowling-api-f6d1d",
  storageBucket: "bowling-api-f6d1d.firebasestorage.app",
  messagingSenderId: "1082148470171",
  appId: "1:1082148470171:web:cbf7150c0c8aff5c8ef53e",
};
const DB_URL = "https://bowling-api-f6d1d-default-rtdb.firebaseio.com";

// Firebase REST API helpers — no SDK needed, just fetch
async function fbGet(path){
  const res=await fetch(`${DB_URL}/${path}.json`);
  if(!res.ok)throw new Error(`Firebase GET failed: ${res.status}`);
  return res.json();
}
async function fbSet(path,data){
  const res=await fetch(`${DB_URL}/${path}.json`,{method:"PUT",body:JSON.stringify(data)});
  if(!res.ok)throw new Error(`Firebase SET failed: ${res.status}`);
  return res.json();
}
async function fbPush(path,data){
  const res=await fetch(`${DB_URL}/${path}.json`,{method:"POST",body:JSON.stringify(data)});
  if(!res.ok)throw new Error(`Firebase PUSH failed: ${res.status}`);
  return res.json();
}
async function fbDelete(path){
  const res=await fetch(`${DB_URL}/${path}.json`,{method:"DELETE"});
  if(!res.ok)throw new Error(`Firebase DELETE failed: ${res.status}`);
  return res.json();
}
async function fbPatch(path,data){
  const res=await fetch(`${DB_URL}/${path}.json`,{method:"PATCH",body:JSON.stringify(data)});
  if(!res.ok)throw new Error(`Firebase PATCH failed: ${res.status}`);
  return res.json();
}


export default function App(){
  const [games,setGamesState]=useState(INIT_GAMES);
  const [players,setPlayersState]=useState(PLAYERS);
  const [page,setPage]=useState("home");
  const [season,setSeason]=useState("S2");
  const [focusPlayer,setFP]=useState(null);
  const [loading,setLoading]=useState(true);
  const [syncErr,setSyncErr]=useState(false);
  const gameKeysRef=useRef({}); // maps game id -> firebase key

  // Load from Firebase on mount
  useEffect(()=>{
    async function load(){
      try{
        const [gamesData,playersData]=await Promise.all([
          fbGet("games"),
          fbGet("players"),
        ]);
        if(gamesData){
          const keys={};
          const normalized=Object.entries(gamesData).map(([fbKey,g],i)=>{
            const id=i+1;
            keys[id]=fbKey;
            return{
              id,
              date:String(g.date||"").trim(),
              player:String(g.player||"").trim(),
              score:Number(g.score),
              season:String(g.season||"").trim(),
              ts:g.ts||i,
            };
          }).filter(g=>g.player&&g.score>0&&g.date);
          gameKeysRef.current=keys;
          setGamesState(normalized);
        }
        if(playersData){
          let pl;
          if(Array.isArray(playersData)){
            pl=playersData.filter(Boolean);
          } else if(typeof playersData==="object"){
            pl=Object.values(playersData).filter(Boolean);
          } else {
            pl=[];
          }
          if(pl.length>0)setPlayersState(pl);
        }
      }catch(e){
        console.error("Firebase load error:",e);
        setSyncErr(true);
      }finally{
        setLoading(false);
      }
    }
    load();
  },[]);

  // Add game
  async function addGameFn(game){
    const ts=Date.now();
    const newGame={...game,ts};
    const tempId=ts; // use timestamp as temp local id
    setGamesState(prev=>[...prev,{...newGame,id:tempId}]);
    try{
      const res=await fbPush("games",newGame);
      const fbKey=res.name;
      // update the temp id to be stable and store the firebase key
      setGamesState(prev=>prev.map(g=>{
        if(g.id===tempId){
          gameKeysRef.current[tempId]=fbKey;
          return g;
        }
        return g;
      }));
    }catch(e){
      setSyncErr(true);
      setGamesState(prev=>prev.filter(g=>g.id!==tempId));
    }
  }

  // Update game
  async function updateGameFn(id,updated){
    const fbKey=gameKeysRef.current[id];
    setGamesState(prev=>prev.map(g=>g.id===id?{...g,...updated}:g));
    if(fbKey){
      try{
        await fbPatch(`games/${fbKey}`,updated);
      }catch(e){
        setSyncErr(true);
      }
    }
  }

  // Delete game
  async function deleteGameFn(id){
    const fbKey=gameKeysRef.current[id];
    setGamesState(prev=>prev.filter(g=>g.id!==id));
    if(fbKey){
      try{
        await fbDelete(`games/${fbKey}`);
      }catch(e){
        setSyncErr(true);
      }
    }
  }

  // Add player — push individual entry, don't overwrite whole list
  async function addPlayerFn(name){
    setPlayersState(prev=>[...prev,name]);
    try{
      await fbPush("players",name);
    }catch(e){
      setSyncErr(true);
    }
  }

  const STYLES=`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    body{background:#0B0D12;color:#EEF0F8;font-family:'Inter',sans-serif;}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#12151C;}::-webkit-scrollbar-thumb{background:#252A38;border-radius:3px;}
    button,input,select,textarea{font-family:inherit;}
    button{-webkit-tap-highlight-color:transparent;}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:0;}
  `;

  if(loading)return<>
    <style>{STYLES}</style>
    <div style={{minHeight:"100vh",background:"#0B0D12",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:32,fontWeight:800,color:"#E8C84A"}}>🎳 Bowling for the Gënts</div>
      <div style={{color:"#5A6278",fontSize:13}}>Loading scores...</div>
      <div style={{width:40,height:40,border:"3px solid #252A38",borderTopColor:"#E8C84A",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  </>;

  return<>
    <style>{STYLES}</style>
    <div style={{minHeight:"100vh",background:"#0B0D12",paddingBottom:68}}>
      <Nav page={page} setPage={setPage} season={season} setSeason={setSeason}/>
      {syncErr&&<div style={{background:"#E85A4A22",borderBottom:"1px solid #E85A4A",padding:"8px 14px",fontSize:12,color:"#E85A4A",textAlign:"center"}}>
        ⚠️ Sync issue — changes may not be saving.
        <button onClick={()=>setSyncErr(false)} style={{background:"none",border:"none",color:"#E85A4A",marginLeft:8,cursor:"pointer",fontSize:12}}>✕</button>
      </div>}
      {page==="home"&&<HomePage games={games} season={season} setPage={setPage} setFP={setFP}/>}
      {page==="standings"&&<StandingsPage games={games} season={season} setPage={setPage} setFP={setFP}/>}
      {page==="players"&&<PlayersPage games={games} players={players} season={season} focusPlayer={focusPlayer} setFP={setFP}/>}
      {page==="scores"&&<ScoresPage games={games} season={season} addGame={addGameFn} updateGame={updateGameFn} deleteGame={deleteGameFn}/>}
      {page==="records"&&<RecordsPage games={games}/>}
    </div>
  </>;
}
