import { useState, useMemo, useCallback, useRef } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell
} from "recharts";
import { DEFAULT_GAMES, PLAYERS, SEASONS } from "./data/scores.js";
import {
  allPlayerStats, playerStats, groupStats, recentDevelopments,
  rollingAvg, formatDate, formatDelta, avg
} from "./data/analytics.js";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:       "#0D0F14",
  surface:  "#13161E",
  card:     "#1A1E2A",
  border:   "#252A38",
  accent:   "#E8C84A",   // lane-yellow — the signature color
  accentDim:"#7A6920",
  red:      "#E85A4A",
  green:    "#4AE89A",
  blue:     "#4A9AE8",
  muted:    "#6B7280",
  text:     "#F0F2F8",
  textDim:  "#9CA3AF",
};

const HOT_COLOR  = "#E85A4A";
const COLD_COLOR = "#4A9AE8";
const NEUTRAL_COLOR = C.muted;

// ─── CSS injected once ───────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'Inter', sans-serif; min-height: 100vh; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.surface}; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
  input, select, textarea { font-family: inherit; }
  button { cursor: pointer; font-family: inherit; }
  .display { font-family: 'Barlow Condensed', sans-serif; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
  .fade-up { animation: fadeUp 0.35s ease both; }
  .pin-stripe {
    background-image: repeating-linear-gradient(
      90deg,
      transparent,
      transparent 59px,
      ${C.border}33 59px,
      ${C.border}33 60px
    );
  }
`;

// ─── Utility components ───────────────────────────────────────────────────────
function Card({ children, style, className = "" }) {
  return (
    <div className={className} style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 12, padding: "20px 24px", ...style
    }}>
      {children}
    </div>
  );
}

function Badge({ label, color = C.accent }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 999,
      background: color + "22", color, fontSize: 11, fontWeight: 600,
      letterSpacing: "0.04em", textTransform: "uppercase",
    }}>{label}</span>
  );
}

function StatBox({ label, value, sub, accent = false, big = false }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${accent ? C.accent + "55" : C.border}`,
      borderRadius: 10, padding: "14px 18px", minWidth: 110,
    }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase",
        letterSpacing: "0.08em", marginBottom: 4 }}>{label}</div>
      <div className="display" style={{
        fontSize: big ? 36 : 26, fontWeight: 800,
        color: accent ? C.accent : C.text, lineHeight: 1,
      }}>{value ?? "—"}</div>
      {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function HotColdBadge({ status }) {
  if (status === "hot") return <Badge label="🔥 Hot" color={HOT_COLOR} />;
  if (status === "cold") return <Badge label="❄️ Cold" color={COLD_COLOR} />;
  return <Badge label="Steady" color={C.muted} />;
}

function TrendArrow({ dir }) {
  if (dir === "up") return <span style={{ color: C.green, fontSize: 18 }}>↑</span>;
  if (dir === "down") return <span style={{ color: C.red, fontSize: 18 }}>↓</span>;
  return <span style={{ color: C.muted, fontSize: 18 }}>→</span>;
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 className="display" style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: "0.01em" }}>
        {title}
      </h2>
      {sub && <p style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, season, setSeason }) {
  const tabs = [
    { id: "home",      label: "Home" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "players",   label: "Players" },
    { id: "sessions",  label: "Sessions" },
    { id: "records",   label: "Records" },
    { id: "enter",     label: "+ Add Scores" },
  ];
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: C.surface + "EE", backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", gap: 0,
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{
          background: "none", border: "none", padding: "14px 0",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ fontSize: 22 }}>🎳</span>
          <span className="display" style={{
            fontSize: 20, fontWeight: 800, color: C.accent,
            letterSpacing: "0.02em", whiteSpace: "nowrap",
          }}>Bowling for the Gënts</span>
        </button>

        {/* Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setPage(t.id)} style={{
              background: page === t.id ? C.accent + "18" : "none",
              border: "none", padding: "16px 14px",
              color: page === t.id ? C.accent : C.textDim,
              fontSize: 13, fontWeight: page === t.id ? 600 : 400,
              borderBottom: page === t.id ? `2px solid ${C.accent}` : "2px solid transparent",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Season picker */}
        <select value={season} onChange={e => setSeason(e.target.value)} style={{
          background: C.card, border: `1px solid ${C.border}`,
          color: C.text, padding: "6px 12px", borderRadius: 8, fontSize: 13,
          outline: "none",
        }}>
          <option value="all">All Seasons</option>
          {SEASONS.map(s => <option key={s} value={s}>{s === "S1" ? "Season 1" : "Season 2"}</option>)}
        </select>
      </div>
    </nav>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ games, season, setPage, setFocusPlayer }) {
  const displaySeason = season === "all" ? "S2" : season;
  const stats = useMemo(() => allPlayerStats(games, PLAYERS, displaySeason), [games, displaySeason]);
  const group = useMemo(() => groupStats(games, PLAYERS, displaySeason), [games, displaySeason]);
  const devs = useMemo(() => recentDevelopments(games, PLAYERS, displaySeason), [games, displaySeason]);

  const leader = stats[0];
  const mostImproved = [...stats]
    .filter(s => s.improvement)
    .sort((a, b) => b.improvement.delta - a.improvement.delta)[0];
  const hotPlayers = stats.filter(s => s.hotCold === "hot");

  return (
    <div>
      {/* Hero */}
      <div className="pin-stripe" style={{
        background: `linear-gradient(135deg, ${C.bg} 0%, #1A1520 50%, ${C.bg} 100%)`,
        padding: "64px 24px 48px", textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative lane lines */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 300, height: 4, background: C.accent, borderRadius: 2, opacity: 0.6,
        }} />
        <div className="display fade-up" style={{
          fontSize: 72, fontWeight: 800, color: C.accent,
          letterSpacing: "-0.01em", lineHeight: 1, marginBottom: 12,
        }}>
          Bowling for the Gënts
        </div>
        <p style={{ color: C.textDim, fontSize: 16, marginBottom: 32 }}>
          {displaySeason === "S2" ? "Season 2" : "Season 1"} · {group.sessions} sessions · {group.activePlayers} players · {group.totalGames} games tracked
        </p>

        {/* Hero stat row */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <StatBox label="Group Avg" value={group.groupAvg?.toFixed(1)} accent big />
          <StatBox label="High Score" value={group.groupHigh} sub="season best" />
          <StatBox label="Sessions" value={group.sessions} />
          <StatBox label="Games Bowled" value={group.totalGames} />
          <StatBox label="Active Players" value={group.activePlayers} />
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {/* Recent Developments */}
        {devs.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <SectionHeader title="Recent Developments" sub="What's been happening on the lanes" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 12 }}>
              {devs.map((d, i) => (
                <div key={i} className="fade-up" style={{
                  background: C.card, border: `1px solid ${C.border}`,
                  borderLeft: `3px solid ${d.type === "record" ? C.accent : d.type === "hot" ? HOT_COLOR : d.type === "improvement" ? C.green : C.blue}`,
                  borderRadius: 10, padding: "14px 18px",
                  display: "flex", gap: 12, alignItems: "flex-start",
                  animationDelay: `${i * 0.06}s`,
                }}>
                  <span style={{ fontSize: 20, lineHeight: 1, marginTop: 2 }}>{d.icon}</span>
                  <div>
                    <p style={{ fontSize: 14, color: C.text, lineHeight: 1.5 }}>{d.text}</p>
                    {d.date && <p style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{formatDate(d.date)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spotlight row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
          {leader && (
            <Card style={{ borderTop: `3px solid ${C.accent}`, cursor: "pointer" }}
              className="fade-up"
              onClick={() => { setFocusPlayer(leader.player); setPage("players"); }}>
              <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                🏆 Season Leader
              </div>
              <div className="display" style={{ fontSize: 32, fontWeight: 800 }}>{leader.player}</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
                {leader.avg?.toFixed(1)} avg · {leader.games} games
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <HotColdBadge status={leader.hotCold} />
                <Badge label={`High: ${leader.high}`} color={C.blue} />
              </div>
            </Card>
          )}

          {mostImproved && (
            <Card style={{ borderTop: `3px solid ${C.green}`, cursor: "pointer" }}
              className="fade-up"
              onClick={() => { setFocusPlayer(mostImproved.player); setPage("players"); }}>
              <div style={{ fontSize: 11, color: C.green, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                📈 Most Improved
              </div>
              <div className="display" style={{ fontSize: 32, fontWeight: 800 }}>{mostImproved.player}</div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
                {formatDelta(mostImproved.improvement?.delta)} pins first→last 5
              </div>
              <div style={{ marginTop: 10 }}>
                <Badge label={`${mostImproved.improvement?.first?.toFixed(1)} → ${mostImproved.improvement?.last?.toFixed(1)}`} color={C.green} />
              </div>
            </Card>
          )}

          {hotPlayers.length > 0 && (
            <Card style={{ borderTop: `3px solid ${HOT_COLOR}` }} className="fade-up">
              <div style={{ fontSize: 11, color: HOT_COLOR, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
                🔥 Running Hot
              </div>
              {hotPlayers.slice(0, 4).map(p => (
                <div key={p.player} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "6px 0", borderBottom: `1px solid ${C.border}`,
                }}>
                  <button onClick={() => { setFocusPlayer(p.player); setPage("players"); }}
                    style={{ background:"none", border:"none", color: C.text, fontSize: 14, fontWeight: 600, padding: 0, textAlign: "left" }}>
                    {p.player}
                  </button>
                  <span style={{ color: HOT_COLOR, fontSize: 13 }}>
                    {formatDelta(p.last5Delta)} vs avg
                  </span>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Quick leaderboard preview */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <SectionHeader title="Season Standings" />
            <button onClick={() => setPage("leaderboard")} style={{
              background: "none", border: `1px solid ${C.border}`, color: C.accent,
              padding: "8px 16px", borderRadius: 8, fontSize: 13,
            }}>View Full Leaderboard →</button>
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {stats.slice(0, 6).map((s, i) => (
              <div key={s.player} style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "12px 20px",
                display: "grid", gridTemplateColumns: "36px 1fr repeat(5, 80px)",
                alignItems: "center", gap: 12,
                cursor: "pointer",
              }}
                onClick={() => { setFocusPlayer(s.player); setPage("players"); }}>
                <span className="display" style={{
                  fontSize: 20, fontWeight: 800,
                  color: i === 0 ? C.accent : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : C.muted,
                }}>{i + 1}</span>
                <div>
                  <span style={{ fontWeight: 600 }}>{s.player}</span>
                  <HotColdBadge status={s.hotCold} />
                </div>
                <StatTd label="Avg" val={s.avg?.toFixed(1)} />
                <StatTd label="High" val={s.high} />
                <StatTd label="Games" val={s.games} />
                <StatTd label="Last 5" val={s.last5?.toFixed(1)} />
                <StatTd label="Trend" val={<TrendArrow dir={s.trendDir} />} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatTd({ label, val }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{val}</div>
    </div>
  );
}

// ─── LEADERBOARD PAGE ─────────────────────────────────────────────────────────
function LeaderboardPage({ games, season, setPage, setFocusPlayer }) {
  const displaySeason = season === "all" ? null : season;
  const stats = useMemo(() => allPlayerStats(games, PLAYERS, displaySeason), [games, displaySeason]);
  const [sortBy, setSortBy] = useState("avg");

  const sorted = useMemo(() => {
    return [...stats].sort((a, b) => {
      if (sortBy === "avg") return b.avg - a.avg;
      if (sortBy === "high") return b.high - a.high;
      if (sortBy === "games") return b.games - a.games;
      if (sortBy === "last5") return (b.last5 || 0) - (a.last5 || 0);
      if (sortBy === "improvement") return (b.improvement?.delta || -99) - (a.improvement?.delta || -99);
      if (sortBy === "consistency") return a.stdDev - b.stdDev;
      return 0;
    });
  }, [stats, sortBy]);

  const cols = [
    { id: "avg", label: "Season Avg" },
    { id: "high", label: "High Game" },
    { id: "games", label: "Games" },
    { id: "last5", label: "Last 5 Avg" },
    { id: "improvement", label: "Improvement" },
    { id: "consistency", label: "Consistency ↓" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <SectionHeader title="Leaderboard" sub={`Sorted by ${cols.find(c=>c.id===sortBy)?.label}`} />

      {/* Sort tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {cols.map(c => (
          <button key={c.id} onClick={() => setSortBy(c.id)} style={{
            background: sortBy === c.id ? C.accent : C.card,
            border: `1px solid ${sortBy === c.id ? C.accent : C.border}`,
            color: sortBy === c.id ? C.bg : C.text,
            padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          }}>{c.label}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: C.surface }}>
              {["#","Player","Status","Avg","High","Low","SD","Games","Last 5","Best Stretch","Improvement","Best Day","Biggest Swing"].map(h => (
                <th key={h} style={{
                  padding: "10px 14px", textAlign: h === "Player" || h === "#" ? "left" : "center",
                  fontSize: 11, color: C.muted, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  borderBottom: `1px solid ${C.border}`, whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr key={s.player}
                onClick={() => { setFocusPlayer(s.player); setPage("players"); }}
                style={{
                  background: i % 2 === 0 ? C.card : C.surface,
                  cursor: "pointer", transition: "background 0.1s",
                  borderBottom: `1px solid ${C.border}`,
                }}>
                <td style={{ padding: "12px 14px", textAlign: "left" }}>
                  <span className="display" style={{
                    fontSize: 18, fontWeight: 800,
                    color: i === 0 ? C.accent : i === 1 ? "#C0C0C0" : i === 2 ? "#CD7F32" : C.muted,
                  }}>{i + 1}</span>
                </td>
                <td style={{ padding: "12px 14px", fontWeight: 600, whiteSpace: "nowrap" }}>{s.player}</td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}><HotColdBadge status={s.hotCold} /></td>
                <td style={{ padding: "12px 14px", textAlign: "center", fontWeight: 700, color: sortBy === "avg" ? C.accent : C.text }}>{s.avg?.toFixed(1)}</td>
                <td style={{ padding: "12px 14px", textAlign: "center", color: sortBy === "high" ? C.accent : C.text, fontWeight: sortBy === "high" ? 700 : 400 }}>{s.high}</td>
                <td style={{ padding: "12px 14px", textAlign: "center", color: C.muted }}>{s.low}</td>
                <td style={{ padding: "12px 14px", textAlign: "center", color: C.muted }}>{s.stdDev?.toFixed(1)}</td>
                <td style={{ padding: "12px 14px", textAlign: "center", color: sortBy === "games" ? C.accent : C.text }}>{s.games}</td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  <span style={{ color: s.last5Delta > 0 ? C.green : s.last5Delta < 0 ? C.red : C.text }}>
                    {s.last5?.toFixed(1)} <small style={{ color: C.muted }}>({formatDelta(s.last5Delta)})</small>
                  </span>
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center", color: sortBy === "improvement" ? C.accent : C.text }}>
                  {s.bestStretch?.avg?.toFixed(1) ?? "—"}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  {s.improvement ? (
                    <span style={{ color: s.improvement.delta > 0 ? C.green : C.red, fontWeight: 600 }}>
                      {formatDelta(s.improvement.delta)}
                    </span>
                  ) : "—"}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center", whiteSpace: "nowrap" }}>
                  {s.bestDay ? `${s.bestDay.avg?.toFixed(1)} (${formatDate(s.bestDay.date)})` : "—"}
                </td>
                <td style={{ padding: "12px 14px", textAlign: "center" }}>
                  {s.biggestSwing ? `${s.biggestSwing.swing} pins` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PLAYER PAGE ──────────────────────────────────────────────────────────────
function PlayersPage({ games, season, focusPlayer, setFocusPlayer }) {
  const displaySeason = season === "all" ? null : season;
  const allStats = useMemo(() => allPlayerStats(games, PLAYERS, displaySeason), [games, displaySeason]);
  const selected = focusPlayer || PLAYERS[0];

  const s = useMemo(() => playerStats(games, selected, displaySeason), [games, selected, displaySeason]);
  const careerS = useMemo(() => playerStats(games, selected, null), [games, selected]);

  const chartData = useMemo(() => {
    if (!s) return [];
    const roll = rollingAvg(s.rawScores, 5);
    return s.rawGames.map((g, i) => ({
      game: i + 1,
      score: g.score,
      rolling: roll[i] !== null ? +roll[i].toFixed(1) : undefined,
      date: g.date,
    }));
  }, [s]);

  const seasonAvgLine = s?.avg;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 24 }}>
        {/* Player roster */}
        <div>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, textTransform: "uppercase",
            letterSpacing: "0.08em", marginBottom: 12 }}>Players</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {PLAYERS.map(p => {
              const ps = allStats.find(x => x.player === p);
              return (
                <button key={p} onClick={() => setFocusPlayer(p)} style={{
                  background: selected === p ? C.accent + "22" : "none",
                  border: `1px solid ${selected === p ? C.accent : C.border}`,
                  borderRadius: 8, padding: "10px 14px", textAlign: "left", color: C.text,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontWeight: selected === p ? 600 : 400 }}>{p}</span>
                  {ps && (
                    <span style={{ fontSize: 12, color: C.muted }}>
                      {ps.avg?.toFixed(0)}
                      {ps.hotCold === "hot" && " 🔥"}
                      {ps.hotCold === "cold" && " ❄️"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Player detail */}
        {s ? (
          <div>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 className="display" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1 }}>{s.player}</h1>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  <HotColdBadge status={s.hotCold} />
                  <Badge label={`Trend: ${s.trendDir === "up" ? "↑ Rising" : s.trendDir === "down" ? "↓ Falling" : "→ Flat"}`}
                    color={s.trendDir === "up" ? C.green : s.trendDir === "down" ? C.red : C.muted} />
                  <Badge label={`${s.games} games`} color={C.blue} />
                </div>
              </div>
              {careerS && careerS.games > s.games && (
                <Card style={{ padding: "12px 18px", minWidth: 160 }}>
                  <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Career</div>
                  <div style={{ fontSize: 13 }}>
                    <span style={{ color: C.accent, fontWeight: 700 }}>{careerS.avg?.toFixed(1)}</span> avg · {careerS.games} games
                  </div>
                  <div style={{ fontSize: 12, color: C.muted }}>High: {careerS.high}</div>
                </Card>
              )}
            </div>

            {/* Stat grid */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
              <StatBox label="Season Avg" value={s.avg?.toFixed(1)} accent />
              <StatBox label="Last 5 Avg" value={s.last5?.toFixed(1)} sub={formatDelta(s.last5Delta) + " vs avg"} />
              <StatBox label="High Game" value={s.high} />
              <StatBox label="Low Game" value={s.low} />
              <StatBox label="Std Dev" value={s.stdDev?.toFixed(1)} sub="consistency" />
              <StatBox label="Best 5-Stretch" value={s.bestStretch?.avg?.toFixed(1)} />
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
              {s.improvement && (
                <StatBox
                  label="Improvement"
                  value={formatDelta(s.improvement.delta)}
                  sub={`${s.improvement.first?.toFixed(1)} → ${s.improvement.last?.toFixed(1)}`}
                  accent={s.improvement.delta > 0}
                />
              )}
              {s.bestDay && (
                <StatBox label="Best Night" value={s.bestDay.avg?.toFixed(1)} sub={formatDate(s.bestDay.date)} />
              )}
              {s.biggestSwing && (
                <StatBox label="Biggest Swing" value={`${s.biggestSwing.swing} pins`} sub={formatDate(s.biggestSwing.date)} />
              )}
            </div>

            {/* Trend chart */}
            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 16 }}>Score History + Rolling 5-Game Average</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 4, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="game" stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} label={{ value: "Game #", position: "insideBottom", offset: -2, fill: C.muted, fontSize: 11 }} />
                  <YAxis stroke={C.muted} tick={{ fill: C.muted, fontSize: 11 }} domain={["auto","auto"]} />
                  <Tooltip
                    contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }}
                    labelStyle={{ color: C.muted, fontSize: 11 }}
                    itemStyle={{ color: C.text }}
                    formatter={(v, n) => [v, n === "score" ? "Score" : "5-Game Avg"]}
                    labelFormatter={v => `Game ${v}`}
                  />
                  {seasonAvgLine && (
                    <ReferenceLine y={seasonAvgLine} stroke={C.accentDim} strokeDasharray="4 4"
                      label={{ value: `Avg ${seasonAvgLine?.toFixed(1)}`, fill: C.accentDim, fontSize: 10 }} />
                  )}
                  <Line type="monotone" dataKey="score" stroke={C.border} strokeWidth={1}
                    dot={{ fill: C.muted, r: 3 }} activeDot={{ r: 5, fill: C.text }} />
                  <Line type="monotone" dataKey="rolling" stroke={C.accent} strokeWidth={2.5}
                    dot={false} connectNulls />
                </LineChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 12, color: C.muted }}>
                <span><span style={{ color: C.muted }}>──</span> Individual scores</span>
                <span><span style={{ color: C.accent }}>──</span> 5-game rolling avg</span>
                <span><span style={{ color: C.accentDim }}>- -</span> Season avg</span>
              </div>
            </Card>

            {/* Score log */}
            <Card>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase",
                letterSpacing: "0.08em", marginBottom: 14 }}>Full Score Log</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {s.rawGames.map((g, i) => (
                  <div key={i} style={{
                    background: g.score === s.high ? C.accent + "22" : C.surface,
                    border: `1px solid ${g.score === s.high ? C.accent : C.border}`,
                    borderRadius: 8, padding: "8px 14px", textAlign: "center", minWidth: 60,
                  }}>
                    <div className="display" style={{
                      fontSize: 20, fontWeight: 800,
                      color: g.score === s.high ? C.accent : g.score >= (s.avg + 10) ? C.green : g.score <= (s.avg - 10) ? C.red : C.text,
                    }}>{g.score}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{formatDate(g.date).replace(/,.*/, "")}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <div style={{ color: C.muted, padding: 40, textAlign: "center" }}>
            No games recorded for {selected} this {season === "all" ? "period" : season === "S1" ? "Season 1" : "Season 2"}.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SESSIONS PAGE ────────────────────────────────────────────────────────────
function SessionsPage({ games, season }) {
  const filtered = season === "all" ? games : games.filter(g => g.season === season);
  const sessions = useMemo(() => {
    const byDate = {};
    filtered.forEach(g => {
      if (!byDate[g.date]) byDate[g.date] = [];
      byDate[g.date].push(g);
    });
    return Object.entries(byDate)
      .sort(([a], [b]) => new Date(b) - new Date(a))
      .map(([date, gs]) => {
        const scores = gs.map(g => g.score);
        const sessionAvg = avg(scores);
        return {
          date, games: gs, scores,
          avg: sessionAvg,
          high: Math.max(...scores),
          low: Math.min(...scores),
          players: gs.map(g => g.player),
          highPlayer: gs.find(g => g.score === Math.max(...scores))?.player,
        };
      });
  }, [filtered]);

  const [expanded, setExpanded] = useState(null);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <SectionHeader title="Session History" sub={`${sessions.length} bowling nights on record`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sessions.map((s, i) => (
          <div key={s.date}>
            <div
              onClick={() => setExpanded(expanded === i ? null : i)}
              style={{
                background: C.card, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: "14px 20px",
                display: "grid", gridTemplateColumns: "160px 1fr repeat(4, 90px) 24px",
                alignItems: "center", gap: 12, cursor: "pointer",
              }}>
              <span className="display" style={{ fontSize: 16, fontWeight: 700 }}>{formatDate(s.date)}</span>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {s.players.map(p => (
                  <span key={p} style={{
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: 6, padding: "2px 8px", fontSize: 11, color: C.textDim,
                  }}>{p}</span>
                ))}
              </div>
              <StatTd label="Session Avg" val={s.avg?.toFixed(1)} />
              <StatTd label="High" val={s.high} />
              <StatTd label="Low" val={s.low} />
              <StatTd label="Games" val={s.scores.length} />
              <span style={{ color: C.muted }}>{ expanded === i ? "▲" : "▼" }</span>
            </div>
            {expanded === i && (
              <div style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderTop: "none", borderRadius: "0 0 10px 10px",
                padding: "16px 20px",
              }}>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  High game: {s.highPlayer} — {s.high}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {s.games.sort((a,b) => b.score - a.score).map((g, j) => (
                    <div key={j} style={{
                      background: C.card, border: `1px solid ${C.border}`,
                      borderRadius: 8, padding: "10px 16px", textAlign: "center",
                    }}>
                      <div className="display" style={{
                        fontSize: 24, fontWeight: 800,
                        color: g.score === s.high ? C.accent : C.text,
                      }}>{g.score}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{g.player}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── RECORDS PAGE ─────────────────────────────────────────────────────────────
function RecordsPage({ games, season }) {
  const displaySeason = season === "all" ? null : season;
  const stats = useMemo(() => allPlayerStats(games, PLAYERS, displaySeason), [games, displaySeason]);
  const careerStats = useMemo(() => allPlayerStats(games, PLAYERS, null), [games]);

  const records = [
    {
      title: "Highest Single Game",
      icon: "🎳",
      rows: [...stats].sort((a,b) => b.high - a.high).slice(0,5)
        .map(s => ({ player: s.player, value: s.high, sub: formatDate(s.rawGames.find(g => g.score === s.high)?.date) }))
    },
    {
      title: "Season Average",
      icon: "📊",
      rows: stats.slice(0,5).map(s => ({ player: s.player, value: s.avg?.toFixed(1), sub: `${s.games} games` }))
    },
    {
      title: "Most Improved",
      icon: "📈",
      rows: [...stats].filter(s => s.improvement).sort((a,b) => b.improvement.delta - a.improvement.delta).slice(0,5)
        .map(s => ({ player: s.player, value: formatDelta(s.improvement.delta), sub: `${s.improvement.first?.toFixed(1)} → ${s.improvement.last?.toFixed(1)}` }))
    },
    {
      title: "Best 5-Game Stretch",
      icon: "🔥",
      rows: [...stats].sort((a,b) => (b.bestStretch?.avg||0) - (a.bestStretch?.avg||0)).slice(0,5)
        .map(s => ({ player: s.player, value: s.bestStretch?.avg?.toFixed(1), sub: "avg over 5 games" }))
    },
    {
      title: "Most Consistent",
      icon: "🎯",
      rows: [...stats].filter(s => s.games >= 5).sort((a,b) => a.stdDev - b.stdDev).slice(0,5)
        .map(s => ({ player: s.player, value: s.stdDev?.toFixed(1), sub: "std deviation (lower = steadier)" }))
    },
    {
      title: "Biggest Single-Night Swing",
      icon: "⚡",
      rows: [...stats].filter(s => s.biggestSwing).sort((a,b) => b.biggestSwing.swing - a.biggestSwing.swing).slice(0,5)
        .map(s => ({ player: s.player, value: `${s.biggestSwing.swing} pins`, sub: formatDate(s.biggestSwing.date) }))
    },
    {
      title: "Best Night Average",
      icon: "🌙",
      rows: [...stats].filter(s => s.bestDay).sort((a,b) => b.bestDay.avg - a.bestDay.avg).slice(0,5)
        .map(s => ({ player: s.player, value: s.bestDay.avg?.toFixed(1), sub: formatDate(s.bestDay.date) }))
    },
    {
      title: "Most Games Bowled",
      icon: "📅",
      rows: [...stats].sort((a,b) => b.games - a.games).slice(0,5)
        .map(s => ({ player: s.player, value: s.games, sub: "games this season" }))
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
      <SectionHeader title="Record Book" sub="Season and career achievements" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
        {records.map(rec => (
          <Card key={rec.title}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 18 }}>{rec.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.06em", color: C.accent }}>{rec.title}</span>
            </div>
            {rec.rows.map((r, i) => (
              <div key={r.player} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: i < rec.rows.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="display" style={{
                    fontSize: 16, fontWeight: 800, width: 20, textAlign: "right",
                    color: i === 0 ? C.accent : C.muted,
                  }}>{i + 1}</span>
                  <div>
                    <div style={{ fontWeight: i === 0 ? 600 : 400 }}>{r.player}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{r.sub}</div>
                  </div>
                </div>
                <span className="display" style={{
                  fontSize: 20, fontWeight: 800,
                  color: i === 0 ? C.accent : C.text,
                }}>{r.value}</span>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── SCORE ENTRY PAGE ─────────────────────────────────────────────────────────
function EnterPage({ onAddGames }) {
  const [mode, setMode] = useState("manual");
  const [entries, setEntries] = useState([{ player: PLAYERS[0], score: "", date: new Date().toISOString().split("T")[0], season: "S2" }]);
  const [csvText, setCsvText] = useState("");
  const [status, setStatus] = useState(null);
  const fileRef = useRef();

  function addRow() {
    const last = entries[entries.length - 1];
    setEntries([...entries, { player: last.player, score: "", date: last.date, season: last.season }]);
  }

  function updateEntry(i, field, val) {
    const next = [...entries];
    next[i] = { ...next[i], [field]: val };
    setEntries(next);
  }

  function removeRow(i) {
    setEntries(entries.filter((_, j) => j !== i));
  }

  function submitManual() {
    const valid = entries.filter(e => e.score !== "" && !isNaN(+e.score) && +e.score >= 0 && +e.score <= 300);
    if (!valid.length) { setStatus({ type: "error", msg: "No valid scores to add." }); return; }
    onAddGames(valid.map(e => ({ ...e, score: +e.score })));
    setStatus({ type: "success", msg: `Added ${valid.length} game${valid.length > 1 ? "s" : ""} successfully.` });
    setEntries([{ player: PLAYERS[0], score: "", date: new Date().toISOString().split("T")[0], season: "S2" }]);
  }

  function parseCSV(text) {
    const lines = text.trim().split("\n").map(l => l.trim()).filter(Boolean);
    if (!lines.length) return [];
    // Try to detect header
    const firstLower = lines[0].toLowerCase();
    const hasHeader = firstLower.includes("player") || firstLower.includes("date") || firstLower.includes("score");
    const dataLines = hasHeader ? lines.slice(1) : lines;
    const parsed = [];
    dataLines.forEach(line => {
      const cols = line.split(",").map(c => c.trim().replace(/"/g, ""));
      // Expected: date, player, score, season (season optional)
      if (cols.length >= 3) {
        const [date, player, scoreRaw, season = "S2"] = cols;
        const score = +scoreRaw;
        if (!isNaN(score) && score >= 0 && score <= 300 && PLAYERS.includes(player)) {
          parsed.push({ date, player, score, season });
        }
      }
    });
    return parsed;
  }

  function submitCSV() {
    const parsed = parseCSV(csvText);
    if (!parsed.length) { setStatus({ type: "error", msg: "No valid rows parsed. Check format: date, player, score, season" }); return; }
    onAddGames(parsed);
    setStatus({ type: "success", msg: `Imported ${parsed.length} game${parsed.length > 1 ? "s" : ""} successfully.` });
    setCsvText("");
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setCsvText(ev.target.result);
    reader.readAsText(file);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
      <SectionHeader title="Add Scores" sub="Manual entry or bulk CSV upload" />

      {/* Mode toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {["manual", "csv"].map(m => (
          <button key={m} onClick={() => setMode(m)} style={{
            background: mode === m ? C.accent : C.card,
            border: `1px solid ${mode === m ? C.accent : C.border}`,
            color: mode === m ? C.bg : C.text,
            padding: "9px 20px", borderRadius: 8, fontWeight: 600, fontSize: 14,
          }}>{m === "manual" ? "Manual Entry" : "CSV Upload"}</button>
        ))}
      </div>

      {status && (
        <div style={{
          background: status.type === "success" ? C.green + "22" : C.red + "22",
          border: `1px solid ${status.type === "success" ? C.green : C.red}`,
          borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 14,
          color: status.type === "success" ? C.green : C.red,
        }}>{status.msg}</div>
      )}

      {mode === "manual" ? (
        <Card>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px 100px 36px",
            gap: 10, marginBottom: 8 }}>
            {["Date","Player","Score","Season",""].map(h => (
              <div key={h} style={{ fontSize: 11, color: C.muted, fontWeight: 600,
                textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</div>
            ))}
          </div>

          {entries.map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 120px 100px 36px",
              gap: 10, marginBottom: 8, alignItems: "center" }}>
              <input type="date" value={e.date} onChange={ev => updateEntry(i, "date", ev.target.value)}
                style={inputStyle} />
              <select value={e.player} onChange={ev => updateEntry(i, "player", ev.target.value)}
                style={inputStyle}>
                {PLAYERS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <input type="number" placeholder="0–300" min={0} max={300}
                value={e.score} onChange={ev => updateEntry(i, "score", ev.target.value)}
                style={inputStyle} />
              <select value={e.season} onChange={ev => updateEntry(i, "season", ev.target.value)}
                style={inputStyle}>
                <option value="S1">Season 1</option>
                <option value="S2">Season 2</option>
              </select>
              <button onClick={() => removeRow(i)} style={{
                background: "none", border: "none", color: C.muted, fontSize: 18, lineHeight: 1,
              }}>×</button>
            </div>
          ))}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addRow} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              color: C.text, padding: "9px 18px", borderRadius: 8, fontSize: 14,
            }}>+ Add Row</button>
            <button onClick={submitManual} style={{
              background: C.accent, border: "none", color: C.bg,
              padding: "9px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700,
            }}>Save Scores</button>
          </div>
        </Card>
      ) : (
        <Card>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: C.muted, marginBottom: 12, lineHeight: 1.6 }}>
              CSV format: <code style={{ background: C.surface, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>date, player, score, season</code><br />
              Example: <code style={{ background: C.surface, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>2026-05-21, Logan, 134, S2</code><br />
              Season column is optional (defaults to S2). Players must match the roster exactly.
            </div>
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button onClick={() => fileRef.current.click()} style={{
                background: C.surface, border: `1px solid ${C.border}`,
                color: C.text, padding: "8px 16px", borderRadius: 8, fontSize: 13,
              }}>📂 Upload CSV File</button>
              <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFile} style={{ display: "none" }} />
            </div>
          </div>
          <textarea
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            placeholder={"date, player, score, season\n2026-05-21, Logan, 134, S2\n2026-05-21, Aaron, 118, S2"}
            style={{
              ...inputStyle, width: "100%", minHeight: 200, resize: "vertical",
              fontFamily: "monospace", fontSize: 13, lineHeight: 1.6,
            }}
          />
          <div style={{ marginTop: 12 }}>
            <button onClick={submitCSV} style={{
              background: C.accent, border: "none", color: C.bg,
              padding: "9px 24px", borderRadius: 8, fontSize: 14, fontWeight: 700,
            }}>Import CSV</button>
          </div>
        </Card>
      )}

      {/* Roster reference */}
      <Card style={{ marginTop: 20 }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase",
          letterSpacing: "0.08em", marginBottom: 10 }}>Player Roster</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PLAYERS.map(p => (
            <span key={p} style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 6, padding: "4px 10px", fontSize: 13,
            }}>{p}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}

const inputStyle = {
  background: "#0D0F14", border: `1px solid ${C.border}`, borderRadius: 8,
  color: C.text, padding: "8px 12px", fontSize: 14, outline: "none", width: "100%",
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [games, setGames] = useState(DEFAULT_GAMES);
  const [page, setPage] = useState("home");
  const [season, setSeason] = useState("S2");
  const [focusPlayer, setFocusPlayer] = useState(null);

  const handleAddGames = useCallback((newGames) => {
    setGames(prev => [...prev, ...newGames]);
  }, []);

  const pageProps = { games, season, setPage, setFocusPlayer, focusPlayer };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh" }}>
        <Nav page={page} setPage={setPage} season={season} setSeason={setSeason} />
        <main>
          {page === "home"        && <HomePage        {...pageProps} />}
          {page === "leaderboard" && <LeaderboardPage {...pageProps} />}
          {page === "players"     && <PlayersPage     {...pageProps} />}
          {page === "sessions"    && <SessionsPage    {...pageProps} />}
          {page === "records"     && <RecordsPage     {...pageProps} />}
          {page === "enter"       && <EnterPage onAddGames={handleAddGames} />}
        </main>
        <footer style={{
          borderTop: `1px solid ${C.border}`, padding: "20px 24px",
          textAlign: "center", color: C.muted, fontSize: 12, marginTop: 40,
        }}>
          Bowling for the Gënts · Built with 🎳
        </footer>
      </div>
    </>
  );
}
