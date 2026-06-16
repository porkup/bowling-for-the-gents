import { useState, useMemo, useRef, useCallback } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const C = {
bg:"#0B0D12", surface:"#12151C", card:"#181B25", border:"#252A38",
accent:"#E8C84A", accentDim:"#6B5C1F", red:"#E85A4A", green:"#3DD68C",
blue:"#5B9CF6", muted:"#5A6278", textDim:"#8B93A8", text:"#EEF0F8",
};

const INIT_PLAYERS = ["Logan","Aaron","Jared","Evan","Ethan","Danny","Aidan","Alon","Patchen","Elijah","Gabi","Benoit","Ari","Jaqueline","Gabe","Ben","Matan","Alex"];

const INIT_GAMES = [
{id:1,date:"2026-05-21",player:"Logan",score:109,season:"S2"},{id:2,date:"2026-05-21",player:"Aaron",score:136,season:"S2"},{id:3,date:"2026-05-21",player:"Logan",score:102,season:"S2"},{id:4,date:"2026-05-21",player:"Aaron",score:118,season:"S2"},
{id:5,date:"2026-05-26",player:"Aidan",score:87,season:"S2"},{id:6,date:"2026-05-26",player:"Elijah",score:105,season:"S2"},{id:7,date:"2026-05-26",player:"Aidan",score:120,season:"S2"},{id:8,date:"2026-05-26",player:"Elijah",score:102,season:"S2"},
{id:9,date:"2026-05-26",player:"Logan",score:126,season:"S2"},{id:10,date:"2026-05-26",player:"Aaron",score:149,season:"S2"},{id:11,date:"2026-05-26",player:"Evan",score:109,season:"S2"},{id:12,date:"2026-05-26",player:"Logan",score:104,season:"S2"},
{id:13,date:"2026-05-26",player:"Aaron",score:149,season:"S2"},{id:14,date:"2026-05-26",player:"Evan",score:98,season:"S2"},{id:15,date:"2026-05-26",player:"Ben",score:103,season:"S2"},
{id:16,date:"2026-05-27",player:"Logan",score:125,season:"S2"},{id:17,date:"2026-05-27",player:"Aaron",score:119,season:"S2"},{id:18,date:"2026-05-27",player:"Jared",score:113,season:"S2"},{id:19,date:"2026-05-27",player:"Evan",score:125,season:"S2"},
{id:20,date:"2026-05-27",player:"Ethan",score:88,season:"S2"},{id:21,date:"2026-05-27",player:"Aidan",score:67,season:"S2"},{id:22,date:"2026-05-27",player:"Alon",score:86,season:"S2"},{id:23,date:"2026-05-27",player:"Elijah",score:73,season:"S2"},
{id:24,date:"2026-05-27",player:"Logan",score:151,season:"S2"},{id:25,date:"2026-05-27",player:"Aaron",score:99,season:"S2"},{id:26,date:"2026-05-27",player:"Jared",score:90,season:"S2"},{id:27,date:"2026-05-27",player:"Evan",score:126,season:"S2"},
{id:28,date:"2026-05-27",player:"Ethan",score:111,season:"S2"},{id:29,date:"2026-05-27",player:"Aidan",score:104,season:"S2"},{id:30,date:"2026-05-27",player:"Alon",score:79,season:"S2"},{id:31,date:"2026-05-27",player:"Patchen",score:118,season:"S2"},{id:32,date:"2026-05-27",player:"Elijah",score:81,season:"S2"},
{id:33,date:"2026-05-28",player:"Logan",score:147,season:"S2"},{id:34,date:"2026-05-28",player:"Aaron",score:127,season:"S2"},{id:35,date:"2026-05-28",player:"Jared",score:132,season:"S2"},{id:36,date:"2026-05-28",player:"Ethan",score:147,season:"S2"},
{id:37,date:"2026-05-28",player:"Danny",score:108,season:"S2"},{id:38,date:"2026-05-28",player:"Aidan",score:81,season:"S2"},{id:39,date:"2026-05-28",player:"Patchen",score:95,season:"S2"},{id:40,date:"2026-05-28",player:"Logan",score:140,season:"S2"},
{id:41,date:"2026-05-28",player:"Aaron",score:107,season:"S2"},{id:42,date:"2026-05-28",player:"Jared",score:120,season:"S2"},{id:43,date:"2026-05-28",player:"Ethan",score:60,season:"S2"},{id:44,date:"2026-05-28",player:"Danny",score:147,season:"S2"},
{id:45,date:"2026-05-28",player:"Aidan",score:86,season:"S2"},{id:46,date:"2026-05-28",player:"Patchen",score:60,season:"S2"},
{id:47,date:"2026-05-30",player:"Logan",score:101,season:"S2"},{id:48,date:"2026-05-30",player:"Aaron",score:112,season:"S2"},{id:49,date:"2026-05-30",player:"Logan",score:169,season:"S2"},{id:50,date:"2026-05-30",player:"Aaron",score:179,season:"S2"},
{id:51,date:"2026-06-01",player:"Logan",score:137,season:"S2"},{id:52,date:"2026-06-01",player:"Aaron",score:132,season:"S2"},{id:53,date:"2026-06-01",player:"Jared",score:105,season:"S2"},{id:54,date:"2026-06-01",player:"Danny",score:100,season:"S2"},
{id:55,date:"2026-06-01",player:"Alon",score:146,season:"S2"},{id:56,date:"2026-06-01",player:"Logan",score:114,season:"S2"},{id:57,date:"2026-06-01",player:"Aaron",score:113,season:"S2"},{id:58,date:"2026-06-01",player:"Jared",score:119,season:"S2"},
{id:59,date:"2026-06-01",player:"Danny",score:117,season:"S2"},{id:60,date:"2026-06-01",player:"Alon",score:85,season:"S2"},
{id:61,date:"2026-06-02",player:"Logan",score:144,season:"S2"},{id:62,date:"2026-06-02",player:"Aaron",score:156,season:"S2"},{id:63,date:"2026-06-02",player:"Jared",score:74,season:"S2"},{id:64,date:"2026-06-02",player:"Danny",score:147,season:"S2"},
{id:65,date:"2026-06-02",player:"Logan",score:99,season:"S2"},{id:66,date:"2026-06-02",player:"Aaron",score:131,season:"S2"},{id:67,date:"2026-06-02",player:"Jared",score:130,season:"S2"},
{id:68,date:"2026-06-03",player:"Aaron",score:147,season:"S2"},{id:69,date:"2026-06-03",player:"Jared",score:122,season:"S2"},{id:70,date:"2026-06-03",player:"Aidan",score:91,season:"S2"},{id:71,date:"2026-06-03",player:"Aaron",score:133,season:"S2"},
{id:72,date:"2026-06-03",player:"Jared",score:83,season:"S2"},{id:73,date:"2026-06-03",player:"Aidan",score:84,season:"S2"},
{id:74,date:"2026-06-04",player:"Aaron",score:146,season:"S2"},{id:75,date:"2026-06-04",player:"Jared",score:98,season:"S2"},{id:76,date:"2026-06-04",player:"Danny",score:118,season:"S2"},{id:77,date:"2026-06-04",player:"Alon",score:94,season:"S2"},
{id:78,date:"2026-06-04",player:"Patchen",score:72,season:"S2"},{id:79,date:"2026-06-04",player:"Aaron",score:164,season:"S2"},{id:80,date:"2026-06-04",player:"Jared",score:115,season:"S2"},{id:81,date:"2026-06-04",player:"Danny",score:88,season:"S2"},
{id:82,date:"2026-06-04",player:"Alon",score:108,season:"S2"},{id:83,date:"2026-06-04",player:"Patchen",score:74,season:"S2"},
{id:84,date:"2026-06-05",player:"Aaron",score:112,season:"S2"},{id:85,date:"2026-06-05",player:"Jared",score:105,season:"S2"},{id:86,date:"2026-06-05",player:"Evan",score:117,season:"S2"},{id:87,date:"2026-06-05",player:"Danny",score:123,season:"S2"},
{id:88,date:"2026-06-05",player:"Aidan",score:67,season:"S2"},{id:89,date:"2026-06-05",player:"Elijah",score:124,season:"S2"},{id:90,date:"2026-06-05",player:"Jared",score:120,season:"S2"},{id:91,date:"2026-06-05",player:"Evan",score:115,season:"S2"},
{id:92,date:"2026-06-05",player:"Danny",score:123,season:"S2"},{id:93,date:"2026-06-05",player:"Aidan",score:109,season:"S2"},{id:94,date:"2026-06-05",player:"Elijah",score:151,season:"S2"},
{id:95,date:"2026-06-10",player:"Logan",score:80,season:"S2"},{id:96,date:"2026-06-10",player:"Aaron",score:151,season:"S2"},{id:97,date:"2026-06-10",player:"Jared",score:105,season:"S2"},{id:98,date:"2026-06-10",player:"Danny",score:146,season:"S2"},
{id:99,date:"2026-06-10",player:"Aidan",score:77,season:"S2"},{id:100,date:"2026-06-10",player:"Alon",score:134,season:"S2"},{id:101,date:"2026-06-10",player:"Patchen",score:92,season:"S2"},{id:102,date:"2026-06-10",player:"Jared",score:139,season:"S2"},
{id:103,date:"2026-06-10",player:"Danny",score:150,season:"S2"},{id:104,date:"2026-06-10",player:"Aidan",score:65,season:"S2"},{id:105,date:"2026-06-10",player:"Alon",score:85,season:"S2"},
{id:106,date:"2026-06-11",player:"Aaron",score:149,season:"S2"},{id:107,date:"2026-06-11",player:"Aaron",score:148,season:"S2"},{id:108,date:"2026-06-11",player:"Aaron",score:127,season:"S2"},{id:109,date:"2026-06-11",player:"Jared",score:118,season:"S2"},
{id:110,date:"2026-06-11",player:"Evan",score:133,season:"S2"},{id:111,date:"2026-06-11",player:"Danny",score:118,season:"S2"},{id:112,date:"2026-06-11",player:"Aidan",score:66,season:"S2"},{id:113,date:"2026-06-11",player:"Elijah",score:88,season:"S2"},
{id:114,date:"2026-06-11",player:"Jared",score:103,season:"S2"},{id:115,date:"2026-06-11",player:"Danny",score:104,season:"S2"},{id:116,date:"2026-06-11",player:"Aidan",score:71,season:"S2"},{id:117,date:"2026-06-11",player:"Elijah",score:128,season:"S2"},
{id:118,date:"2026-06-12",player:"Logan",score:115,season:"S2"},{id:119,date:"2026-06-12",player:"Aaron",score:143,season:"S2"},{id:120,date:"2026-06-12",player:"Evan",score:113,season:"S2"},{id:121,date:"2026-06-12",player:"Aidan",score:87,season:"S2"},
{id:122,date:"2026-06-12",player:"Elijah",score:116,season:"S2"},{id:123,date:"2026-06-12",player:"Logan",score:91,season:"S2"},{id:124,date:"2026-06-12",player:"Aaron",score:134,season:"S2"},{id:125,date:"2026-06-12",player:"Evan",score:121,season:"S2"},
{id:126,date:"2026-06-12",player:"Aidan",score:98,season:"S2"},{id:127,date:"2026-06-12",player:"Elijah",score:122,season:"S2"},{id:128,date:"2026-06-12",player:"Evan",score:112,season:"S2"},{id:129,date:"2026-06-12",player:"Aidan",score:121,season:"S2"},
{id:130,date:"2026-06-12",player:"Logan",score:114,season:"S2"},{id:131,date:"2026-06-12",player:"Aidan",score:92,season:"S2"},
{id:132,date:"2026-06-14",player:"Logan",score:133,season:"S2"},{id:133,date:"2026-06-14",player:"Jared",score:83,season:"S2"},{id:134,date:"2026-06-14",player:"Aidan",score:97,season:"S2"},{id:135,date:"2026-06-14",player:"Elijah",score:121,season:"S2"},
{id:136,date:"2026-06-14",player:"Alex",score:50,season:"S2"},{id:137,date:"2026-06-14",player:"Logan",score:121,season:"S2"},{id:138,date:"2026-06-14",player:"Jared",score:101,season:"S2"},{id:139,date:"2026-06-14",player:"Aidan",score:91,season:"S2"},
{id:140,date:"2026-06-14",player:"Elijah",score:93,season:"S2"},{id:141,date:"2026-06-14",player:"Alex",score:76,season:"S2"},
{id:142,date:"2026-06-15",player:"Logan",score:119,season:"S2"},{id:143,date:"2026-06-15",player:"Aaron",score:121,season:"S2"},{id:144,date:"2026-06-15",player:"Jared",score:102,season:"S2"},{id:145,date:"2026-06-15",player:"Aidan",score:85,season:"S2"},
{id:146,date:"2026-06-15",player:"Patchen",score:99,season:"S2"},{id:147,date:"2026-06-15",player:"Elijah",score:132,season:"S2"},{id:148,date:"2026-06-15",player:"Alex",score:68,season:"S2"},{id:149,date:"2026-06-15",player:"Logan",score:139,season:"S2"},
{id:150,date:"2026-06-15",player:"Aaron",score:180,season:"S2"},{id:151,date:"2026-06-15",player:"Jared",score:113,season:"S2"},{id:152,date:"2026-06-15",player:"Aidan",score:96,season:"S2"},{id:153,date:"2026-06-15",player:"Patchen",score:88,season:"S2"},
{id:154,date:"2026-06-15",player:"Elijah",score:138,season:"S2"},{id:155,date:"2026-06-15",player:"Alex",score:58,season:"S2"},{id:156,date:"2026-06-15",player:"Aaron",score:126,season:"S2"},{id:157,date:"2026-06-15",player:"Jared",score:112,season:"S2"},
{id:158,date:"2026-06-15",player:"Aidan",score:121,season:"S2"},{id:159,date:"2026-06-15",player:"Patchen",score:68,season:"S2"},{id:160,date:"2026-06-15",player:"Elijah",score:100,season:"S2"},{id:161,date:"2026-06-15",player:"Alex",score:53,season:"S2"},
{id:162,date:"2025-06-16",player:"Evan",score:171,season:"S1"},{id:163,date:"2025-06-17",player:"Aaron",score:159,season:"S1"},{id:164,date:"2025-06-17",player:"Jared",score:91,season:"S1"},{id:165,date:"2025-06-17",player:"Evan",score:139,season:"S1"},
{id:166,date:"2025-06-17",player:"Ethan",score:94,season:"S1"},{id:167,date:"2025-06-17",player:"Danny",score:99,season:"S1"},{id:168,date:"2025-06-17",player:"Aaron",score:132,season:"S1"},{id:169,date:"2025-06-17",player:"Jared",score:88,season:"S1"},
{id:170,date:"2025-06-17",player:"Evan",score:109,season:"S1"},{id:171,date:"2025-06-17",player:"Ethan",score:93,season:"S1"},{id:172,date:"2025-06-17",player:"Danny",score:112,season:"S1"},
{id:173,date:"2025-06-18",player:"Aaron",score:152,season:"S1"},{id:174,date:"2025-06-18",player:"Jared",score:108,season:"S1"},{id:175,date:"2025-06-18",player:"Evan",score:116,season:"S1"},{id:176,date:"2025-06-18",player:"Danny",score:165,season:"S1"},
{id:177,date:"2025-06-18",player:"Aidan",score:85,season:"S1"},{id:178,date:"2025-06-18",player:"Gabi",score:125,season:"S1"},{id:179,date:"2025-06-18",player:"Aaron",score:145,season:"S1"},{id:180,date:"2025-06-18",player:"Jared",score:109,season:"S1"},
{id:181,date:"2025-06-18",player:"Danny",score:116,season:"S1"},{id:182,date:"2025-06-18",player:"Gabi",score:109,season:"S1"},
{id:183,date:"2025-06-23",player:"Logan",score:134,season:"S1"},{id:184,date:"2025-06-23",player:"Aaron",score:128,season:"S1"},{id:185,date:"2025-06-23",player:"Jared",score:94,season:"S1"},{id:186,date:"2025-06-23",player:"Evan",score:145,season:"S1"},
{id:187,date:"2025-06-23",player:"Logan",score:204,season:"S1"},{id:188,date:"2025-06-23",player:"Aaron",score:112,season:"S1"},{id:189,date:"2025-06-23",player:"Jared",score:86,season:"S1"},{id:190,date:"2025-06-23",player:"Evan",score:113,season:"S1"},
{id:191,date:"2025-06-24",player:"Logan",score:128,season:"S1"},{id:192,date:"2025-06-24",player:"Aaron",score:160,season:"S1"},{id:193,date:"2025-06-24",player:"Jared",score:93,season:"S1"},{id:194,date:"2025-06-24",player:"Ethan",score:120,season:"S1"},
{id:195,date:"2025-06-24",player:"Logan",score:139,season:"S1"},{id:196,date:"2025-06-24",player:"Aaron",score:141,season:"S1"},{id:197,date:"2025-06-24",player:"Jared",score:89,season:"S1"},{id:198,date:"2025-06-24",player:"Ethan",score:99,season:"S1"},
{id:199,date:"2025-06-30",player:"Logan",score:102,season:"S1"},{id:200,date:"2025-06-30",player:"Aaron",score:132,season:"S1"},{id:201,date:"2025-06-30",player:"Jared",score:87,season:"S1"},{id:202,date:"2025-06-30",player:"Ethan",score:147,season:"S1"},
{id:203,date:"2025-06-30",player:"Danny",score:143,season:"S1"},{id:204,date:"2025-06-30",player:"Matan",score:34,season:"S1"},{id:205,date:"2025-06-30",player:"Aaron",score:87,season:"S1"},{id:206,date:"2025-06-30",player:"Jared",score:122,season:"S1"},
{id:207,date:"2025-06-30",player:"Ethan",score:139,season:"S1"},{id:208,date:"2025-06-30",player:"Danny",score:119,season:"S1"},{id:209,date:"2025-06-30",player:"Matan",score:61,season:"S1"},
{id:210,date:"2025-07-06",player:"Logan",score:148,season:"S1"},{id:211,date:"2025-07-06",player:"Aaron",score:156,season:"S1"},{id:212,date:"2025-07-06",player:"Jared",score:114,season:"S1"},{id:213,date:"2025-07-06",player:"Evan",score:95,season:"S1"},
{id:214,date:"2025-07-06",player:"Logan",score:136,season:"S1"},{id:215,date:"2025-07-06",player:"Aaron",score:120,season:"S1"},{id:216,date:"2025-07-06",player:"Jared",score:112,season:"S1"},{id:217,date:"2025-07-06",player:"Evan",score:114,season:"S1"},
{id:218,date:"2025-07-07",player:"Logan",score:153,season:"S1"},{id:219,date:"2025-07-07",player:"Aaron",score:149,season:"S1"},{id:220,date:"2025-07-07",player:"Jared",score:90,season:"S1"},{id:221,date:"2025-07-07",player:"Danny",score:108,season:"S1"},
{id:222,date:"2025-07-07",player:"Logan",score:107,season:"S1"},{id:223,date:"2025-07-07",player:"Aaron",score:131,season:"S1"},{id:224,date:"2025-07-07",player:"Jared",score:125,season:"S1"},
{id:225,date:"2025-07-08",player:"Logan",score:107,season:"S1"},{id:226,date:"2025-07-08",player:"Aaron",score:138,season:"S1"},{id:227,date:"2025-07-08",player:"Jared",score:75,season:"S1"},{id:228,date:"2025-07-08",player:"Logan",score:139,season:"S1"},
{id:229,date:"2025-07-08",player:"Aaron",score:145,season:"S1"},{id:230,date:"2025-07-08",player:"Jared",score:94,season:"S1"},{id:231,date:"2025-07-08",player:"Logan",score:168,season:"S1"},{id:232,date:"2025-07-08",player:"Aaron",score:96,season:"S1"},
{id:233,date:"2025-07-08",player:"Jared",score:80,season:"S1"},{id:234,date:"2025-07-08",player:"Logan",score:100,season:"S1"},{id:235,date:"2025-07-08",player:"Aaron",score:124,season:"S1"},{id:236,date:"2025-07-08",player:"Jared",score:96,season:"S1"},
{id:237,date:"2025-07-08",player:"Logan",score:139,season:"S1"},{id:238,date:"2025-07-08",player:"Aaron",score:144,season:"S1"},{id:239,date:"2025-07-08",player:"Jared",score:142,season:"S1"},
{id:240,date:"2025-07-09",player:"Logan",score:109,season:"S1"},{id:241,date:"2025-07-09",player:"Aaron",score:157,season:"S1"},{id:242,date:"2025-07-09",player:"Ethan",score:92,season:"S1"},{id:243,date:"2025-07-09",player:"Danny",score:116,season:"S1"},
{id:244,date:"2025-07-09",player:"Logan",score:84,season:"S1"},{id:245,date:"2025-07-09",player:"Aaron",score:132,season:"S1"},{id:246,date:"2025-07-09",player:"Ethan",score:126,season:"S1"},{id:247,date:"2025-07-09",player:"Danny",score:189,season:"S1"},
{id:248,date:"2025-07-10",player:"Logan",score:125,season:"S1"},{id:249,date:"2025-07-10",player:"Aaron",score:107,season:"S1"},{id:250,date:"2025-07-10",player:"Danny",score:107,season:"S1"},{id:251,date:"2025-07-10",player:"Logan",score:141,season:"S1"},
{id:252,date:"2025-07-10",player:"Aaron",score:152,season:"S1"},{id:253,date:"2025-07-10",player:"Jared",score:116,season:"S1"},{id:254,date:"2025-07-10",player:"Danny",score:152,season:"S1"},{id:255,date:"2025-07-10",player:"Logan",score:87,season:"S1"},
{id:256,date:"2025-07-10",player:"Aaron",score:124,season:"S1"},{id:257,date:"2025-07-10",player:"Jared",score:89,season:"S1"},{id:258,date:"2025-07-10",player:"Danny",score:158,season:"S1"},{id:259,date:"2025-07-10",player:"Logan",score:113,season:"S1"},
{id:260,date:"2025-07-10",player:"Aaron",score:106,season:"S1"},{id:261,date:"2025-07-10",player:"Jared",score:116,season:"S1"},{id:262,date:"2025-07-10",player:"Danny",score:104,season:"S1"},{id:263,date:"2025-07-10",player:"Logan",score:147,season:"S1"},
{id:264,date:"2025-07-10",player:"Aaron",score:133,season:"S1"},{id:265,date:"2025-07-10",player:"Jared",score:108,season:"S1"},{id:266,date:"2025-07-10",player:"Danny",score:113,season:"S1"},{id:267,date:"2025-07-10",player:"Aaron",score:150,season:"S1"},
{id:268,date:"2025-07-10",player:"Jared",score:105,season:"S1"},{id:269,date:"2025-07-10",player:"Danny",score:130,season:"S1"},{id:270,date:"2025-07-10",player:"Matan",score:78,season:"S1"},{id:271,date:"2025-07-10",player:"Aaron",score:143,season:"S1"},
{id:272,date:"2025-07-10",player:"Jared",score:117,season:"S1"},{id:273,date:"2025-07-10",player:"Danny",score:138,season:"S1"},{id:274,date:"2025-07-10",player:"Matan",score:98,season:"S1"},{id:275,date:"2025-07-10",player:"Aaron",score:144,season:"S1"},
{id:276,date:"2025-07-10",player:"Jared",score:122,season:"S1"},{id:277,date:"2025-07-10",player:"Danny",score:219,season:"S1"},{id:278,date:"2025-07-10",player:"Matan",score:92,season:"S1"},
{id:279,date:"2025-07-13",player:"Logan",score:117,season:"S1"},{id:280,date:"2025-07-13",player:"Aaron",score:165,season:"S1"},{id:281,date:"2025-07-13",player:"Jared",score:100,season:"S1"},{id:282,date:"2025-07-13",player:"Evan",score:141,season:"S1"},
{id:283,date:"2025-07-13",player:"Ethan",score:122,season:"S1"},{id:284,date:"2025-07-13",player:"Danny",score:109,season:"S1"},{id:285,date:"2025-07-13",player:"Gabi",score:115,season:"S1"},{id:286,date:"2025-07-13",player:"Logan",score:176,season:"S1"},
{id:287,date:"2025-07-13",player:"Aaron",score:96,season:"S1"},{id:288,date:"2025-07-13",player:"Jared",score:119,season:"S1"},{id:289,date:"2025-07-13",player:"Evan",score:96,season:"S1"},{id:290,date:"2025-07-13",player:"Ethan",score:98,season:"S1"},
{id:291,date:"2025-07-13",player:"Danny",score:168,season:"S1"},{id:292,date:"2025-07-13",player:"Gabi",score:80,season:"S1"},
{id:293,date:"2025-07-15",player:"Logan",score:107,season:"S1"},{id:294,date:"2025-07-15",player:"Aaron",score:120,season:"S1"},{id:295,date:"2025-07-15",player:"Jared",score:99,season:"S1"},{id:296,date:"2025-07-15",player:"Evan",score:82,season:"S1"},
{id:297,date:"2025-07-15",player:"Ethan",score:90,season:"S1"},{id:298,date:"2025-07-15",player:"Danny",score:161,season:"S1"},{id:299,date:"2025-07-15",player:"Logan",score:127,season:"S1"},{id:300,date:"2025-07-15",player:"Aaron",score:134,season:"S1"},
{id:301,date:"2025-07-15",player:"Jared",score:95,season:"S1"},{id:302,date:"2025-07-15",player:"Evan",score:87,season:"S1"},{id:303,date:"2025-07-15",player:"Ethan",score:91,season:"S1"},{id:304,date:"2025-07-15",player:"Danny",score:171,season:"S1"},
{id:305,date:"2025-07-15",player:"Aidan",score:88,season:"S1"},{id:306,date:"2025-07-15",player:"Aaron",score:129,season:"S1"},{id:307,date:"2025-07-15",player:"Jared",score:80,season:"S1"},{id:308,date:"2025-07-15",player:"Ethan",score:109,season:"S1"},
{id:309,date:"2025-07-15",player:"Danny",score:124,season:"S1"},{id:310,date:"2025-07-15",player:"Aaron",score:112,season:"S1"},{id:311,date:"2025-07-15",player:"Danny",score:125,season:"S1"},
{id:312,date:"2025-07-16",player:"Aaron",score:133,season:"S1"},{id:313,date:"2025-07-16",player:"Jared",score:115,season:"S1"},{id:314,date:"2025-07-16",player:"Evan",score:130,season:"S1"},{id:315,date:"2025-07-16",player:"Ethan",score:113,season:"S1"},
{id:316,date:"2025-07-16",player:"Jared",score:72,season:"S1"},{id:317,date:"2025-07-16",player:"Ethan",score:137,season:"S1"},
{id:318,date:"2025-07-17",player:"Logan",score:107,season:"S1"},{id:319,date:"2025-07-17",player:"Aaron",score:101,season:"S1"},{id:320,date:"2025-07-17",player:"Ethan",score:98,season:"S1"},{id:321,date:"2025-07-17",player:"Danny",score:177,season:"S1"},
{id:322,date:"2025-07-17",player:"Logan",score:93,season:"S1"},{id:323,date:"2025-07-17",player:"Aaron",score:155,season:"S1"},{id:324,date:"2025-07-17",player:"Ethan",score:98,season:"S1"},{id:325,date:"2025-07-17",player:"Danny",score:126,season:"S1"},
{id:326,date:"2025-07-19",player:"Logan",score:137,season:"S1"},{id:327,date:"2025-07-19",player:"Aaron",score:155,season:"S1"},{id:328,date:"2025-07-19",player:"Logan",score:102,season:"S1"},{id:329,date:"2025-07-19",player:"Aaron",score:149,season:"S1"},
{id:330,date:"2025-07-20",player:"Logan",score:130,season:"S1"},{id:331,date:"2025-07-20",player:"Aaron",score:169,season:"S1"},{id:332,date:"2025-07-20",player:"Jared",score:81,season:"S1"},{id:333,date:"2025-07-20",player:"Evan",score:93,season:"S1"},
{id:334,date:"2025-07-20",player:"Ethan",score:92,season:"S1"},{id:335,date:"2025-07-20",player:"Danny",score:144,season:"S1"},{id:336,date:"2025-07-20",player:"Aidan",score:98,season:"S1"},{id:337,date:"2025-07-20",player:"Gabe",score:53,season:"S1"},
{id:338,date:"2025-07-20",player:"Logan",score:130,season:"S1"},{id:339,date:"2025-07-20",player:"Aaron",score:122,season:"S1"},{id:340,date:"2025-07-20",player:"Jared",score:130,season:"S1"},{id:341,date:"2025-07-20",player:"Evan",score:93,season:"S1"},
{id:342,date:"2025-07-20",player:"Ethan",score:193,season:"S1"},{id:343,date:"2025-07-20",player:"Danny",score:151,season:"S1"},{id:344,date:"2025-07-20",player:"Aidan",score:108,season:"S1"},{id:345,date:"2025-07-20",player:"Gabe",score:57,season:"S1"},
{id:346,date:"2025-07-21",player:"Logan",score:122,season:"S1"},{id:347,date:"2025-07-21",player:"Aaron",score:132,season:"S1"},{id:348,date:"2025-07-21",player:"Ethan",score:93,season:"S1"},{id:349,date:"2025-07-21",player:"Aidan",score:73,season:"S1"},
{id:350,date:"2025-07-21",player:"Logan",score:141,season:"S1"},{id:351,date:"2025-07-21",player:"Ethan",score:100,season:"S1"},{id:352,date:"2025-07-21",player:"Aidan",score:74,season:"S1"},
{id:353,date:"2025-07-23",player:"Aaron",score:111,season:"S1"},{id:354,date:"2025-07-23",player:"Ethan",score:115,season:"S1"},{id:355,date:"2025-07-23",player:"Danny",score:140,season:"S1"},{id:356,date:"2025-07-23",player:"Aidan",score:104,season:"S1"},
{id:357,date:"2025-07-23",player:"Gabi",score:83,season:"S1"},{id:358,date:"2025-07-23",player:"Ethan",score:111,season:"S1"},{id:359,date:"2025-07-23",player:"Danny",score:142,season:"S1"},{id:360,date:"2025-07-23",player:"Aidan",score:103,season:"S1"},
{id:361,date:"2025-07-27",player:"Aaron",score:148,season:"S1"},{id:362,date:"2025-07-27",player:"Ethan",score:98,season:"S1"},{id:363,date:"2025-07-27",player:"Danny",score:131,season:"S1"},{id:364,date:"2025-07-27",player:"Aidan",score:96,season:"S1"},
{id:365,date:"2025-07-27",player:"Gabi",score:84,season:"S1"},{id:366,date:"2025-07-27",player:"Aaron",score:120,season:"S1"},{id:367,date:"2025-07-27",player:"Ethan",score:111,season:"S1"},{id:368,date:"2025-07-27",player:"Danny",score:136,season:"S1"},
{id:369,date:"2025-07-27",player:"Aidan",score:84,season:"S1"},{id:370,date:"2025-07-27",player:"Gabi",score:83,season:"S1"},{id:371,date:"2025-07-27",player:"Ethan",score:98,season:"S1"},{id:372,date:"2025-07-27",player:"Aidan",score:98,season:"S1"},
{id:373,date:"2025-07-28",player:"Aaron",score:123,season:"S1"},{id:374,date:"2025-07-28",player:"Danny",score:102,season:"S1"},{id:375,date:"2025-07-28",player:"Aaron",score:148,season:"S1"},{id:376,date:"2025-07-28",player:"Danny",score:108,season:"S1"},
{id:377,date:"2025-07-29",player:"Logan",score:151,season:"S1"},{id:378,date:"2025-07-29",player:"Aaron",score:165,season:"S1"},{id:379,date:"2025-07-29",player:"Logan",score:137,season:"S1"},{id:380,date:"2025-07-29",player:"Aaron",score:122,season:"S1"},
{id:381,date:"2025-07-29",player:"Logan",score:117,season:"S1"},{id:382,date:"2025-07-29",player:"Aaron",score:225,season:"S1"},{id:383,date:"2025-07-29",player:"Logan",score:116,season:"S1"},{id:384,date:"2025-07-29",player:"Aaron",score:131,season:"S1"},
{id:385,date:"2025-07-29",player:"Logan",score:132,season:"S1"},{id:386,date:"2025-07-29",player:"Aaron",score:124,season:"S1"},{id:387,date:"2025-07-29",player:"Logan",score:131,season:"S1"},{id:388,date:"2025-07-29",player:"Aaron",score:139,season:"S1"},
{id:389,date:"2025-07-29",player:"Logan",score:114,season:"S1"},{id:390,date:"2025-07-29",player:"Aaron",score:120,season:"S1"},{id:391,date:"2025-07-29",player:"Ethan",score:113,season:"S1"},{id:392,date:"2025-07-29",player:"Danny",score:120,season:"S1"},
{id:393,date:"2025-07-29",player:"Aidan",score:100,season:"S1"},{id:394,date:"2025-07-29",player:"Logan",score:123,season:"S1"},{id:395,date:"2025-07-29",player:"Aaron",score:110,season:"S1"},{id:396,date:"2025-07-29",player:"Ethan",score:86,season:"S1"},
{id:397,date:"2025-07-29",player:"Aidan",score:91,season:"S1"},
{id:398,date:"2025-07-30",player:"Aaron",score:138,season:"S1"},{id:399,date:"2025-07-30",player:"Aidan",score:75,season:"S1"},{id:400,date:"2025-07-30",player:"Aaron",score:147,season:"S1"},{id:401,date:"2025-07-30",player:"Aidan",score:76,season:"S1"},
{id:402,date:"2025-07-31",player:"Logan",score:123,season:"S1"},{id:403,date:"2025-07-31",player:"Aaron",score:150,season:"S1"},{id:404,date:"2025-07-31",player:"Logan",score:121,season:"S1"},{id:405,date:"2025-07-31",player:"Aaron",score:115,season:"S1"},
{id:406,date:"2025-08-03",player:"Logan",score:99,season:"S1"},{id:407,date:"2025-08-03",player:"Aaron",score:134,season:"S1"},{id:408,date:"2025-08-03",player:"Logan",score:122,season:"S1"},{id:409,date:"2025-08-03",player:"Aaron",score:153,season:"S1"},
{id:410,date:"2025-08-04",player:"Logan",score:103,season:"S1"},{id:411,date:"2025-08-04",player:"Aaron",score:98,season:"S1"},{id:412,date:"2025-08-04",player:"Ethan",score:108,season:"S1"},{id:413,date:"2025-08-04",player:"Aidan",score:119,season:"S1"},
{id:414,date:"2025-08-04",player:"Alon",score:99,season:"S1"},{id:415,date:"2025-08-04",player:"Gabi",score:91,season:"S1"},{id:416,date:"2025-08-04",player:"Benoit",score:88,season:"S1"},{id:417,date:"2025-08-04",player:"Logan",score:125,season:"S1"},
{id:418,date:"2025-08-04",player:"Aaron",score:164,season:"S1"},{id:419,date:"2025-08-04",player:"Ethan",score:95,season:"S1"},{id:420,date:"2025-08-04",player:"Aidan",score:84,season:"S1"},{id:421,date:"2025-08-04",player:"Alon",score:101,season:"S1"},
{id:422,date:"2025-08-04",player:"Benoit",score:59,season:"S1"},
{id:423,date:"2025-08-05",player:"Logan",score:114,season:"S1"},{id:424,date:"2025-08-05",player:"Aaron",score:113,season:"S1"},{id:425,date:"2025-08-05",player:"Jared",score:92,season:"S1"},{id:426,date:"2025-08-05",player:"Evan",score:92,season:"S1"},
{id:427,date:"2025-08-05",player:"Ethan",score:90,season:"S1"},{id:428,date:"2025-08-05",player:"Alon",score:98,season:"S1"},{id:429,date:"2025-08-05",player:"Gabi",score:109,season:"S1"},{id:430,date:"2025-08-05",player:"Gabe",score:68,season:"S1"},
{id:431,date:"2025-08-05",player:"Logan",score:112,season:"S1"},{id:432,date:"2025-08-05",player:"Aaron",score:127,season:"S1"},{id:433,date:"2025-08-05",player:"Jared",score:108,season:"S1"},{id:434,date:"2025-08-05",player:"Evan",score:117,season:"S1"},
{id:435,date:"2025-08-05",player:"Ethan",score:130,season:"S1"},{id:436,date:"2025-08-05",player:"Alon",score:86,season:"S1"},{id:437,date:"2025-08-05",player:"Gabi",score:100,season:"S1"},{id:438,date:"2025-08-05",player:"Gabe",score:60,season:"S1"},
{id:439,date:"2025-08-06",player:"Logan",score:112,season:"S1"},{id:440,date:"2025-08-06",player:"Aaron",score:126,season:"S1"},{id:441,date:"2025-08-06",player:"Jared",score:92,season:"S1"},{id:442,date:"2025-08-06",player:"Ethan",score:70,season:"S1"},
{id:443,date:"2025-08-06",player:"Aidan",score:60,season:"S1"},{id:444,date:"2025-08-06",player:"Alon",score:75,season:"S1"},{id:445,date:"2025-08-06",player:"Patchen",score:61,season:"S1"},
{id:446,date:"2025-08-08",player:"Logan",score:100,season:"S1"},{id:447,date:"2025-08-08",player:"Aaron",score:128,season:"S1"},{id:448,date:"2025-08-08",player:"Logan",score:158,season:"S1"},{id:449,date:"2025-08-08",player:"Aaron",score:129,season:"S1"},
{id:450,date:"2025-08-09",player:"Logan",score:158,season:"S1"},{id:451,date:"2025-08-09",player:"Aaron",score:145,season:"S1"},{id:452,date:"2025-08-09",player:"Logan",score:157,season:"S1"},{id:453,date:"2025-08-09",player:"Aaron",score:170,season:"S1"},
{id:454,date:"2025-08-09",player:"Logan",score:124,season:"S1"},{id:455,date:"2025-08-09",player:"Aaron",score:124,season:"S1"},{id:456,date:"2025-08-09",player:"Logan",score:94,season:"S1"},{id:457,date:"2025-08-09",player:"Aaron",score:151,season:"S1"},
{id:458,date:"2025-08-14",player:"Logan",score:148,season:"S1"},{id:459,date:"2025-08-14",player:"Evan",score:136,season:"S1"},{id:460,date:"2025-08-14",player:"Logan",score:103,season:"S1"},{id:461,date:"2025-08-14",player:"Evan",score:127,season:"S1"},
{id:462,date:"2025-08-16",player:"Logan",score:113,season:"S1"},{id:463,date:"2025-08-16",player:"Aaron",score:171,season:"S1"},{id:464,date:"2025-08-16",player:"Logan",score:134,season:"S1"},{id:465,date:"2025-08-16",player:"Aaron",score:143,season:"S1"},
{id:466,date:"2025-08-17",player:"Logan",score:131,season:"S1"},{id:467,date:"2025-08-17",player:"Aaron",score:152,season:"S1"},{id:468,date:"2025-08-17",player:"Jared",score:117,season:"S1"},{id:469,date:"2025-08-17",player:"Ethan",score:132,season:"S1"},
{id:470,date:"2025-08-17",player:"Alon",score:95,season:"S1"},{id:471,date:"2025-08-17",player:"Elijah",score:105,season:"S1"},{id:472,date:"2025-08-17",player:"Logan",score:133,season:"S1"},{id:473,date:"2025-08-17",player:"Aaron",score:134,season:"S1"},
{id:474,date:"2025-08-17",player:"Jared",score:79,season:"S1"},{id:475,date:"2025-08-17",player:"Ethan",score:139,season:"S1"},{id:476,date:"2025-08-17",player:"Alon",score:104,season:"S1"},{id:477,date:"2025-08-17",player:"Elijah",score:109,season:"S1"},
{id:478,date:"2025-08-18",player:"Aaron",score:144,season:"S1"},{id:479,date:"2025-08-18",player:"Jared",score:127,season:"S1"},{id:480,date:"2025-08-18",player:"Ethan",score:125,season:"S1"},{id:481,date:"2025-08-18",player:"Alon",score:58,season:"S1"},
{id:482,date:"2025-08-18",player:"Aaron",score:159,season:"S1"},{id:483,date:"2025-08-18",player:"Jared",score:120,season:"S1"},{id:484,date:"2025-08-18",player:"Ethan",score:101,season:"S1"},{id:485,date:"2025-08-18",player:"Alon",score:90,season:"S1"},
{id:486,date:"2025-08-20",player:"Aaron",score:174,season:"S1"},{id:487,date:"2025-08-20",player:"Ethan",score:109,season:"S1"},{id:488,date:"2025-08-20",player:"Alon",score:80,season:"S1"},{id:489,date:"2025-08-20",player:"Alex",score:64,season:"S1"},
{id:490,date:"2025-08-20",player:"Aaron",score:167,season:"S1"},{id:491,date:"2025-08-20",player:"Ethan",score:99,season:"S1"},{id:492,date:"2025-08-20",player:"Alon",score:59,season:"S1"},{id:493,date:"2025-08-20",player:"Alex",score:95,season:"S1"},
{id:494,date:"2025-11-26",player:"Aaron",score:186,season:"S1"},{id:495,date:"2025-11-26",player:"Jared",score:89,season:"S1"},{id:496,date:"2025-11-26",player:"Danny",score:148,season:"S1"},{id:497,date:"2025-11-26",player:"Aaron",score:116,season:"S1"},
{id:498,date:"2025-11-26",player:"Jared",score:142,season:"S1"},{id:499,date:"2025-11-26",player:"Danny",score:136,season:"S1"},{id:500,date:"2025-11-26",player:"Aaron",score:116,season:"S1"},{id:501,date:"2025-11-26",player:"Jared",score:79,season:"S1"},
{id:502,date:"2025-11-26",player:"Danny",score:155,season:"S1"},
{id:503,date:"2025-12-14",player:"Jared",score:50,season:"S1"},{id:504,date:"2025-12-14",player:"Danny",score:109,season:"S1"},{id:505,date:"2025-12-14",player:"Jared",score:111,season:"S1"},{id:506,date:"2025-12-14",player:"Danny",score:194,season:"S1"},
{id:507,date:"2025-12-14",player:"Jared",score:96,season:"S1"},{id:508,date:"2025-12-14",player:"Danny",score:180,season:"S1"},
];

// ─── Analytics ─────────────────────────────────────────────────────────────────
function mean(a){return a.length?a.reduce((s,v)=>s+v,0)/a.length:null;}
function sd(a){if(a.length<2)return 0;const m=mean(a);return Math.sqrt(a.reduce((s,v)=>s+(v-m)**2,0)/a.length);}
function rolling(sc,n=5){return sc.map((_,i)=>i<n-1?null:mean(sc.slice(i-n+1,i+1)));}
function bestStretch(sc,n=5){if(sc.length<n)return null;let b=-Infinity;for(let i=n-1;i<sc.length;i++){const a=mean(sc.slice(i-n+1,i+1));if(a>b)b=a;}return{avg:b};}
function improvement(sc,n=5){if(sc.length<n*2)return null;const f=mean(sc.slice(0,n)),l=mean(sc.slice(-n));return{first:f,last:l,delta:l-f};}
function biggestSwing(gs){const by={};gs.forEach(g=>{if(!by[g.date])by[g.date]=[];by[g.date].push(g.score);});let best=null;Object.entries(by).forEach(([d,s])=>{if(s.length<2)return;const sw=Math.max(...s)-Math.min(...s);if(!best||sw>best.swing)best={date:d,swing:sw};});return best;}
function bestDay(gs){const by={};gs.forEach(g=>{if(!by[g.date])by[g.date]=[];by[g.date].push(g.score);});let best=null;Object.entries(by).forEach(([d,s])=>{const a=mean(s);if(!best||a>best.avg)best={date:d,avg:a};});return best;}
function hotCold(sc){if(sc.length<5)return"neutral";const d=mean(sc.slice(-5))-mean(sc);return d>7?"hot":d<-7?"cold":"neutral";}
function trendDir(sc){const r=rolling(sc,5).filter(Boolean);if(r.length<3)return"flat";const xs=r.map((_,i)=>i),mx=mean(xs),my=mean(r);const sl=xs.reduce((s,x,i)=>s+(x-mx)*(r[i]-my),0)/xs.reduce((s,x)=>s+(x-mx)**2,0);return sl>0.25?"up":sl<-0.25?"down":"flat";}
function calcStats(gs,player,season){
const pg=gs.filter(g=>g.player===player&&(season?g.season===season:true)).sort((a,b)=>new Date(a.date)-new Date(b.date));
if(!pg.length)return null;
const sc=pg.map(g=>g.score);
return{player,gameCount:sc.length,avg:mean(sc),high:Math.max(...sc),low:Math.min(...sc),stdDev:sd(sc),
last5:mean(sc.slice(-5)),last5Delta:mean(sc.slice(-5))-mean(sc),stretch:bestStretch(sc),imp:improvement(sc),
swing:biggestSwing(pg),bestDay:bestDay(pg),roll:rolling(sc,5),scores:sc,rawGames:pg,hc:hotCold(sc),trend:trendDir(sc)};
}
function getStats(gs,players,season){
return players.map(p=>calcStats(gs,p,season==="all"?null:season)).filter(Boolean).sort((a,b)=>b.avg-a.avg);
}
function fd(d){if(!d)return"—";return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});}
function fdelta(v){if(v==null)return"—";return(v>0?"+":"")+v.toFixed(1);}

// ─── Reusable UI ───────────────────────────────────────────────────────────────
const DS = {fontFamily:"'Barlow Condensed',sans-serif"};
function Pill({label,color=C.accent}){return <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:999,background:color+"22",color,fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>;}
function StatusPill({s}){if(s==="hot")return<Pill label="🔥 Hot" color={C.red}/>;if(s==="cold")return<Pill label="❄️ Cold" color={C.blue}/>;return<Pill label="Steady" color={C.muted}/>;}
function Arrow({dir}){return<span style={{color:dir==="up"?C.green:dir==="down"?C.red:C.muted,fontSize:15}}>{dir==="up"?"↑":dir==="down"?"↓":"→"}</span>;}
function Kpi({label,value,sub,accent=false,lg=false}){
return<div style={{background:C.surface,border:`1px solid ${accent?C.accent+"55":C.border}`,borderRadius:10,padding:"11px 13px",minWidth:80}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{label}</div>
<div style={{...DS,fontSize:lg?28:21,fontWeight:800,color:accent?C.accent:C.text,lineHeight:1}}>{value??<span style={{color:C.muted}}>—</span>}</div>
{sub&&<div style={{fontSize:9,color:C.muted,marginTop:2}}>{sub}</div>}
</div>;
}
function Card({children,style={},onClick}){return<div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"15px 17px",...style,cursor:onClick?"pointer":"default"}}>{children}</div>;}
function ST({t,sub}){return<div style={{marginBottom:14}}><h2 style={{...DS,fontSize:19,fontWeight:800,color:C.text,margin:0}}>{t}</h2>{sub&&<p style={{color:C.muted,fontSize:11,margin:"3px 0 0"}}>{sub}</p>}</div>;}
function MS({l,v}){return<div style={{textAlign:"center"}}><div style={{fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{l}</div><div style={{fontSize:12,fontWeight:600}}>{v}</div></div>;}
function rankColor(i){return i===0?C.accent:i===1?"#C0C0C0":i===2?"#CD7F32":C.muted;}
const INP={background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,padding:"7px 10px",fontSize:12,outline:"none",width:"100%"};
const BACC={background:C.accent,border:"none",color:C.bg,padding:"7px 18px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"};
const BSEC={background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"7px 12px",borderRadius:8,fontSize:12,cursor:"pointer",whiteSpace:"nowrap"};
const BRED={background:C.red+"22",border:`1px solid ${C.red}`,color:C.red,padding:"6px 11px",borderRadius:7,fontSize:11,cursor:"pointer",whiteSpace:"nowrap"};

// ─── Nav ───────────────────────────────────────────────────────────────────────
const PAGES=[
{id:"home",l:"Home",icon:"🏠"},
{id:"lb",l:"Standings",icon:"🏆"},
{id:"players",l:"Players",icon:"🎳"},
{id:"sessions",l:"Sessions",icon:"📅"},
{id:"records",l:"Records",icon:"⭐"},
{id:"sheet",l:"Score Sheet",icon:"📋"},
{id:"manage",l:"Manage",icon:"⚙️"},
{id:"enter",l:"Add Scores",icon:"➕"},
];
// Bottom 5 tabs shown always; rest in hamburger
const BOTTOM_TABS=[
{id:"home",l:"Home",icon:"🏠"},
{id:"lb",l:"Standings",icon:"🏆"},
{id:"players",l:"Players",icon:"🎳"},
{id:"enter",l:"Add Scores",icon:"➕"},
{id:"more",l:"More",icon:"☰"},
];

function Nav({page,setPage,season,setSeason}){
const [menuOpen,setMenuOpen]=useState(false);
const MORE_PAGES=[
{id:"sessions",l:"Sessions",icon:"📅"},
{id:"records",l:"Records",icon:"⭐"},
{id:"sheet",l:"Score Sheet",icon:"📋"},
{id:"manage",l:"Manage",icon:"⚙️"},
];
function go(id){setPage(id);setMenuOpen(false);}
const isMore=MORE_PAGES.some(p=>p.id===page);
return<>
{/* Top bar */}
<nav style={{background:C.surface+"F8",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100}}>
<div style={{maxWidth:1080,margin:"0 auto",padding:"0 14px",display:"flex",alignItems:"center",justifyContent:"space-between",height:50}}>
<button onClick={()=>go("home")} style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:7,cursor:"pointer",padding:0}}>
<span style={{fontSize:18}}>🎳</span>
<span style={{...DS,fontSize:16,fontWeight:800,color:C.accent,letterSpacing:"0.03em"}}>Bowling for the Gënts</span>
</button>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<select value={season} onChange={e=>setSeason(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text,padding:"5px 8px",borderRadius:7,fontSize:11,outline:"none",cursor:"pointer"}}>
<option value="S2">S2</option><option value="S1">S1</option><option value="all">All</option>
</select>
</div>
</div>
</nav>

{/* Drawer overlay */}
{menuOpen&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,background:"#000000AA",zIndex:200}}/>}

{/* Slide-up drawer */}
<div style={{
position:"fixed",bottom:menuOpen?0:"-100%",left:0,right:0,zIndex:201,
background:C.card,borderTop:`1px solid ${C.border}`,borderRadius:"20px 20px 0 0",
padding:"16px 0 calc(16px + env(safe-area-inset-bottom))",
transition:"bottom 0.28s cubic-bezier(0.32,0.72,0,1)",
maxHeight:"70vh",overflowY:"auto",
}}>
<div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 18px"}}/>
<div style={{padding:"0 8px",marginBottom:10}}>
<div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",padding:"0 8px",marginBottom:8}}>More</div>
{MORE_PAGES.map(p=><button key={p.id} onClick={()=>go(p.id)} style={{
display:"flex",alignItems:"center",gap:14,width:"100%",background:page===p.id?C.accent+"18":"none",
border:"none",padding:"14px 16px",borderRadius:10,color:page===p.id?C.accent:C.text,
fontSize:15,fontWeight:page===p.id?700:400,cursor:"pointer",marginBottom:2,
}}>
<span style={{fontSize:20,width:28,textAlign:"center"}}>{p.icon}</span>
<span>{p.l}</span>
{page===p.id&&<span style={{marginLeft:"auto",color:C.accent,fontSize:12}}>●</span>}
</button>)}
</div>
</div>

{/* Bottom tab bar */}
<div style={{
position:"fixed",bottom:0,left:0,right:0,zIndex:100,
background:C.surface+"F8",backdropFilter:"blur(12px)",
borderTop:`1px solid ${C.border}`,
display:"flex",
paddingBottom:"env(safe-area-inset-bottom)",
}}>
{BOTTOM_TABS.map(t=>{
const active=t.id==="more"?isMore:page===t.id;
return<button key={t.id} onClick={()=>t.id==="more"?setMenuOpen(o=>!o):go(t.id)} style={{
flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
gap:3,padding:"10px 4px 8px",background:"none",border:"none",cursor:"pointer",
color:active?C.accent:C.muted,minHeight:56,
}}>
<span style={{fontSize:20,lineHeight:1}}>{t.icon}</span>
<span style={{fontSize:9,fontWeight:active?700:400,letterSpacing:"0.02em",whiteSpace:"nowrap"}}>{t.l}</span>
{active&&<span style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",width:24,height:2,background:C.accent,borderRadius:1}}/>}
</button>;
})}
</div>
{/* Spacer so content isn't hidden behind bottom bar */}
<div style={{height:56}}/>
</>;
}

// ─── HOME ──────────────────────────────────────────────────────────────────────
function HomePage({games,players,season,setPage,setFP}){
const s=season==="all"?"S2":season;
const g=useMemo(()=>games.filter(x=>x.season===s),[games,s]);
const sc=g.map(x=>x.score);
const dates=useMemo(()=>[...new Set(g.map(x=>x.date))],[g]);
const grp={total:g.length,avg:mean(sc),high:sc.length?Math.max(...sc):0,sessions:dates.length,active:new Set(g.map(x=>x.player)).size};
const stats=useMemo(()=>getStats(g,players,s),[g,players,s]);
const leader=stats[0];
const mostImp=useMemo(()=>[...stats].filter(x=>x.imp).sort((a,b)=>b.imp.delta-a.imp.delta)[0],[stats]);
const hot=stats.filter(x=>x.hc==="hot").slice(0,3);
const devs=useMemo(()=>{
const d=[];
stats.forEach(st=>{
if(st.scores.slice(-3).includes(st.high)&&st.gameCount>5)d.push({icon:"🎳",text:`${st.player} set a personal best of ${st.high}`,bc:C.accent});
if(st.hc==="hot"&&st.gameCount>=5)d.push({icon:"🔥",text:`${st.player} is on fire — last 5 avg ${st.last5?.toFixed(1)} vs ${st.avg?.toFixed(1)} season avg`,bc:C.red});
if(st.imp?.delta>14)d.push({icon:"📈",text:`${st.player} improved ${st.imp.delta.toFixed(1)} pins from first to last 5`,bc:C.green});
if(st.swing?.swing>55)d.push({icon:"⚡",text:`${st.player} had a ${st.swing.swing}-pin single-night swing`,bc:C.blue});
});
return d.slice(0,5);
},[stats]);

return<div>
<div style={{background:`linear-gradient(160deg,${C.bg} 0%,#161020 60%,${C.bg} 100%)`,padding:"24px 16px 20px",textAlign:"center",borderBottom:`1px solid ${C.border}`}}>
<h1 style={{...DS,fontSize:36,fontWeight:800,color:C.accent,letterSpacing:"-0.01em",lineHeight:1,margin:"0 0 5px"}}>Bowling for the Gënts</h1>
<p style={{color:C.muted,fontSize:12,marginBottom:16}}>{s==="S2"?"Season 2":"Season 1"} · {grp.sessions} sessions · {grp.active} players</p>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,maxWidth:360,margin:"0 auto"}}>
<div style={{background:C.card,border:`1px solid ${C.accent}55`,borderRadius:12,padding:"14px 8px",gridColumn:"1/-1"}}>
<div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>Group Average</div>
<div style={{...DS,fontSize:40,fontWeight:800,color:C.accent,lineHeight:1}}>{grp.avg?.toFixed(1)||"—"}</div>
</div>
{[{l:"Season High",v:grp.high||"—"},{l:"Sessions",v:grp.sessions},{l:"Games Bowled",v:grp.total},{l:"Active Players",v:grp.active}].map(k=><div key={k.l} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 8px"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k.l}</div>
<div style={{...DS,fontSize:26,fontWeight:800,color:C.text,lineHeight:1}}>{k.v}</div>
</div>)}
</div>
</div>
<div style={{padding:"16px 14px",maxWidth:640,margin:"0 auto"}}>
{devs.length>0&&<div style={{marginBottom:20}}>
<div style={{...DS,fontSize:17,fontWeight:800,color:C.text,marginBottom:10}}>Recent Developments</div>
{devs.map((d,i)=><div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`3px solid ${d.bc}`,borderRadius:10,padding:"12px 13px",display:"flex",gap:10,alignItems:"flex-start",marginBottom:7}}>
<span style={{fontSize:16,lineHeight:1,marginTop:1,flexShrink:0}}>{d.icon}</span>
<p style={{fontSize:13,color:C.text,lineHeight:1.5,margin:0}}>{d.text}</p>
</div>)}
</div>}
{leader&&<div onClick={()=>{setFP(leader.player);setPage("players");}} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.accent}`,borderRadius:12,padding:"14px 16px",marginBottom:9,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:10,color:C.accent,fontWeight:700,textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>🏆 Season Leader</div>
<div style={{...DS,fontSize:28,fontWeight:800}}>{leader.player}</div>
<div style={{color:C.muted,fontSize:12,marginTop:2}}>{leader.avg?.toFixed(1)} avg · {leader.gameCount} games</div></div>
<div style={{textAlign:"right"}}><StatusPill s={leader.hc}/><div style={{...DS,fontSize:24,fontWeight:800,color:C.accent,marginTop:6}}>{leader.high}</div><div style={{fontSize:10,color:C.muted}}>high</div></div>
</div>}
{mostImp&&<div onClick={()=>{setFP(mostImp.player);setPage("players");}} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.green}`,borderRadius:12,padding:"14px 16px",marginBottom:9,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:10,color:C.green,fontWeight:700,textTransform:"uppercase",letterSpacing:".09em",marginBottom:4}}>📈 Most Improved</div>
<div style={{...DS,fontSize:28,fontWeight:800}}>{mostImp.player}</div>
<div style={{color:C.muted,fontSize:12,marginTop:2}}>{mostImp.imp.first?.toFixed(1)} → {mostImp.imp.last?.toFixed(1)} avg</div></div>
<div style={{textAlign:"right"}}><div style={{...DS,fontSize:28,fontWeight:800,color:C.green}}>{fdelta(mostImp.imp.delta)}</div><div style={{fontSize:10,color:C.muted}}>pins gained</div></div>
</div>}
{hot.length>0&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.red}`,borderRadius:12,padding:"14px 16px",marginBottom:9}}>
<div style={{fontSize:10,color:C.red,fontWeight:700,textTransform:"uppercase",letterSpacing:".09em",marginBottom:10}}>🔥 Running Hot</div>
{hot.map(p=><div key={p.player} onClick={()=>{setFP(p.player);setPage("players");}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
<span style={{fontWeight:600,fontSize:15}}>{p.player}</span>
<div style={{textAlign:"right"}}><div style={{color:C.red,fontSize:13,fontWeight:600}}>{fdelta(p.last5Delta)} vs avg</div><div style={{color:C.muted,fontSize:11}}>last 5: {p.last5?.toFixed(1)}</div></div>
</div>)}
</div>}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,marginTop:4}}>
<div style={{...DS,fontSize:17,fontWeight:800,color:C.text}}>Season Standings</div>
<button onClick={()=>setPage("lb")} style={{background:"none",border:`1px solid ${C.border}`,color:C.accent,padding:"6px 12px",borderRadius:8,fontSize:12,cursor:"pointer"}}>Full →</button>
</div>
{stats.slice(0,5).map((st,i)=><div key={st.player} onClick={()=>{setFP(st.player);setPage("players");}} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"13px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
<span style={{...DS,fontSize:22,fontWeight:800,color:rankColor(i),width:28,flexShrink:0,textAlign:"center"}}>{i+1}</span>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{fontWeight:700,fontSize:15}}>{st.player}</span><StatusPill s={st.hc}/></div>
<div style={{color:C.muted,fontSize:12}}>{st.gameCount} games · last 5: {st.last5?.toFixed(1)}</div>
</div>
<div style={{textAlign:"right",flexShrink:0}}>
<div style={{...DS,fontSize:24,fontWeight:800,color:C.accent}}>{st.avg?.toFixed(1)}</div>
<div style={{fontSize:10,color:C.muted}}>avg</div>
</div>
</div>)}
</div>
</div>;
}

// ─── LEADERBOARD ───────────────────────────────────────────────────────────────
function LbPage({games,players,season,setPage,setFP}){
const g=season==="all"?games:games.filter(x=>x.season===season);
const [sb,setSb]=useState("avg");
const stats=useMemo(()=>{
let s=getStats(g,players,season);
s.sort((a,b)=>{
if(sb==="avg")return b.avg-a.avg;if(sb==="high")return b.high-a.high;if(sb==="games")return b.gameCount-a.gameCount;
if(sb==="last5")return(b.last5||0)-(a.last5||0);if(sb==="imp")return(b.imp?.delta||-99)-(a.imp?.delta||-99);
if(sb==="cons")return a.stdDev-b.stdDev;if(sb==="stretch")return(b.stretch?.avg||0)-(a.stretch?.avg||0);return 0;
});
return s;
},[g,players,season,sb]);
const cols=[{id:"avg",l:"Avg"},{id:"high",l:"High"},{id:"last5",l:"Last 5"},{id:"imp",l:"Improvement"},{id:"stretch",l:"Stretch"},{id:"cons",l:"Consistency"},{id:"games",l:"Games"}];
function statVal(s){
if(sb==="avg")return s.avg?.toFixed(1);if(sb==="high")return s.high;if(sb==="last5")return s.last5?.toFixed(1);
if(sb==="imp")return s.imp?fdelta(s.imp.delta):"—";if(sb==="stretch")return s.stretch?.avg?.toFixed(1)||"—";
if(sb==="cons")return s.stdDev?.toFixed(1);if(sb==="games")return s.gameCount;return"—";
}
function statSub(s){
if(sb==="avg")return`${s.gameCount} games`;if(sb==="high")return fd(s.rawGames.find(g=>g.score===s.high)?.date).replace(/,.*/,"");
if(sb==="last5")return`${fdelta(s.last5Delta)} vs avg`;if(sb==="imp")return s.imp?`${s.imp.first?.toFixed(1)} → ${s.imp.last?.toFixed(1)}`:"";
if(sb==="stretch")return"best 5 games";if(sb==="cons")return"std dev";if(sb==="games")return"games bowled";return"";
}
return<div style={{padding:"16px 14px",maxWidth:640,margin:"0 auto"}}>
<div style={{...DS,fontSize:19,fontWeight:800,color:C.text,marginBottom:12}}>Leaderboard</div>
<div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
{cols.map(c=><button key={c.id} onClick={()=>setSb(c.id)} style={{background:sb===c.id?C.accent:C.card,border:`1px solid ${sb===c.id?C.accent:C.border}`,color:sb===c.id?C.bg:C.text,padding:"7px 12px",borderRadius:20,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{c.l}</button>)}
</div>
{stats.map((s,i)=><div key={s.player} onClick={()=>{setFP(s.player);setPage("players");}} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:11,padding:"13px 14px",marginBottom:7,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
<span style={{...DS,fontSize:20,fontWeight:800,color:rankColor(i),width:26,flexShrink:0,textAlign:"center"}}>{i+1}</span>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
<span style={{fontWeight:700,fontSize:14}}>{s.player}</span>
<StatusPill s={s.hc}/>
</div>
<div style={{color:C.muted,fontSize:11}}>{statSub(s)}</div>
</div>
<div style={{textAlign:"right",flexShrink:0}}>
<div style={{...DS,fontSize:24,fontWeight:800,color:sb==="imp"?(s.imp?.delta>0?C.green:C.red):C.accent}}>{statVal(s)}</div>
<Arrow dir={s.trend}/>
</div>
</div>)}
</div>;
}

function PlayersPage({games,players,season,focusPlayer,setFP}){
const g=season==="all"?games:games.filter(x=>x.season===season);
const allS=useMemo(()=>getStats(g,players,season),[g,players,season]);
const sel=focusPlayer||players[0];
const ps=useMemo(()=>calcStats(g,sel,season==="all"?null:season),[g,sel,season]);
const career=useMemo(()=>calcStats(games,sel,null),[games,sel]);
const chartData=useMemo(()=>ps?ps.rawGames.map((g,i)=>({n:i+1,score:g.score,rolling:ps.roll[i]!=null?+ps.roll[i].toFixed(1):undefined})):[], [ps]);
return<div style={{maxWidth:640,margin:"0 auto"}}>
{/* Horizontal scrolling player pills */}
<div style={{overflowX:"auto",padding:"12px 14px 8px",borderBottom:`1px solid ${C.border}`}}>
<div style={{display:"flex",gap:7,width:"max-content"}}>
{players.map(p=>{const ps2=allS.find(x=>x.player===p);const active=sel===p;return<button key={p} onClick={()=>setFP(p)} style={{background:active?C.accent:"none",border:`1px solid ${active?C.accent:C.border}`,borderRadius:20,padding:"7px 14px",color:active?C.bg:C.text,fontSize:13,fontWeight:active?700:400,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>
{p}{ps2?` ${ps2.avg?.toFixed(0)}`:""}
{ps2?.hc==="hot"?" 🔥":ps2?.hc==="cold"?" ❄️":""}
</button>;})}
</div>
</div>
{ps?<div style={{padding:"16px 14px"}}>
{/* Player header */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
<div>
<h1 style={{...DS,fontSize:36,fontWeight:800,lineHeight:1,margin:"0 0 7px"}}>{ps.player}</h1>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}><StatusPill s={ps.hc}/><Pill label={ps.trend==="up"?"↑ Rising":ps.trend==="down"?"↓ Falling":"→ Steady"} color={ps.trend==="up"?C.green:ps.trend==="down"?C.red:C.muted}/><Pill label={`${ps.gameCount} games`} color={C.blue}/></div>
</div>
{career&&career.gameCount>(ps.gameCount||0)&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"8px 12px",textAlign:"right"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".07em",marginBottom:3}}>Career</div>
<div style={{fontSize:12}}><span style={{color:C.accent,fontWeight:700}}>{career.avg?.toFixed(1)}</span> · {career.gameCount}g</div>
<div style={{fontSize:10,color:C.muted}}>High: {career.high}</div>
</div>}
</div>
{/* 2-col stat grid */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
<div style={{background:C.surface,border:`1px solid ${C.accent}55`,borderRadius:10,padding:"11px 12px",gridColumn:"1/-1"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>Season Avg</div>
<div style={{...DS,fontSize:36,fontWeight:800,color:C.accent,lineHeight:1}}>{ps.avg?.toFixed(1)}</div>
</div>
{[{l:"Last 5 Avg",v:ps.last5?.toFixed(1),s:fdelta(ps.last5Delta)+" vs avg"},{l:"High Game",v:ps.high,s:""},{l:"Low Game",v:ps.low,s:""},{l:"Std Dev",v:ps.stdDev?.toFixed(1),s:"consistency"},{l:"Best Stretch",v:ps.stretch?.avg?.toFixed(1),s:"5-game avg"},{l:"Games",v:ps.gameCount,s:""}].map(k=><div key={k.l} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k.l}</div>
<div style={{...DS,fontSize:24,fontWeight:800,lineHeight:1}}>{k.v??<span style={{color:C.muted}}>—</span>}</div>
{k.s&&<div style={{fontSize:10,color:C.muted,marginTop:2}}>{k.s}</div>}
</div>)}
</div>
{/* Extra stats row */}
{(ps.imp||ps.bestDay||ps.swing)&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8,marginBottom:14}}>
{ps.imp&&<div style={{background:C.surface,border:`1px solid ${ps.imp.delta>0?C.accent+"55":C.border}`,borderRadius:10,padding:"11px 12px"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Improvement</div>
<div style={{...DS,fontSize:24,fontWeight:800,color:ps.imp.delta>0?C.accent:ps.imp.delta<0?C.red:C.text,lineHeight:1}}>{fdelta(ps.imp.delta)}</div>
<div style={{fontSize:10,color:C.muted,marginTop:2}}>{ps.imp.first?.toFixed(1)} → {ps.imp.last?.toFixed(1)}</div>
</div>}
{ps.bestDay&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Best Night</div>
<div style={{...DS,fontSize:24,fontWeight:800,lineHeight:1}}>{ps.bestDay.avg?.toFixed(1)}</div>
<div style={{fontSize:10,color:C.muted,marginTop:2}}>{fd(ps.bestDay.date).replace(/,.*/,"")}</div>
</div>}
{ps.swing&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px"}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>Biggest Swing</div>
<div style={{...DS,fontSize:24,fontWeight:800,lineHeight:1}}>{ps.swing.swing}p</div>
<div style={{fontSize:10,color:C.muted,marginTop:2}}>{fd(ps.swing.date).replace(/,.*/,"")}</div>
</div>}
</div>}
{/* Chart */}
<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px",marginBottom:12}}>
<div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:11}}>Score History + Rolling 5-Game Avg</div>
<ResponsiveContainer width="100%" height={190}>
<LineChart data={chartData} margin={{top:5,right:6,bottom:3,left:-18}}>
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
{/* Score log */}
<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px"}}>
<div style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Score Log</div>
<div style={{display:"flex",flexWrap:"wrap",gap:5}}>
{ps.rawGames.map((g,i)=><div key={i} style={{background:g.score===ps.high?C.accent+"22":C.surface,border:`1px solid ${g.score===ps.high?C.accent:C.border}`,borderRadius:7,padding:"6px 9px",textAlign:"center",minWidth:44}}>
<div style={{...DS,fontSize:16,fontWeight:800,color:g.score===ps.high?C.accent:g.score>=(ps.avg+10)?C.green:g.score<=(ps.avg-10)?C.red:C.text}}>{g.score}</div>
<div style={{fontSize:8,color:C.muted}}>{fd(g.date).replace(/,.*/,"")}</div>
</div>)}
</div>
</div>
</div>:<div style={{color:C.muted,padding:40,textAlign:"center"}}>No games for {sel} this period.</div>}
</div>;
}

function SessionsPage({games,season}){
const g=season==="all"?games:games.filter(x=>x.season===season);
const sessions=useMemo(()=>{
const by={};g.forEach(x=>{if(!by[x.date])by[x.date]=[];by[x.date].push(x);});
return Object.entries(by).sort(([a],[b])=>new Date(b)-new Date(a)).map(([date,sg])=>{
const sc=sg.map(x=>x.score);return{date,sg,sc,avg:mean(sc),high:Math.max(...sc),low:Math.min(...sc),highP:sg.find(x=>x.score===Math.max(...sc))?.player};
});
},[g]);
const [open,setOpen]=useState(null);
return<div style={{maxWidth:640,margin:"0 auto",padding:"16px 14px"}}>
<div style={{...DS,fontSize:19,fontWeight:800,color:C.text,marginBottom:4}}>Session History</div>
<div style={{fontSize:12,color:C.muted,marginBottom:14}}>{sessions.length} nights on record</div>
{sessions.map((s,i)=><div key={s.date} style={{marginBottom:8}}>
<div onClick={()=>setOpen(open===i?null:i)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:open===i?"12px 12px 0 0":12,padding:"14px 15px",cursor:"pointer"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<span style={{...DS,fontSize:15,fontWeight:700}}>{fd(s.date)}</span>
<span style={{color:C.muted,fontSize:13}}>{open===i?"▲":"▼"}</span>
</div>
<div style={{display:"flex",gap:8}}>
{[{l:"Avg",v:s.avg?.toFixed(1)},{l:"High",v:s.high},{l:"Low",v:s.low},{l:"Games",v:s.sc.length}].map(k=><div key={k.l} style={{flex:1,background:C.surface,borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
<div style={{fontSize:8,color:C.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>{k.l}</div>
<div style={{...DS,fontSize:16,fontWeight:800}}>{k.v}</div>
</div>)}
</div>
<div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:8}}>
{[...new Set(s.sg.map(x=>x.player))].map(p=><span key={p} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:20,padding:"3px 8px",fontSize:11,color:C.textDim}}>{p}</span>)}
</div>
</div>
{open===i&&<div style={{background:C.surface,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"14px 15px"}}>
<div style={{fontSize:11,color:C.muted,marginBottom:10}}>High game: <strong style={{color:C.text}}>{s.highP} — {s.high}</strong></div>
<div style={{display:"flex",flexWrap:"wrap",gap:7}}>
{s.sg.sort((a,b)=>b.score-a.score).map((g,j)=><div key={j} style={{background:C.card,border:`1px solid ${g.score===s.high?C.accent:C.border}`,borderRadius:9,padding:"9px 14px",textAlign:"center"}}>
<div style={{...DS,fontSize:22,fontWeight:800,color:g.score===s.high?C.accent:C.text}}>{g.score}</div>
<div style={{fontSize:11,color:C.muted}}>{g.player}</div>
</div>)}
</div>
</div>}
</div>)}
</div>;
}

function RecordsPage({games,players,season}){
const g=season==="all"?games:games.filter(x=>x.season===season);
const stats=useMemo(()=>getStats(g,players,season),[g,players,season]);
const cats=[
{t:"Highest Single Game",icon:"🎳",rows:[...stats].sort((a,b)=>b.high-a.high).slice(0,5).map(s=>({p:s.player,v:s.high,sub:fd(s.rawGames.find(g=>g.score===s.high)?.date).replace(/,.*/,"") }))},
{t:"Season Average",icon:"📊",rows:stats.slice(0,5).map(s=>({p:s.player,v:s.avg?.toFixed(1),sub:`${s.gameCount} games`}))},
{t:"Most Improved",icon:"📈",rows:[...stats].filter(x=>x.imp).sort((a,b)=>b.imp.delta-a.imp.delta).slice(0,5).map(s=>({p:s.player,v:fdelta(s.imp.delta),sub:`${s.imp.first?.toFixed(1)} → ${s.imp.last?.toFixed(1)}`}))},
{t:"Best 5-Game Stretch",icon:"🔥",rows:[...stats].sort((a,b)=>(b.stretch?.avg||0)-(a.stretch?.avg||0)).slice(0,5).map(s=>({p:s.player,v:s.stretch?.avg?.toFixed(1)||"—",sub:"avg over best 5"}))},
{t:"Most Consistent",icon:"🎯",rows:[...stats].filter(x=>x.gameCount>=5).sort((a,b)=>a.stdDev-b.stdDev).slice(0,5).map(s=>({p:s.player,v:s.stdDev?.toFixed(1),sub:"std dev (lower = better)"}))},
{t:"Biggest Single-Night Swing",icon:"⚡",rows:[...stats].filter(x=>x.swing).sort((a,b)=>b.swing.swing-a.swing.swing).slice(0,5).map(s=>({p:s.player,v:`${s.swing.swing}p`,sub:fd(s.swing.date).replace(/,.*/,"") }))},
{t:"Best Night Average",icon:"🌙",rows:[...stats].filter(x=>x.bestDay).sort((a,b)=>b.bestDay.avg-a.bestDay.avg).slice(0,5).map(s=>({p:s.player,v:s.bestDay.avg?.toFixed(1),sub:fd(s.bestDay.date).replace(/,.*/,"") }))},
{t:"Most Games Bowled",icon:"📅",rows:[...stats].sort((a,b)=>b.gameCount-a.gameCount).slice(0,5).map(s=>({p:s.player,v:s.gameCount,sub:"games this season"}))},
];
return<div style={{maxWidth:640,margin:"0 auto",padding:"16px 14px"}}>
<div style={{...DS,fontSize:19,fontWeight:800,color:C.text,marginBottom:4}}>Record Book</div>
<div style={{fontSize:12,color:C.muted,marginBottom:14}}>Season achievements and category leaders</div>
{cats.map(cat=><div key={cat.t} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
<span style={{fontSize:18}}>{cat.icon}</span>
<span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",color:C.accent}}>{cat.t}</span>
</div>
{cat.rows.map((r,i)=><div key={r.p} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<cat.rows.length-1?`1px solid ${C.border}`:"none"}}>
<div style={{display:"flex",alignItems:"center",gap:10}}>
<span style={{...DS,fontSize:16,fontWeight:800,color:i===0?C.accent:C.muted,width:18,textAlign:"center"}}>{i+1}</span>
<div><div style={{fontSize:14,fontWeight:i===0?700:400}}>{r.p}</div><div style={{fontSize:11,color:C.muted}}>{r.sub}</div></div>
</div>
<span style={{...DS,fontSize:22,fontWeight:800,color:i===0?C.accent:C.text}}>{r.v}</span>
</div>)}
</div>)}
</div>;
}

function ScoreSheetPage({games,players,setGames,setPlayers,nextId,setNextId}){
const [filterSeason,setFilterSeason]=useState("S2");
const [newDate,setNewDate]=useState("");
const [newSeason,setNewSeason]=useState("S2");
const [newPlayerName,setNewPlayerName]=useState("");
const [addPlayerMsg,setAddPlayerMsg]=useState(null);
const [saved,setSaved]=useState(false);

// Build grid: one row per (date, game-index) combo
// game-index = how many games that player has already had on that date
const filtered = useMemo(()=>
(filterSeason==="all"?games:games.filter(g=>g.season===filterSeason))
.sort((a,b)=>new Date(a.date)-new Date(b.date)||a.player.localeCompare(b.player))
,[games,filterSeason]);

// Build rows: each unique (date, rowIndex) where rowIndex is 0,1,2...
// For each date, find max games any single player played
const rows = useMemo(()=>{
const byDate={};
filtered.forEach(g=>{
if(!byDate[g.date])byDate[g.date]=[];
byDate[g.date].push(g);
});
const result=[];
Object.entries(byDate).sort(([a],[b])=>new Date(a)-new Date(b)).forEach(([date,gs])=>{
// how many rows for this date = max games any player played
const countByPlayer={};
gs.forEach(g=>{ countByPlayer[g.player]=(countByPlayer[g.player]||0)+1; });
const maxRows=Math.max(...Object.values(countByPlayer),1);
for(let r=0;r<maxRows;r++){
result.push({date, rowIndex:r, season:gs[0].season});
}
});
return result;
},[filtered]);

// Build a lookup: {date_rowIndex_player} -> game object
const lookup = useMemo(()=>{
const map={};
const countByDatePlayer={};
filtered.forEach(g=>{
const key=`${g.date}_${g.player}`;
const idx=countByDatePlayer[key]||0;
countByDatePlayer[key]=idx+1;
map[`${g.date}_${idx}_${g.player}`]=g;
});
return map;
},[filtered]);

function cellKey(date,rowIndex,player){return `${date}_${rowIndex}_${player}`;}

function handleCellChange(date,rowIndex,player,season,val){
const key=cellKey(date,rowIndex,player);
const existing=lookup[key];
const trimmed=val.trim();

if(trimmed===""){
// Delete game if it exists
if(existing){
setGames(prev=>prev.filter(g=>g.id!==existing.id));
setSaved(true); setTimeout(()=>setSaved(false),1500);
}
return;
}
const score=parseInt(trimmed,10);
if(isNaN(score)||score<0||score>300)return;

if(existing){
setGames(prev=>prev.map(g=>g.id===existing.id?{...g,score}:g));
} else {
setGames(prev=>{
const newGame={id:nextId,date,player,score,season};
setNextId(n=>n+1);
return [...prev,newGame];
});
}
setSaved(true); setTimeout(()=>setSaved(false),1500);
}

function addRow(){
if(!newDate){alert("Pick a date first.");return;}
// check if this date already exists
const exists=games.some(g=>g.date===newDate&&(filterSeason==="all"||g.season===filterSeason));
if(!exists){
// add a placeholder — just set state to force a new date row to appear
// We do this by adding a dummy entry that user will fill in
// Actually just update the local newDate state and the grid will show an empty row
// For simplicity, add an empty row by adding a dummy invisible game that won't affect stats
// Better: just force a re-render with the new date visible
}
// We'll just store newDate as a "pending date" shown at bottom
setPendingDates(prev=>[...prev.filter(d=>d.date!==newDate),{date:newDate,season:newSeason}]);
setNewDate("");
}

const [pendingDates,setPendingDates]=useState([]);

function addPlayer(){
const name=newPlayerName.trim();
if(!name){setAddPlayerMsg({ok:false,msg:"Name can't be blank."});return;}
if(players.includes(name)){setAddPlayerMsg({ok:false,msg:`"${name}" already exists.`});return;}
setPlayers(prev=>[...prev,name]);
setNewPlayerName("");
setAddPlayerMsg({ok:true,msg:`${name} added!`});
setTimeout(()=>setAddPlayerMsg(null),2500);
}

// All rows to display = grid rows + pending dates (shown as empty rows at bottom)
const allRows=useMemo(()=>{
const pendingRows=pendingDates
.filter(pd=>!rows.some(r=>r.date===pd.date))
.map(pd=>({date:pd.date,rowIndex:0,season:pd.season,pending:true}));
return [...rows,...pendingRows].sort((a,b)=>new Date(a.date)-new Date(b.date)||a.rowIndex-b.rowIndex);
},[rows,pendingDates]);

const colW=68;
const dateColW=102;
const thStyle={
padding:"7px 5px",fontSize:10,color:C.muted,fontWeight:700,
textTransform:"uppercase",letterSpacing:"0.05em",
borderBottom:`1px solid ${C.border}`,background:C.surface,
textAlign:"center",whiteSpace:"nowrap",position:"sticky",top:0,zIndex:2,
minWidth:colW,maxWidth:colW,width:colW,
};
const tdStyle={
padding:"2px 3px",borderBottom:`1px solid ${C.border}`,
textAlign:"center",minWidth:colW,maxWidth:colW,width:colW,
};
const cellStyle={
background:"transparent",border:"none",color:C.text,
fontSize:13,fontWeight:600,fontFamily:"'Barlow Condensed',sans-serif",
textAlign:"center",width:"100%",padding:"5px 3px",outline:"none",
borderRadius:4,
};

// Group rows by date for row-span display
const dateGroups=useMemo(()=>{
const groups={};
allRows.forEach((r,i)=>{
if(!groups[r.date])groups[r.date]={start:i,count:0};
groups[r.date].count++;
});
return groups;
},[allRows]);

function fd(d){if(!d)return"—";return new Date(d+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"});}

return<div style={{maxWidth:"100%",margin:"0 auto",padding:"22px 14px"}}>
{/* Controls */}
<div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",marginBottom:16}}>
<h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:19,fontWeight:800,color:C.text,margin:0}}>Score Sheet</h2>
<div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginLeft:"auto"}}>
<select value={filterSeason} onChange={e=>setFilterSeason(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.text,padding:"5px 9px",borderRadius:7,fontSize:12,outline:"none"}}>
<option value="S2">Season 2</option><option value="S1">Season 1</option><option value="all">All</option>
</select>
{saved&&<span style={{fontSize:11,color:C.green}}>✓ Saved</span>}
</div>
</div>

<p style={{fontSize:11,color:C.muted,marginBottom:14}}>
Click any cell to edit · Leave blank to remove · Tab/Enter to move · Add a row at the bottom for a new session date
</p>

{/* Add player inline */}
<div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
<input value={newPlayerName} onChange={e=>setNewPlayerName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()} placeholder="Add new player…" style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:7,color:C.text,padding:"6px 10px",fontSize:12,outline:"none",width:180}}/>
<button onClick={addPlayer} style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"6px 12px",borderRadius:7,fontSize:12,cursor:"pointer"}}>+ Add Player</button>
{addPlayerMsg&&<span style={{fontSize:11,color:addPlayerMsg.ok?C.green:C.red}}>{addPlayerMsg.msg}</span>}
</div>

{/* The spreadsheet */}
<div style={{overflowX:"auto",border:`1px solid ${C.border}`,borderRadius:10}}>
<table style={{borderCollapse:"collapse",tableLayout:"fixed",width:`${dateColW+70+players.length*colW}px`}}>
<thead>
<tr>
<th style={{...thStyle,width:dateColW,minWidth:dateColW,maxWidth:dateColW,textAlign:"left",paddingLeft:10,position:"sticky",top:0,left:0,zIndex:3,background:C.surface}}>Date</th>
<th style={{...thStyle,width:70,minWidth:70,maxWidth:70}}>Season</th>
{players.map(p=><th key={p} style={thStyle}>{p}</th>)}
</tr>
</thead>
<tbody>
{allRows.map((row,ri)=>{
const isFirst=row.rowIndex===0;
const group=dateGroups[row.date];
const rowBg=ri%2===0?C.card:C.surface;
return<tr key={`${row.date}_${row.rowIndex}`} style={{background:rowBg}}>
{/* Date cell — only show on first row for this date */}
{isFirst
? <td style={{...tdStyle,width:dateColW,minWidth:dateColW,textAlign:"left",paddingLeft:10,
fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,color:C.text,
position:"sticky",left:0,zIndex:1,background:rowBg,
...(group.count>1?{borderBottom:"none"}:{})
}}>
{fd(row.date)}
</td>
: <td style={{...tdStyle,width:dateColW,minWidth:dateColW,position:"sticky",left:0,zIndex:1,background:rowBg,borderTop:"none"}}/>
}
{/* Season cell */}
{isFirst
? <td style={{...tdStyle,width:70,minWidth:70,maxWidth:70,color:C.muted,fontSize:11,
...(group.count>1?{borderBottom:"none"}:{})
}}>{row.season}</td>
: <td style={{...tdStyle,width:70,minWidth:70,maxWidth:70,borderTop:"none"}}/>
}
{/* Score cells */}
{players.map(p=>{
const game=lookup[cellKey(row.date,row.rowIndex,p)];
return<td key={p} style={tdStyle}>
<input
type="number"
min={0} max={300}
defaultValue={game?.score??""} key={game?.id??`${row.date}_${row.rowIndex}_${p}_empty`}
placeholder="·"
onBlur={e=>handleCellChange(row.date,row.rowIndex,p,row.season,e.target.value)}
onKeyDown={e=>{if(e.key==="Enter"||e.key==="Tab"){e.target.blur();}}}
style={{
...cellStyle,
color:game?( game.score>=150?C.accent:game.score>=120?C.green:game.score<=80?C.red:C.text ):C.muted,
opacity:game?.score?1:0.3,
}}
/>
</td>;
})}
</tr>;
})}
{/* Add new date row */}
<tr style={{background:C.bg}}>
<td colSpan={2+players.length} style={{padding:"10px 14px"}}>
<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
<span style={{fontSize:11,color:C.muted}}>Add session:</span>
<input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)}
style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,padding:"5px 9px",fontSize:12,outline:"none"}}/>
<select value={newSeason} onChange={e=>setNewSeason(e.target.value)}
style={{background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"5px 8px",borderRadius:6,fontSize:12,outline:"none"}}>
<option value="S1">Season 1</option><option value="S2">Season 2</option>
</select>
<button onClick={addRow}
style={{background:C.accent,border:"none",color:C.bg,padding:"6px 14px",borderRadius:7,fontSize:12,fontWeight:700,cursor:"pointer"}}>
+ Add Row
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

{/* Legend */}
<div style={{display:"flex",gap:16,marginTop:12,fontSize:11,color:C.muted,flexWrap:"wrap"}}>
<span><span style={{color:C.accent}}>■</span> 150+</span>
<span><span style={{color:C.green}}>■</span> 120–149</span>
<span><span style={{color:C.text}}>■</span> 81–119</span>
<span><span style={{color:C.red}}>■</span> ≤80</span>
<span style={{marginLeft:"auto"}}>Blank cell = player didn't bowl that game</span>
</div>
</div>;
}

function ManagePage({games,players,setGames,setPlayers}){
const [tab,setTab]=useState("players");
const [newName,setNewName]=useState("");
const [msg,setMsg]=useState(null);
const [fP,setFP]=useState("all");
const [fS,setFS]=useState("all");
const [editId,setEditId]=useState(null);
const [editVals,setEditVals]=useState({});
const [delId,setDelId]=useState(null);
const [delSession,setDelSession]=useState(null);

function addPlayer(){
const name=newName.trim();
if(!name){setMsg({ok:false,msg:"Name can't be blank."});return;}
if(players.includes(name)){setMsg({ok:false,msg:`"${name}" is already on the roster.`});return;}
setPlayers(prev=>[...prev,name]);
setNewName("");setMsg({ok:true,msg:`${name} added to the roster!`});
setTimeout(()=>setMsg(null),3000);
}
function removePlayer(p){
const hasGames=games.some(g=>g.player===p);
if(hasGames&&!window.confirm(`Removing ${p} will also delete all their ${games.filter(g=>g.player===p).length} scores. Continue?`))return;
setGames(prev=>prev.filter(g=>g.player!==p));
setPlayers(prev=>prev.filter(x=>x!==p));
setMsg({ok:true,msg:`${p} removed from roster.`});
setTimeout(()=>setMsg(null),3000);
}
function startEdit(g){setEditId(g.id);setEditVals({date:g.date,player:g.player,score:String(g.score),season:g.season});}
function saveEdit(){
const score=+editVals.score;
if(isNaN(score)||score<0||score>300){alert("Score must be 0–300.");return;}
setGames(prev=>prev.map(g=>g.id===editId?{...g,...editVals,score}:g));
setEditId(null);
}
function deleteGame(id){setGames(prev=>prev.filter(g=>g.id!==id));setDelId(null);}
function deleteSession(date){setGames(prev=>prev.filter(g=>g.date!==date));setDelSession(null);}

const filtered=useMemo(()=>games.filter(g=>(fP==="all"||g.player===fP)&&(fS==="all"||g.season===fS)).sort((a,b)=>new Date(b.date)-new Date(a.date)||a.player.localeCompare(b.player)),[games,fP,fS]);
const sessionDates=useMemo(()=>[...new Set(games.filter(g=>fS==="all"||g.season===fS).map(g=>g.date))].sort((a,b)=>new Date(b)-new Date(a)),[games,fS]);

const tabStyle=(t)=>({background:tab===t?C.accent:C.card,border:`1px solid ${tab===t?C.accent:C.border}`,color:tab===t?C.bg:C.text,padding:"7px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer"});

return<div style={{maxWidth:640,margin:"0 auto",padding:"16px 14px"}}>
<ST t="Manage" sub="Add players · Edit or delete individual scores · Delete entire sessions"/>
<div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
<button style={tabStyle("players")} onClick={()=>setTab("players")}>Player Roster</button>
<button style={tabStyle("scores")} onClick={()=>setTab("scores")}>Edit / Delete Scores</button>
<button style={tabStyle("sessions")} onClick={()=>setTab("sessions")}>Delete Sessions</button>
</div>
{msg&&<div style={{background:msg.ok?C.green+"22":C.red+"22",border:`1px solid ${msg.ok?C.green:C.red}`,borderRadius:8,padding:"9px 13px",marginBottom:14,fontSize:12,color:msg.ok?C.green:C.red}}>{msg.msg}</div>}

{tab==="players"&&<div>
<Card style={{marginBottom:16}}>
<div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:11}}>Add New Player</div>
<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
<input value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addPlayer()} placeholder="Full name" style={{...INP,maxWidth:250}}/>
<button style={BACC} onClick={addPlayer}>Add to Roster</button>
</div>
</Card>
<Card>
<div style={{fontSize:10,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em",marginBottom:12}}>Roster — {players.length} players</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:7}}>
{players.map(p=>{const gc=games.filter(g=>g.player===p).length;return<div key={p} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:13,fontWeight:600}}>{p}</div><div style={{fontSize:10,color:C.muted}}>{gc} game{gc!==1?"s":""}</div></div>
<button onClick={()=>removePlayer(p)} style={{background:"none",border:"none",color:C.muted,fontSize:16,cursor:"pointer",padding:"2px 5px"}} title={`Remove ${p}`}>×</button>
</div>;})}
</div>
</Card>
</div>}

{tab==="scores"&&<div>
<div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
<select value={fP} onChange={e=>setFP(e.target.value)} style={{...INP,width:"auto",minWidth:120}}>
<option value="all">All Players</option>
{players.map(p=><option key={p} value={p}>{p}</option>)}
</select>
<select value={fS} onChange={e=>setFS(e.target.value)} style={{...INP,width:"auto"}}>
<option value="all">Both Seasons</option><option value="S1">Season 1</option><option value="S2">Season 2</option>
</select>
<span style={{fontSize:11,color:C.muted}}>{filtered.length} game{filtered.length!==1?"s":""}</span>
</div>
<div style={{display:"flex",flexDirection:"column",gap:4}}>
{filtered.map(g=>{
if(editId===g.id)return<div key={g.id} style={{background:C.card,border:`1px solid ${C.accent}`,borderRadius:9,padding:"10px 13px"}}>
<div style={{display:"grid",gridTemplateColumns:"128px 1fr 80px 70px 1fr",gap:7,alignItems:"center"}}>
<input type="date" value={editVals.date} onChange={e=>setEditVals(v=>({...v,date:e.target.value}))} style={{...INP,fontSize:11}}/>
<select value={editVals.player} onChange={e=>setEditVals(v=>({...v,player:e.target.value}))} style={{...INP,fontSize:11}}>
{players.map(p=><option key={p} value={p}>{p}</option>)}
</select>
<input type="number" min={0} max={300} value={editVals.score} onChange={e=>setEditVals(v=>({...v,score:e.target.value}))} style={{...INP,fontSize:11}}/>
<select value={editVals.season} onChange={e=>setEditVals(v=>({...v,season:e.target.value}))} style={{...INP,fontSize:11}}>
<option value="S1">S1</option><option value="S2">S2</option>
</select>
<div style={{display:"flex",gap:6}}><button onClick={saveEdit} style={{...BACC,fontSize:11,padding:"6px 13px"}}>Save</button><button onClick={()=>setEditId(null)} style={{...BSEC,fontSize:11,padding:"6px 10px"}}>Cancel</button></div>
</div>
</div>;
if(delId===g.id)return<div key={g.id} style={{background:C.card,border:`1px solid ${C.red}`,borderRadius:9,padding:"10px 13px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:12,color:C.red}}>Delete {g.player}'s {g.score} on {fd(g.date)}?</span>
<div style={{display:"flex",gap:6}}><button onClick={()=>deleteGame(g.id)} style={BRED}>Yes, delete</button><button onClick={()=>setDelId(null)} style={{...BSEC,fontSize:11}}>Cancel</button></div>
</div>
</div>;
return<div key={g.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 13px"}}>
<div style={{display:"grid",gridTemplateColumns:"128px 125px 52px 42px 1fr",alignItems:"center",gap:9}}>
<span style={{fontSize:11,color:C.textDim}}>{fd(g.date)}</span>
<span style={{fontSize:13,fontWeight:600}}>{g.player}</span>
<span style={{...DS,fontSize:17,fontWeight:800,color:C.accent}}>{g.score}</span>
<span style={{fontSize:10,color:C.muted,background:C.surface,border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 5px",textAlign:"center"}}>{g.season}</span>
<div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
<button onClick={()=>startEdit(g)} style={{...BSEC,fontSize:11,padding:"5px 10px"}}>✏ Edit</button>
<button onClick={()=>setDelId(g.id)} style={{...BRED,padding:"5px 10px"}}>🗑 Delete</button>
</div>
</div>
</div>;
})}
{filtered.length===0&&<div style={{color:C.muted,textAlign:"center",padding:28,fontSize:13}}>No games match this filter.</div>}
</div>
</div>}

{tab==="sessions"&&<div>
<div style={{marginBottom:12}}>
<select value={fS} onChange={e=>setFS(e.target.value)} style={{...INP,width:"auto"}}>
<option value="all">Both Seasons</option><option value="S1">Season 1</option><option value="S2">Season 2</option>
</select>
</div>
{sessionDates.map(date=>{
const sg=games.filter(g=>g.date===date);const sc=sg.map(g=>g.score);
if(delSession===date)return<div key={date} style={{background:C.card,border:`1px solid ${C.red}`,borderRadius:9,padding:"12px 15px",marginBottom:6}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{color:C.red,fontSize:13,fontWeight:600}}>Delete entire session on {fd(date)}?</div><div style={{color:C.muted,fontSize:11,marginTop:2}}>{sg.length} games will be permanently removed.</div></div>
<div style={{display:"flex",gap:6}}><button onClick={()=>deleteSession(date)} style={BRED}>Yes, delete all</button><button onClick={()=>setDelSession(null)} style={{...BSEC,fontSize:11}}>Cancel</button></div>
</div>
</div>;
return<div key={date} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 15px",marginBottom:6}}>
<div style={{display:"grid",gridTemplateColumns:"140px 1fr 52px 52px 52px 105px",alignItems:"center",gap:10}}>
<span style={{...DS,fontSize:13,fontWeight:700}}>{fd(date)}</span>
<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{[...new Set(sg.map(g=>g.player))].map(p=><span key={p} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 5px",fontSize:9,color:C.textDim}}>{p}</span>)}</div>
<MS l="Games" v={sg.length}/><MS l="Avg" v={mean(sc)?.toFixed(1)}/><MS l="High" v={Math.max(...sc)}/>
<button onClick={()=>setDelSession(date)} style={BRED}>🗑 Delete Session</button>
</div>
</div>;
})}
{sessionDates.length===0&&<div style={{color:C.muted,textAlign:"center",padding:28,fontSize:13}}>No sessions found.</div>}
</div>}
</div>;
}

// ─── ENTER SCORES ──────────────────────────────────────────────────────────────
function EnterPage({players,setGames,nextId,setNextId}){
const today=new Date().toISOString().split("T")[0];
const [rows,setRows]=useState([{player:players[0]||"",score:"",date:today,season:"S2"}]);
const [csv,setCsv]=useState("");
const [mode,setMode]=useState("manual");
const [status,setStatus]=useState(null);
const fileRef=useRef();

const update=useCallback((i,f,v)=>setRows(r=>{const n=[...r];n[i]={...n[i],[f]:v};return n;}),[]);
function addRow(){setRows(r=>[...r,{...r[r.length-1],score:""}]);}
function rmRow(i){if(rows.length>1)setRows(r=>r.filter((_,j)=>j!==i));}

function submitManual(){
const valid=rows.filter(r=>r.score!==""&&!isNaN(+r.score)&&+r.score>=0&&+r.score<=300&&r.player);
if(!valid.length){setStatus({ok:false,msg:"No valid scores found."});return;}
let id=nextId;
setGames(prev=>[...prev,...valid.map(r=>({id:id++,...r,score:+r.score}))]);
setNextId(id);
setStatus({ok:true,msg:`Added ${valid.length} game(s) successfully.`});
setRows([{player:players[0]||"",score:"",date:today,season:"S2"}]);
}
function submitCSV(){
const lines=csv.trim().split("\n").map(l=>l.trim()).filter(Boolean);
const hdr=lines[0]?.toLowerCase().includes("player")||lines[0]?.toLowerCase().includes("score");
let id=nextId;
const data=(hdr?lines.slice(1):lines).map(l=>{
const [date,player,scoreRaw,season="S2"]=l.split(",").map(c=>c.trim().replace(/"/g,""));
const score=+scoreRaw;
if(isNaN(score)||score<0||score>300||!players.includes(player))return null;
return{id:id++,date,player,score,season};
}).filter(Boolean);
if(!data.length){setStatus({ok:false,msg:"No valid rows. Format: date, player, score, season"});return;}
setGames(prev=>[...prev,...data]);setNextId(id);
setStatus({ok:true,msg:`Imported ${data.length} game(s).`});setCsv("");
}

return<div style={{maxWidth:640,margin:"0 auto",padding:"16px 14px"}}>
<ST t="Add Scores" sub="Manual entry or bulk CSV upload"/>
<div style={{display:"flex",gap:7,marginBottom:16}}>
{["manual","csv"].map(m=><button key={m} onClick={()=>setMode(m)} style={{...BACC,...(mode===m?{}:{background:C.card,border:`1px solid ${C.border}`,color:C.text})}}>{m==="manual"?"Manual Entry":"CSV / Paste"}</button>)}
</div>
{status&&<div style={{background:status.ok?C.green+"22":C.red+"22",border:`1px solid ${status.ok?C.green:C.red}`,borderRadius:8,padding:"9px 13px",marginBottom:13,fontSize:12,color:status.ok?C.green:C.red}}>{status.msg}</div>}

{mode==="manual"?<Card>
<div style={{display:"grid",gridTemplateColumns:"132px 1fr 88px 80px 22px",gap:7,marginBottom:8}}>
{["Date","Player","Score","Season",""].map(h=><div key={h} style={{fontSize:9,color:C.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:".07em"}}>{h}</div>)}
</div>
{rows.map((r,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"132px 1fr 88px 80px 22px",gap:7,marginBottom:7,alignItems:"center"}}>
<input type="date" value={r.date} onChange={e=>update(i,"date",e.target.value)} style={INP}/>
<select value={r.player} onChange={e=>update(i,"player",e.target.value)} style={INP}>{players.map(p=><option key={p} value={p}>{p}</option>)}</select>
<input type="number" placeholder="0–300" min={0} max={300} value={r.score} onChange={e=>update(i,"score",e.target.value)} style={INP}/>
<select value={r.season} onChange={e=>update(i,"season",e.target.value)} style={INP}><option value="S1">Season 1</option><option value="S2">Season 2</option></select>
<button onClick={()=>rmRow(i)} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer"}}>×</button>
</div>)}
<div style={{display:"flex",gap:7,marginTop:12}}>
<button onClick={addRow} style={BSEC}>+ Row</button>
<button onClick={submitManual} style={BACC}>Save</button>
</div>
</Card>:<Card>
<div style={{fontSize:12,color:C.muted,marginBottom:11,lineHeight:1.7}}>
Format: <code style={{background:C.surface,padding:"2px 6px",borderRadius:4}}>date, player, score, season</code><br/>
Example: <code style={{background:C.surface,padding:"2px 6px",borderRadius:4}}>2026-06-15, Logan, 134, S2</code>
</div>
<button onClick={()=>fileRef.current.click()} style={{...BSEC,marginBottom:9}}>📂 Upload .csv</button>
<input ref={fileRef} type="file" accept=".csv,.txt" onChange={e=>{const r=new FileReader();r.onload=ev=>setCsv(ev.target.result);r.readAsText(e.target.files[0]);}} style={{display:"none"}}/>
<textarea value={csv} onChange={e=>setCsv(e.target.value)} placeholder={"date, player, score, season\n2026-06-15, Logan, 134, S2"} style={{...INP,minHeight:140,resize:"vertical",fontFamily:"monospace",fontSize:12,lineHeight:1.6}}/>
<button onClick={submitCSV} style={{...BACC,marginTop:9}}>Import</button>
</Card>}
<Card style={{marginTop:13}}>
<div style={{fontSize:9,color:C.muted,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Roster</div>
<div style={{display:"flex",flexWrap:"wrap",gap:5}}>{players.map(p=><span key={p} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 8px",fontSize:11}}>{p}</span>)}</div>
</Card>
</div>;
}

// ─── ROOT ──────────────────────────────────────────────────────────────────────
export default function App(){
const [games,setGames]=useState(INIT_GAMES);
const [players,setPlayers]=useState(INIT_PLAYERS);
const [page,setPage]=useState("home");
const [season,setSeason]=useState("S2");
const [focusPlayer,setFP]=useState(null);
const [nextId,setNextId]=useState(509);

const common={games,players,season,setPage,setFP,focusPlayer};

return<>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#0B0D12;color:#EEF0F8;font-family:'Inter',sans-serif;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#12151C;}::-webkit-scrollbar-thumb{background:#252A38;border-radius:3px;}
button,input,select,textarea{font-family:inherit;}
button{-webkit-tap-highlight-color:transparent;}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{opacity:0;}
`}</style>
<div style={{minHeight:"100vh",background:"#0B0D12",paddingBottom:72}}>
<Nav page={page} setPage={setPage} season={season} setSeason={setSeason}/>
{page==="home"&&<HomePage {...common}/>}
{page==="lb"&&<LbPage {...common}/>}
{page==="players"&&<PlayersPage {...common}/>}
{page==="sessions"&&<SessionsPage {...common}/>}
{page==="records"&&<RecordsPage {...common}/>}
{page==="sheet"&&<ScoreSheetPage games={games} players={players} setGames={setGames} setPlayers={setPlayers} nextId={nextId} setNextId={setNextId}/>}
{page==="manage"&&<ManagePage games={games} players={players} setGames={setGames} setPlayers={setPlayers}/>}
{page==="enter"&&<EnterPage players={players} setGames={setGames} nextId={nextId} setNextId={setNextId}/>}
</div>
</>;
}
