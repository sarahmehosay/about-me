import { useEffect, useState } from 'react'
import BuiltWith from './components/BuiltWith'
import Contact from './components/Contact'
import Docs from './components/Docs'
import Education from './components/Education'
import Experience from './components/Experience'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Tools from './components/Tools'
import useLiveProjects from './hooks/useLiveProjects'
import { education, experience, highlights, profile, projects, skills, tools, training } from './data/profile'

const YEAR = new Date().getFullYear()
const DOCS = '#/docs'

const currentPage = () => (window.location.hash.startsWith(DOCS) ? 'docs' : 'home')

export default function App() {
  const [page, setPage] = useState(currentPage)
  const liveProjects = useLiveProjects(projects)

  // Hash routing: "#/docs" shows the documentation page, anything else the profile.
  useEffect(() => {
    const onHash = () => setPage(currentPage())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // After switching pages, jump to the requested section (e.g. "#skills") or the top.
  useEffect(() => {
    const id = window.location.hash.slice(1)
    const target = page === 'home' && id ? document.getElementById(id) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
    document.title = page === 'docs' ? `Built with · ${profile.name}` : `${profile.name} · Full-Stack & GIS Developer`
  }, [page])

  return (
    <>
      <Nav name={profile.name} page={page} docsHref={DOCS} hide={liveProjects?.length ? [] : ['projects']} />
      <main>
        {page === 'docs' ? (
          <Docs />
        ) : (
          <>
            <Hero profile={profile} highlights={highlights} />
            <Skills skills={skills} />
            <Tools tools={tools} />
            <Experience experience={experience} />
            <Projects projects={liveProjects} />
            <Education education={education} training={training} />
            <BuiltWith docsHref={DOCS} />
            <Contact contact={profile.contact} />
          </>
        )}
      </main>
      <footer>
        © {YEAR} {profile.name} · <a href={DOCS}>How this page is built</a>
      </footer>
    </>
  )
}
