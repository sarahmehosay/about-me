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

## Tests

```bash
npm test               # run all unit tests once
npm run test:watch     # re-run while you edit
npm run test:coverage  # also show which lines the tests cover
```

[Vitest](https://vitest.dev) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), running in a simulated browser (jsdom). The tests live in `src/test/`:

| File | What it checks |
| --- | --- |
| `data.test.jsx` | The content files: required fields, links use https, icon names exist, a job's paper exists, no duplicates |
| `useTheme.test.jsx` | Light/dark switch: system setting, saved choice, toggling, storage blocked |
| `useLiveProjects.test.jsx` | Live-demo check: keeps online demos, drops failed ones, HEAD request, no update after unmount |
| `Nav.test.jsx` | Menu links, which link is highlighted (scroll, mouse, bottom of page), theme button, sideways menu |
| `sections.test.jsx` | Skills toggle, Experience and its publication box, Contact, Tools, Process, Education, About |
| `dialogs.test.jsx` | Publications pop-up, Hero button, live-demo cards and the demo pop-up |
| `App.test.jsx` | The whole page: section order, demo show/hide, Docs page routing, tab title, scrolling |
| `indexHtml.test.js` | `index.html`: page shell, saved-theme script, Google Analytics snippet (the gtag.js file is never fetched in tests) |

`src/test/setup.js` adds the browser features jsdom lacks (dialogs, `matchMedia`, scrolling) and cleans up after every test. Tests never touch the network: `fetch` is replaced with a fake.

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
