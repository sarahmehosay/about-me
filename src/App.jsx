import { useEffect, useState } from 'react'
import About from './components/About'
import Contact from './components/Contact'
import Docs from './components/Docs'
import Education from './components/Education'
import Experience from './components/Experience'
import Hero from './components/Hero'
import Nav from './components/Nav'
import Process from './components/Process'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Tools from './components/Tools'
import useLiveProjects from './hooks/useLiveProjects'
import {
  education, experience, featuredSkills, highlights, process, profile, projects, publications, skills, tools, traits, training,
} from './data/profile'

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
      {page === 'docs' ? (
        <>
          <main><Docs /></main>
          <Contact contact={profile.contact} name={profile.name} docsHref={DOCS} />
        </>
      ) : (
        <>
          <main>
            <Hero profile={profile} highlights={highlights} hasProjects={!!liveProjects?.length} publications={publications} />
            <About summary={profile.summary} traits={traits} />
            <Skills featured={featuredSkills} skills={skills} />
            <Tools tools={tools} />
            <Projects projects={liveProjects} />
            <Experience experience={experience} publications={publications} />
            <Process steps={process} />
            <Education education={education} training={training} />
          </main>
          <Contact contact={profile.contact} name={profile.name} docsHref={DOCS} />
        </>
      )}
    </>
  )
}
