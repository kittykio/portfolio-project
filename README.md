# Kitty Kio Portfolio

The source code for [kittykio.com](https://kittykio.com), the bilingual portfolio of Kitty Kio—a creative developer and artist. It brings projects, technical writing, experiments, and contact requests together in one expressive web experience.

## Features

- English and Japanese routes
- Project case studies and filtering
- MDX blog with search, syntax highlighting, related posts, and a table of contents
- Interactive creative lab and “Now” page
- Theme and reduced-motion preferences
- Local saved items and project/post reactions
- Project, article, and general contact request flows
- Dynamic Open Graph cards, sitemap, robots, and route metadata
- Optional first-party analytics, email notifications, and Ask Kiki assistant

## Built with

- Next.js 14 App Router
- React 18 and TypeScript
- Tailwind CSS and Sass
- Framer Motion, GSAP, and React Three Fiber
- MDX
- MongoDB and Mongoose
- Resend, OpenAI, Google Analytics, and Vercel Analytics

## Getting started

Requirements:

- Node.js 20 or newer
- npm

Install dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy the example environment file before enabling optional integrations:

```bash
cp .env.example .env.local
```

The site can render without external services. Configure only the features you need:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, robots, and social cards |
| `MONGODB_URI` | Persistent likes, requests, and first-party analytics |
| `MONGODB_DB_NAME` | Optional database override; defaults to `portfolio-project` |
| `ANALYTICS_DASHBOARD_TOKEN` | Protects the private `/insights` dashboard |
| `RESEND_API_KEY` | Sends request notification emails |
| `RESEND_FROM_EMAIL` | Verified sender used by Resend |
| `NEXT_PUBLIC_GA_ID` | Optional Google Analytics measurement ID |
| `NEXT_PUBLIC_ASK_KIKI_ENABLED` | Enables the Ask Kiki interface when set to `true` |
| `OPENAI_API_KEY` | Enables live Ask Kiki answers |
| `OPENAI_MODEL` | Optional model override; defaults to `gpt-5-mini` |

Keep real credentials in `.env.local` and never commit them.

## Content

- Project data: `projects/projects.json`
- Project media: `public/projects/`
- MDX articles: `blog/`
- Shared UI: `src/components/`
- Routes and API handlers: `src/app/`

## Commands

```bash
npm run dev         # Start the local development server
npm run build       # Create and validate a production build
npm run start       # Run the production build
npm run lint        # Run Next.js linting
npm run format      # Format the project with Prettier
npm run lint:deps   # Report potentially unused dependencies
npm run clean:deps  # Prune and deduplicate installed packages
```

## Deployment

The project is designed for Vercel. Configure the required environment variables from `.env.example` in the Vercel project settings before deployment. Local deployment notes are intentionally not committed.

## Brand

**Kitty Kio** is the public brand name. **Kiki** is the personal nickname used in introductions and features such as Ask Kiki.

## License

The source code is licensed under the [MIT License](./LICENSE).

The portfolio writing, project content, images, logo, name, and visual identity are © 2026 Kitty Kio. All rights reserved. These materials are not included in the MIT License and may not be reused without prior written permission.
