// ─────────────────────────────────────────────────────────────────────────────
// BOWLING FOR THE GËNTS — Score Data
// To update: add entries to the `games` array below.
// Each entry = { date: "YYYY-MM-DD", player: "Name", score: 000, season: "S2" }
// ─────────────────────────────────────────────────────────────────────────────

export const PLAYERS = [
  "Logan","Aaron","Jared","Evan","Ethan","Danny",
  "Aidan","Alon","Patchen","Elijah","Gabi","Benoit",
  "Ari","Jaqueline","Gabe","Ben","Matan","Alex"
];

export const SEASONS = ["S1","S2"];

// Helper to seed realistic-looking data
function seed(player, season, dates, baseAvg, variance) {
  const games = [];
  let avg = baseAvg;
  dates.forEach(date => {
    const gamesThisDay = Math.random() > 0.4 ? 2 : 1;
    for (let g = 0; g < gamesThisDay; g++) {
      const drift = (Math.random() - 0.48) * 3;
      avg = Math.min(Math.max(avg + drift, baseAvg - 20), baseAvg + 30);
      const score = Math.round(avg + (Math.random() - 0.5) * variance * 2);
      games.push({ date, player, score: Math.min(300, Math.max(50, score)), season });
    }
  });
  return games;
}

const s1Dates = [
  "2025-09-05","2025-09-12","2025-09-19","2025-09-26",
  "2025-10-03","2025-10-10","2025-10-17","2025-10-24",
  "2025-11-07","2025-11-14","2025-11-21",
  "2025-12-05","2025-12-12","2025-12-19"
];

const s2Dates = [
  "2026-01-09","2026-01-16","2026-01-23","2026-01-30",
  "2026-02-06","2026-02-13","2026-02-20","2026-02-27",
  "2026-03-06","2026-03-13","2026-03-20","2026-03-27",
  "2026-04-03","2026-04-10","2026-04-17","2026-04-24",
  "2026-05-01","2026-05-08","2026-05-15","2026-05-21","2026-05-26"
];

const playerProfiles = [
  { name:"Logan",    s1Avg:118, s2Avg:131, variance:18 },
  { name:"Aaron",    s1Avg:124, s2Avg:136, variance:20 },
  { name:"Jared",    s1Avg:105, s2Avg:112, variance:22 },
  { name:"Evan",     s1Avg:98,  s2Avg:108, variance:25 },
  { name:"Ethan",    s1Avg:133, s2Avg:141, variance:16 },
  { name:"Danny",    s1Avg:110, s2Avg:119, variance:21 },
  { name:"Aidan",    s1Avg:127, s2Avg:138, variance:17 },
  { name:"Alon",     s1Avg:115, s2Avg:122, variance:19 },
  { name:"Patchen",  s1Avg:101, s2Avg:110, variance:24 },
  { name:"Elijah",   s1Avg:119, s2Avg:128, variance:20 },
  { name:"Gabi",     s1Avg:108, s2Avg:117, variance:23 },
  { name:"Benoit",   s1Avg:122, s2Avg:130, variance:18 },
  { name:"Ari",      s1Avg:113, s2Avg:124, variance:21 },
  { name:"Jaqueline",s1Avg:96,  s2Avg:106, variance:26 },
  { name:"Gabe",     s1Avg:130, s2Avg:143, variance:15 },
  { name:"Ben",      s1Avg:107, s2Avg:115, variance:22 },
  { name:"Matan",    s1Avg:120, s2Avg:129, variance:19 },
  { name:"Alex",     s1Avg:116, s2Avg:125, variance:20 },
];

let allGames = [];
playerProfiles.forEach(p => {
  // Not all players bowl every session — randomly drop ~30% of dates
  const activeDates = s => s.filter(() => Math.random() > 0.28);
  allGames = [
    ...allGames,
    ...seed(p.name, "S1", activeDates(s1Dates), p.s1Avg, p.variance),
    ...seed(p.name, "S2", activeDates(s2Dates), p.s2Avg, p.variance),
  ];
});

export const DEFAULT_GAMES = allGames;
