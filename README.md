# Ayush Chaudhary — Portfolio

A responsive personal portfolio built with React, TypeScript, and Vite. The site is a static frontend and deploys directly to Vercel.

## Run locally

1. Install Node.js 18 or newer.
2. In this directory, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.

## Build and deploy

Run `npm run build`; Vite writes the production site to `dist/`. Import this folder as a project in Vercel and use the Vite framework preset (build command `npm run build`, output directory `dist`). No environment variables are required.

The résumé PDF is served from `public/ayush-chaudhary-resume.pdf` and is linked for both viewing and download.

The “More in the workshop” section loads up to six non-fork, non-archived public repositories from the GitHub REST API for `claxey`. It runs in the visitor’s browser and uses GitHub’s unauthenticated public API, so there is no token or environment variable to configure. GitHub may rate-limit anonymous API requests; the page shows a link to the profile if the API is unavailable.

Goblin mode plays the supplied loop from `public/goblin-mode.mp3` and uses the supplied muted background clip at `public/goblin-background.mp4`. The background video is omitted whenever reduced motion is enabled.
