// Content for the "Built with" documentation page (#/docs).
// Version numbers are read from package.json, so they stay in sync after upgrades.
import pkg from '../../package.json'

const deps = { ...pkg.dependencies, ...pkg.devDependencies }
// "^19.3.1" -> "19.3"
const v = (name) => deps[name]?.replace(/^[^\d]*/, '').split('.').slice(0, 2).join('.')

export const languages = [
  {
    name: 'JavaScript (ES2022+)',
    use: 'All application logic, written as ES modules. Components use JSX, the HTML-like syntax React compiles into JavaScript.',
    files: 'src/**/*.jsx, src/data/*.js',
  },
  {
    name: 'CSS',
    use: 'All styling, in one plain stylesheet: custom properties (design tokens), Flexbox and Grid layouts, media queries for phones, and prefers-color-scheme for dark mode.',
    files: 'src/index.css',
  },
  {
    name: 'HTML',
    use: 'A single page shell with the page title and description; React renders everything inside <div id="root">.',
    files: 'index.html',
  },
]

export const stack = [
  {
    category: 'UI framework',
    name: 'React',
    version: v('react'),
    url: 'https://react.dev',
    use: 'Builds the page from small function components (Nav, Hero, Skills, Experience…). Uses the useState and useEffect hooks, StrictMode, and createRoot from react-dom.',
  },
  {
    category: 'Build tool',
    name: 'Vite',
    version: v('vite'),
    url: 'https://vite.dev',
    use: 'Runs the dev server with instant hot reload and bundles the site into static files in dist/ for production.',
  },
  {
    category: 'Vite plugin',
    name: '@vitejs/plugin-react',
    version: v('@vitejs/plugin-react'),
    url: 'https://github.com/vitejs/vite-plugin-react',
    use: 'Compiles JSX and enables React Fast Refresh, so edits appear in the browser without losing page state.',
  },
  {
    category: 'Linter',
    name: 'Oxlint',
    version: v('oxlint'),
    url: 'https://oxc.rs/docs/guide/usage/linter',
    use: 'Checks the code for bugs and React mistakes (rules of hooks, impure render code). Run with npm run lint.',
  },
  {
    category: 'Font',
    name: 'Inter (Google Fonts)',
    url: 'https://fonts.google.com/specimen/Inter',
    use: 'The typeface for all text, loaded from Google Fonts with a system-font fallback.',
  },
  {
    category: 'Runtime',
    name: 'Node.js',
    version: '20.19+ / 22.12+',
    url: 'https://nodejs.org',
    use: 'Needed only to develop and build. The finished site is static HTML, CSS and JavaScript with no server.',
  },
]

export const techniques = [
  ['Content as data', 'All resume text lives in src/data/profile.js. Components only handle layout, so content updates never touch the UI code.'],
  ['Hash routing', 'This page is reached at #/docs. A small hashchange listener switches pages, so it works on any static host (such as GitHub Pages) without a router library or server rules.'],
  ['IntersectionObserver', 'A browser API that tracks which section is on screen and highlights it in the top menu.'],
  ['Light & dark mode', 'Colors are CSS custom properties that switch automatically with the system setting via prefers-color-scheme.'],
  ['Responsive layout', 'CSS Grid with auto-fit columns and a 640px breakpoint adapt the layout from desktop down to phones.'],
  ['Accessibility', 'Semantic landmarks (header, nav, main, section, footer), labelled sections, visible keyboard focus, and reduced-motion support.'],
]

export const notUsed = 'No UI component library, CSS framework, router, state-management library or backend. The page is plain React and CSS, which keeps the bundle small (under 80 kB of gzipped JavaScript).'

export const scripts = [
  ['npm run dev', 'Start the dev server at http://localhost:5173'],
  ['npm run build', 'Build the static site into dist/'],
  ['npm run preview', 'Serve the built dist/ locally'],
  ['npm run lint', 'Lint the code with Oxlint'],
]
