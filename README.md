# about-me

Personal "About me" page for **Sarah Meh Osay** — Full-Stack & GIS Developer. A single-page site built with React 19 and Vite 8.

Sections: About (summary + highlights), Technical skills, Tools I use (grouped by workflow), Professional experience, Projects (live demos, shown only when their site is up), Education & training, Built with (languages + frameworks), Contact. A separate **Docs** page (`#/docs`, linked in the menu and footer) explains the languages, frameworks and tools used to build the site. It follows the system light/dark setting and works down to phone width.

## Edit the content

Profile text lives in [src/data/profile.js](src/data/profile.js) and the Docs page text in [src/data/docs.js](src/data/docs.js) (its version numbers are read from `package.json`) — summary, skills, jobs, education, courses and contact links. Components in `src/components/` only handle layout, so you rarely need to touch them.

- Wrap words in `**double asterisks**` in experience bullets to bold them.
- Set `contact.linkedin` to your profile URL to show the LinkedIn button and contact card (hidden while `null`).
- Add `url` to a course in `training` to link its certificate.

## Develop

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev       # http://localhost:5173
npm run lint
npm run build     # outputs dist/
npm run preview
```

## Deploy

### GitHub Pages (automatic)

`.github/workflows/deploy-pages.yml` lints, builds and publishes the site on every push to `main` (or run it manually from the **Actions** tab).

1. Push this folder to a GitHub repo.
2. In the repo, open **Settings → Pages → Source** and choose **GitHub Actions**.
3. Push to `main`. The site appears at:
   - `https://<user>.github.io/<repo>/` for a repo with any name (e.g. `about-me`), or
   - `https://<user>.github.io/` if the repo is named `<user>.github.io`.

The base path is set from the repo name, so no configuration is needed.

### Other hosts

`dist/` is a static site that can be hosted anywhere (GitHub Pages, Netlify, Vercel…). For a GitHub project page served from `/<repo>/`, build with the base path:

```bash
VITE_BASE=/about-me/ npm run build
```

## Structure

```
src/
  data/profile.js        # profile content
  data/docs.js           # Docs page content
  components/
    Nav.jsx              # sticky nav, highlights the section in view
    Hero.jsx             # name, title, summary, highlights
    Skills.jsx
    Experience.jsx       # timeline
    Education.jsx        # degree + professional training
    Contact.jsx
    Docs.jsx             # "How this page is built" page
    Section.jsx, Rich.jsx
  App.jsx                # hash routing between profile and #/docs
  index.css              # design tokens, light/dark, responsive layout
```
