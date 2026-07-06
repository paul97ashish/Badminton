# 🏸 Toronto Drop-in Sports

Find every drop-in sport and activity at Toronto community centres — badminton, basketball, swimming, pickleball, skating, fitness and more — by date, zone, and age group, in one place.

**Live site:** [badminton.ashishpaul.ca](https://badminton.ashishpaul.ca)

## Features

- **26 sports & activities** — court sports, swimming, skating, yoga, fitness and more, each at `/programs/<sport>/<date>`
- **Daily schedules** — browse sessions for any date with a 7-day date strip
- **Filters** — narrow by time of day, age group, and city zone; selections are stored in the URL, so they persist across days and can be shared as links
- **List & map views** — flip to an interactive map of venues (Leaflet + OpenStreetMap); markers show session times on hover, and the view choice sticks while browsing
- **Venue links** — every venue links to its official page on toronto.ca and to Google Maps
- **Dark mode** — follows your system preference, with a manual toggle in the header

## Data source

All schedule data comes from the City of Toronto's open data portal (CKAN), fetched live at request time and cached for an hour:

| Dataset | Used for |
| --- | --- |
| [Registered Programs and Drop In Courses Offering](https://open.toronto.ca/dataset/registered-programs-and-drop-in-courses-offering/) | Drop-in session times, age ranges (`Drop-in` tab) and venue names, addresses, districts (`Locations` tab) |
| [Parks and Recreation Facilities](https://open.toronto.ca/dataset/parks-and-recreation-facilities/) | Venue coordinates for the map view |

The datasets are joined by `Location ID`. The City refreshes the program data weekly; no API key is required.

This site is **not affiliated with the City of Toronto**. Always confirm details with the community centre before attending.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- [React Leaflet](https://react-leaflet.js.org/) + OpenStreetMap for the map view
- Deployed to [Cloudflare Workers](https://workers.cloudflare.com/) via [OpenNext](https://opennext.js.org/cloudflare)

## Development

```bash
npm install
npm run dev        # local dev server at http://localhost:3000
npm run lint       # ESLint
npm run build      # production build
```

Key paths:

```
src/
  app/
    page.tsx                          # home page with sport picker
    programs/page.tsx                 # all sports with today's counts
    programs/[sport]/[date]/          # daily schedule page per sport
  components/                         # header, cards, filters, date strip, map…
  lib/
    sports.ts                         # sport catalog + course-title matching
    toronto-api.ts                    # City of Toronto open data client + joins
    filter-params.ts                  # URL <-> filter/view state
    format.ts                         # date/time/age formatting
```

## Deployment

Pushes to `master` are built and deployed automatically by [Cloudflare Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (build command `npx opennextjs-cloudflare build`, deploy command `npx wrangler deploy`).

To deploy manually instead:

```bash
export CLOUDFLARE_API_TOKEN=...   # token with Workers Scripts: Edit
npm run deploy
```

`npm run preview` runs the production Worker build locally in the Workers runtime.
