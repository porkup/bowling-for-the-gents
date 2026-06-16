# 🎳 Bowling for the Gënts

A professional bowling analytics dashboard for tracking stats, trends, and records across a friend group — built with React, deployed free forever on GitHub Pages.

## Features

- **Home** — Season snapshot, recent developments, hot/cold players, standings preview
- **Leaderboard** — Full sortable table: avg, high, consistency, improvement, last 5, best stretch, swing
- **Players** — Individual profile page with score history chart, rolling 5-game trend line, full stat breakdown, career vs season comparison
- **Sessions** — Every bowling night logged, expandable for per-player scores
- **Record Book** — Category leaders: high game, most improved, best stretch, most consistent, biggest swing, best night, and more
- **Add Scores** — Manual row-by-row entry or bulk CSV upload

## Live Site

Once deployed: `https://YOUR_USERNAME.github.io/bowling-for-the-gents/`

---

## Setup (one-time, ~5 minutes)

### 1. Create the GitHub repo

1. Go to [github.com/new](https://github.com/new)
2. Name it `bowling-for-the-gents` (must match `vite.config.js` base)
3. Set to **Public**, no README

### 2. Push the code

```bash
cd bowling-for-the-gents
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bowling-for-the-gents.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to repo **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

GitHub Actions will automatically build and deploy. Your site will be live at `https://YOUR_USERNAME.github.io/bowling-for-the-gents/` within ~2 minutes.

---

## Adding Real Scores

### Option A — In the app
Go to **+ Add Scores** and enter scores directly. Note: scores added in the browser are session-only (they reset on refresh). For permanent storage, use Option B.

### Option B — Edit the data file (permanent)
Edit `src/data/scores.js` and add entries to `DEFAULT_GAMES`:

```js
{ date: "2026-06-01", player: "Logan", score: 142, season: "S2" },
{ date: "2026-06-01", player: "Aaron", score: 128, season: "S2" },
```

Then push to GitHub — the site will auto-redeploy in ~2 minutes.

### Option C — CSV upload
In **+ Add Scores → CSV Upload**, paste or upload a CSV:
```
date, player, score, season
2026-06-01, Logan, 142, S2
2026-06-01, Aaron, 128, S2
```

---

## Adding a New Player

In `src/data/scores.js`, add their name to the `PLAYERS` array:
```js
export const PLAYERS = [
  "Logan", "Aaron", ... "NewPlayer"
];
```

---

## Tech Stack

- React 18 + Vite
- Recharts for charts
- GitHub Pages (free, always-on hosting)
- GitHub Actions (auto-deploy on push)
- Zero backend, zero database, zero cost

---

## Local Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`
