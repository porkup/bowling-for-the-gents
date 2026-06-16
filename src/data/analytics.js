// ─────────────────────────────────────────────────────────────────────────────
// BOWLING FOR THE GËNTS — Analytics Engine
// ─────────────────────────────────────────────────────────────────────────────

export function getPlayerGames(games, player, season = null) {
  return games
    .filter(g => g.player === player && (season ? g.season === season : true))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

export function avg(arr) {
  if (!arr.length) return null;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

export function stdDev(arr) {
  if (arr.length < 2) return 0;
  const m = avg(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

// Rolling N-game average array
export function rollingAvg(scores, n = 5) {
  return scores.map((_, i) => {
    if (i < n - 1) return null;
    const window = scores.slice(i - n + 1, i + 1);
    return avg(window);
  });
}

// Best N-game stretch (highest rolling avg)
export function bestStretch(scores, n = 5) {
  if (scores.length < n) return null;
  let best = -Infinity, bestIdx = 0;
  for (let i = n - 1; i < scores.length; i++) {
    const a = avg(scores.slice(i - n + 1, i + 1));
    if (a > best) { best = a; bestIdx = i; }
  }
  return { avg: best, endIndex: bestIdx, startIndex: bestIdx - n + 1 };
}

// First N vs Last N improvement
export function improvement(scores, n = 5) {
  if (scores.length < n * 2) return null;
  const first = avg(scores.slice(0, n));
  const last = avg(scores.slice(-n));
  return { first, last, delta: last - first };
}

// Biggest single-session swing (max - min on same date)
export function biggestSwing(games) {
  const byDate = {};
  games.forEach(g => {
    if (!byDate[g.date]) byDate[g.date] = [];
    byDate[g.date].push(g.score);
  });
  let best = null;
  Object.entries(byDate).forEach(([date, scores]) => {
    if (scores.length < 2) return;
    const swing = Math.max(...scores) - Math.min(...scores);
    if (!best || swing > best.swing) best = { date, swing, scores };
  });
  return best;
}

// Best single-day average
export function bestDay(games) {
  const byDate = {};
  games.forEach(g => {
    if (!byDate[g.date]) byDate[g.date] = [];
    byDate[g.date].push(g.score);
  });
  let best = null;
  Object.entries(byDate).forEach(([date, scores]) => {
    const a = avg(scores);
    if (!best || a > best.avg) best = { date, avg: a, scores };
  });
  return best;
}

// Last N games average
export function lastNAvg(scores, n = 5) {
  if (!scores.length) return null;
  return avg(scores.slice(-Math.min(n, scores.length)));
}

// Trend direction: slope of rolling avg
export function trendSlope(scores, n = 5) {
  const roll = rollingAvg(scores, n).filter(v => v !== null);
  if (roll.length < 3) return 0;
  const xs = roll.map((_, i) => i);
  const mx = avg(xs), my = avg(roll);
  const num = xs.reduce((s, x, i) => s + (x - mx) * (roll[i] - my), 0);
  const den = xs.reduce((s, x) => s + (x - mx) ** 2, 0);
  return den === 0 ? 0 : num / den;
}

// Hot/cold status: last 5 vs season avg
export function hotCold(scores) {
  if (scores.length < 3) return "neutral";
  const seasonAvg = avg(scores);
  const last5 = lastNAvg(scores, 5);
  const diff = last5 - seasonAvg;
  if (diff > 8) return "hot";
  if (diff < -8) return "cold";
  return "neutral";
}

// Full player stats object
export function playerStats(games, player, season) {
  const pg = getPlayerGames(games, player, season);
  const scores = pg.map(g => g.score);
  if (!scores.length) return null;

  const roll = rollingAvg(scores, 5);
  const stretch = bestStretch(scores, 5);
  const imp = improvement(scores, 5);
  const swing = biggestSwing(pg);
  const best = bestDay(pg);
  const slope = trendSlope(scores, 5);

  return {
    player,
    season,
    games: scores.length,
    avg: avg(scores),
    high: Math.max(...scores),
    low: Math.min(...scores),
    stdDev: stdDev(scores),
    last5: lastNAvg(scores, 5),
    last5Delta: scores.length >= 5 ? lastNAvg(scores, 5) - avg(scores) : null,
    bestStretch: stretch,
    improvement: imp,
    biggestSwing: swing,
    bestDay: best,
    rollingAvg: roll,
    rawScores: scores,
    rawGames: pg,
    hotCold: hotCold(scores),
    trendSlope: slope,
    trendDir: slope > 0.3 ? "up" : slope < -0.3 ? "down" : "flat",
  };
}

// All players stats for a season
export function allPlayerStats(games, players, season) {
  return players
    .map(p => playerStats(games, p, season))
    .filter(Boolean)
    .sort((a, b) => b.avg - a.avg);
}

// Group stats for a season
export function groupStats(games, players, season) {
  const all = games.filter(g => season ? g.season === season : true);
  const scores = all.map(g => g.score);
  const sessionDates = [...new Set(all.map(g => g.date))].sort();
  return {
    totalGames: scores.length,
    groupAvg: avg(scores),
    groupHigh: Math.max(...scores),
    groupLow: Math.min(...scores),
    activePlayers: [...new Set(all.map(g => g.player))].length,
    sessions: sessionDates.length,
    lastSession: sessionDates[sessionDates.length - 1],
  };
}

// Recent developments feed
export function recentDevelopments(games, players, season) {
  const stats = allPlayerStats(games, players, season);
  const developments = [];

  stats.forEach(s => {
    if (!s) return;
    // Personal best set recently (in last 3 games)
    const recent = s.rawScores.slice(-3);
    if (recent.includes(s.high) && s.games > 5) {
      developments.push({
        type: "record",
        icon: "🎳",
        player: s.player,
        text: `${s.player} bowled a personal best of ${s.high} this season`,
        date: s.rawGames[s.rawGames.length - recent.indexOf(s.high) - 1]?.date,
        priority: 1,
      });
    }
    // Hot streak
    if (s.hotCold === "hot" && s.games >= 5) {
      developments.push({
        type: "hot",
        icon: "🔥",
        player: s.player,
        text: `${s.player} is running hot — last 5 avg ${s.last5?.toFixed(1)} vs ${s.avg?.toFixed(1)} season avg`,
        priority: 2,
      });
    }
    // Big improvement
    if (s.improvement && s.improvement.delta > 15) {
      developments.push({
        type: "improvement",
        icon: "📈",
        player: s.player,
        text: `${s.player} improved ${s.improvement.delta.toFixed(1)} pins from their first 5 to last 5 games`,
        priority: 3,
      });
    }
    // Big swing
    if (s.biggestSwing && s.biggestSwing.swing > 60) {
      developments.push({
        type: "swing",
        icon: "⚡",
        player: s.player,
        text: `${s.player} had a ${s.biggestSwing.swing}-pin swing in a single night (${s.biggestSwing.date})`,
        priority: 4,
      });
    }
  });

  return developments
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6);
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatDelta(val, decimals = 1) {
  if (val === null || val === undefined) return "—";
  const sign = val > 0 ? "+" : "";
  return `${sign}${val.toFixed(decimals)}`;
}
