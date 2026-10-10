# Jackson Satermo · Personal website

An editable MERN portfolio with a warm ivory design, teal accents, a sage desktop cursor glow, and About, Experience, and Projects sections. It includes Jackson's North Dakota University System role, NDSU education and graduation photo, technical skills with experience context, social profiles, professional email, and completed, in-development, and upcoming projects. The public site is https://jacksonsatermo.com, hosted on Render with its domain managed through Cloudflare.

React and Vite provide the interface. Express runs the API and serves the built site in production. MongoDB stores the portfolio content through Mongoose. There is no public write API or admin login: edit the source files in your GitHub repository to update the site.

## Run it on your computer

Install [Node.js 24](https://nodejs.org/) and [Git](https://git-scm.com/), then open a terminal:

```bash
git clone https://github.com/jksatermo/personal-website.git
cd personal-website
npm ci
npm run dev
```

Open **http://localhost:5173**. The Express API runs at **http://localhost:3001**. Stop both servers with `Ctrl+C`.

`npm run dev` starts a real local MongoDB process using `mongodb-memory-server` when `MONGODB_URI` is unset. The first run downloads a checksum-verified MongoDB binary, so allow time and internet access. Local database files persist in the ignored `.data/mongodb/` directory, and downloaded binaries are cached in `.cache/mongodb-binaries/`. You do not need an Atlas account for local development.

If you already have a MongoDB database, copy `.env.example` to `.env` and set `MONGODB_URI` there. The development script will use it instead. Keep `.env` private; it is excluded from Git.

If a Linux cloud environment blocks MongoDB's download server but provides Docker, run `npm run setup:mongodb:docker` once, then retry `npm run dev` or `npm test`. This optional helper pulls the pinned official MongoDB image through Docker's digest verification and extracts the binary into the ignored `.cache/mongodb-docker/` directory. It requires a working Docker daemon and compatible Linux libraries; it is not needed for a normal local installation or for Atlas-backed production hosting.

## Make it your own

Most changes belong in [`content/portfolio.json`](content/portfolio.json). This is the source of truth: the server validates it and syncs it to MongoDB every time the server starts. Direct changes in MongoDB will be replaced on the next server start. The development server watches content changes; refresh the browser after saving. On a hosted site, commit your changes and redeploy.

| What to change                                             | Where to edit                                                                                              |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Name, headline, location, and short introduction           | `profile.name`, `profile.role`, `profile.tagline`, `profile.location`                                      |
| About paragraphs                                           | `profile.bio` — one quoted string per paragraph                                                            |
| The small status line below social links                   | `profile.availability`                                                                                     |
| GitHub, LinkedIn, Instagram, and Facebook links            | `socials` — each entry has `name` and `url`                                                                |
| Professional email link                                    | `profile.email` — a plain email address                                                                    |
| Primary portrait                                           | `profile.portrait` — `src`, `alt`, and optional `position`                                                 |
| About section photos                                       | `aboutPhotos` — each entry has `src`, `alt`, `caption`, and optional `position`                            |
| Employment                                                 | `experience` — role, company, period, location, description, and skills; `compact: true` for earlier roles |
| Degree, graduation date, focus areas, and graduation photo | `education`                                                                                                |
| Languages, tools, and experience context                   | `skillGroups`                                                                                              |
| Project descriptions, status, tags, and links              | `projects`                                                                                                 |
| Hobbies displayed below the About text                     | `interests`                                                                                                |

JSON requires double quotes and does not allow comments or trailing commas. Use full `https://` URLs for external links. Use `links: []` for a project with no public destination yet. Each project action is a `{ "label", "url" }` pair; use labels such as `GitHub`, `View project`, or `Live Demo`. The older single `url` field still works as a fallback when `links` is absent.

To add a future project, duplicate an object inside `projects`, give it a unique `id`, and edit the fields:

```json
{
  "id": "my-next-project",
  "title": "My Next Project",
  "eyebrow": "WEB DEVELOPMENT",
  "description": "A short explanation of what this project does and why I built it.",
  "status": "Coming soon",
  "kind": "community",
  "tags": ["React", "Node.js", "MongoDB"],
  "url": null,
  "links": []
}
```

When it launches, update `status` and add a link to the real destination. `kind` selects the decorative concept illustration: `resume-matcher`, `wellness`, or `community`. The AI Resume Matcher illustration is original portfolio artwork, not a screenshot or a claim about the project’s actual interface. These illustrations are previews of ideas, not finished project screenshots. The portrait, graduation photo, and circle group photo use original JPEG files in `client/public/images/`; point the photo fields above at their exact filenames, including capitalization. See [photo instructions](client/public/images/README.md). The page crops images only for display and links to each full photo. Unavailable images are omitted; verify the actual photos load before considering the upload complete.

For design changes:

- Edit colors and layout in [`client/src/styles.css`](client/src/styles.css). Start with the `:root` background and the `--text`, `--accent`, `--muted`, and `--border` variables. Some illustration and component colors are defined further down the file.
- Edit section structure and interactions in [`client/src/App.jsx`](client/src/App.jsx).
- Edit the browser description, title, and theme color in [`client/index.html`](client/index.html).
- Replace the browser icon in [`client/public/favicon.svg`](client/public/favicon.svg).

The page includes keyboard focus styles, a skip link, mobile layouts, and reduced-motion support. The spotlight runs on desktop pointer movement and is disabled when reduced motion is requested.

## Content follow-ups

- **Public resume:** the owner-provided PDF is stored unchanged at `client/public/Jackson-Satermo-Resume.pdf`, linked beside the email/social actions through `profile.resume`. It contains no phone number. Replace only with an approved public resume; never add a private application-specific copy.
- **Many Rooms stack:** the project description and tags reflect the implemented web/mobile scheduling, availability, conflict detection, and leader workflows in merged Milestones 1 and 2. “Building with now” distinguishes its actively used technologies from professional NDUS experience. The project remains in development; production authentication, SMS, recurring events, native distribution, and a hosted live demo are not claimed. The MERN footer describes this portfolio.
- **Capstone source:** the AI Resume Matcher action points to the [official NDSU 2024 capstone page](https://www.ndsu.edu/computer-science/current-students/capstone-program/2024-projects#:~:text=Kompletion%20LLC). The text fragment highlights Kompletion in supporting browsers; other browsers still open the official page. The contribution is limited to membership in its four-person team, with no individual responsibilities or metrics inferred.

## Edit directly on GitHub

Open [jksatermo/personal-website](https://github.com/jksatermo/personal-website), select the `main` branch, and open the file you want to change. Use GitHub's pencil icon to edit and **Commit changes** to save. With automatic deployment enabled on your host, a commit to `main` triggers a new deployment.

For larger changes, clone the repository using the commands above and open the folder in a code editor such as VS Code. After editing and checking the site locally:

```bash
git add content/portfolio.json
git commit -m "Update portfolio content"
git push origin main
```

Include other changed files in `git add` as needed. Never commit database credentials or `.env` files.

## Commands and checks

| Command                        | Purpose                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------- |
| `npm ci`                       | Install the exact locked dependencies                                                     |
| `npm run dev`                  | Start MongoDB, the Express API, and the React development server                          |
| `npm run format`               | Apply Prettier formatting                                                                 |
| `npm run format:check`         | Verify formatting without edits                                                           |
| `npm run lint`                 | Check JavaScript and React hooks                                                          |
| `npm test`                     | Run API tests against an isolated real MongoDB database                                   |
| `npm run test:browser`         | Check a running site in Chromium, including navigation, mobile layout, and reduced motion |
| `npm run build`                | Build the React client into `client/dist/`                                                |
| `npm start`                    | Run Express; requires `MONGODB_URI` and serves `client/dist/` when present                |
| `npm run seed`                 | Sync the content file to the database specified by `MONGODB_URI`                          |
| `npm run setup:mongodb:docker` | Optional Linux/Docker fallback when MongoDB's normal binary download is blocked           |

Tests use a separate database and do not modify your configured production database. The first test run may also need to download MongoDB.

For browser checks, keep `npm run dev` running in one terminal. In another, install a browser once with `npx playwright install chromium`, then run `npm run test:browser`. The script uses `/usr/bin/chromium` when available, or Playwright's downloaded Chromium otherwise. Optional environment variables are `TEST_BASE_URL` for another running site, `CHROMIUM_PATH` for a browser executable, and `BROWSER_ARTIFACTS` for the screenshot directory. Screenshots default to `/tmp/personal-website-browser`.

Useful API endpoints:

- `GET /api/health`: database connection status; returns HTTP 200 when connected and 503 when unavailable.
- `GET /api/portfolio`: the current public portfolio content from MongoDB.

The React build also includes the public content file as an initial display and fallback if the API is temporarily unavailable. This content is public; do not add secrets to it.

To try a production build locally, set a working `MONGODB_URI` in `.env`, then run:

```bash
npm run build
npm start
```

Open **http://localhost:3001**. Set `NODE_ENV=production` in your hosting provider's environment settings for deployment.

## Put the site online

Follow [the deployment guide](docs/DEPLOYMENT.md) to connect GitHub, MongoDB Atlas, and Render. [`render.yaml`](render.yaml) provides a reusable Render configuration. The site is deployed at https://jacksonsatermo.com. With Render automatic deployment enabled, pushes to `main` publish updates; confirm the Render deployment finishes successfully.

The canonical address is `jacksonsatermo.com`. Keep its existing Cloudflare DNS and Render custom-domain settings unless you are deliberately changing hosts or domains.

## Repository map

```text
client/                 React interface, styles, and public images
content/portfolio.json  Editable public content
server/                 Express API, MongoDB model, and API tests
scripts/                Local development and MongoDB helpers
docs/DEPLOYMENT.md       Hosting and domain instructions
render.yaml             Render service configuration
```

For Codex cloud tasks, use the existing checkout. Each task already has an isolated environment; a separate Git worktree is unnecessary unless explicitly requested.
