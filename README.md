# SERP Rank Tracker

Monitors Google Search positions for keywords. Shows current rank, best rank, and position change over time with a color-coded badge (green if top 3, amber if top 10, red otherwise).

## Why

Needed to track how a client's site ranked for specific terms. Built this to automate the checking — the scraper runs at 7 AM UTC daily and pushes results to Turso.

## Stack

Next.js 15, Turso (libSQL), Recharts, GitHub Actions, Vercel

## Live

**[serp-tracker-one.vercel.app](https://serp-tracker-one.vercel.app)**

## Running locally

```bash
npm install
# add your keys to .env.local
npm run dev
npm run scrape
```
