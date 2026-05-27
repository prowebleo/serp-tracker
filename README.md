# SERP Rank Tracker

Automated Google Search position monitoring — tracks keyword rankings daily with color-coded position badges and trend visualization.

![Dashboard Screenshot](https://github.com/prowebleo/serp-tracker/raw/main/screenshot.png)

## Features

- **Rank tracking** — Monitors Google organic positions for target keywords
- **Position badges** — Color-coded (green ≤3, amber ≤10, red >10)
- **Trend charts** — Recharts area chart with Brush for time range selection
- **CSV export** — Download ranking data as CSV with one click
- **Scheduled scraping** — GitHub Action runs daily at 7 AM UTC

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database | Turso (libSQL) |
| Charts | Recharts |
| Scraping | Automated web scraping pipeline |
| Scheduling | GitHub Actions |
| Deployment | Vercel |

## Live Demo

**[serp-tracker-one.vercel.app](https://serp-tracker-one.vercel.app)**

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

## Run Scraper

```bash
npm run scrape
```
