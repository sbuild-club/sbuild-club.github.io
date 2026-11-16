# sbuild-club.github.io

The website of SBUILD, SBU's First Tech Entrepreneurship Club. It is a single static page served by GitHub Pages at <https://sbuild-club.github.io>.

Built with Next.js 16 (App Router, static export), React 19, TypeScript and Tailwind CSS v4.

## Run it locally

You need Node.js 20.9 or newer (CI uses Node 26 LTS).

```sh
npm ci        # install the exact dependency versions from package-lock.json
npm run dev   # start the dev server at http://localhost:3000
```

Other commands:

```sh
npm run lint                          # ESLint
npx tsc --noEmit --incremental false  # type check
npm run build                         # static export into out/
```

## Change the copy

All text on the site lives in one file: `src/content/site.ts` (club name, tagline, programs, projects, events, team, links, email). Values in `[BRACKETS]` are placeholders waiting for real content. Edit the file, check it with `npm run dev`, then commit.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which installs dependencies, runs lint and the type check, builds the static site into `out/` and publishes it with GitHub Pages. You can also start it by hand from the repository's **Actions** tab ("Deploy to GitHub Pages", "Run workflow"). If any step fails, nothing is published and the live site stays as it was.

The repository's Pages source must be set to **GitHub Actions** (Settings, Pages, Build and deployment, Source).

`out/` is build output and is not committed. Files in `public/` are copied into it as they are (for example `public/.nojekyll`). The favicon is `src/app/icon.svg` and the link preview image is `src/app/opengraph-image.png`.

## Design docs

Everything about how the site should look and how the code is organised is in `docs/`:

- `docs/BRIEF.md`: design direction and page structure.
- `docs/CONTRACT.md`: code rules, component interfaces, colour and type tokens.
- `docs/reference/`: the logo banner, brand rules, design tokens and the approved mockup.
