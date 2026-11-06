// All page content lives here. Edit this file to update the site.
// Links set to null are hidden; fill them in to show them.

export const profile = {
  name: 'Sarah Meh Osay',
  title: 'Full-Stack Developer | GIS Developer',
  summary:
    'Full-Stack and GIS Developer with 9+ years of experience in software development, specializing in frontend development, full-stack applications, and GIS solutions. Proficient in Vue.js, CesiumJS, Python, and Java/Spring Boot, with experience developing web-based point cloud visualization platforms, ERP modules, and inventory, accounting & warehouse systems. Skilled in LiDAR data processing, system integration, testing, and deployment within Agile environments.',
  contact: {
    email: 'sarahmeh.osay@gmail.com',
    phone: null,
    linkedin: 'https://www.linkedin.com/in/sarah-meh-osay-247898b9/',
    github: 'https://github.com/sarahmehosay',
  },
}

export const highlights = [
  { value: '9+', label: 'years in software development' },
  { value: '100+', label: 'GIS features shipped' },
  { value: '950+', label: 'bugs & issues resolved' },
  { value: '1', label: 'peer-reviewed paper' },
]

export const skills = [
  { group: 'Frontend & GIS', items: ['Vue.js', 'JavaScript', 'CesiumJS', 'Tailwind CSS', 'ArcGIS'] },
  { group: 'Backend & Programming', items: ['Python', 'Java', 'Spring Boot', 'Odoo', 'Object-Oriented Programming (OOP)'] },
  {
    group: 'Databases & Infrastructure',
    items: ['MySQL', 'PostgreSQL', 'Apache Airflow', 'Apache Kafka', 'Confluent', 'Docker', 'Git', 'Ubuntu', 'Google Cloud Platform (GCP)'],
  },
  { group: 'AI-Assisted Development', items: ['Claude Code', 'OpenAI Codex'] },
  { group: 'Tools & Practices', items: ['Keycloak', 'Metabase', 'Cypress', 'Software Testing', 'CI/CD', 'Agile', 'Scrum'] },
]

// Tools used day to day, grouped and ordered by how central they are to the work.
export const tools = [
  {
    group: 'Development & environment',
    items: [
      ['VS Code', 'Coding, local system setup and AI-assisted development'],
      ['GitHub', 'Repository management'],
      ['Docker Desktop', 'Managing Docker images and tracking container logs'],
      ['WSL', 'Development, command-line tools and server workflows without leaving Windows'],
      ['GitK', 'Repository management and reviewing commits'],
    ],
  },
  {
    group: 'GIS & point cloud',
    items: [
      ['CloudCompare', 'Manual classification, point cloud clipping and other point cloud tools'],
      ['QGIS', 'Geospatial data annotation'],
      ['AWS S3', 'Managing stored data for research implementation'],
    ],
  },
  {
    group: 'Planning & collaboration',
    items: [
      ['ClickUp', 'Ticket and task tracking in sprints'],
      ['Figma', 'Design reference and review'],
      ['Notion', 'Documentation and publishing public pages'],
      ['Loom', 'Video recordings of feature demos and bug reports'],
      ['Fathom', 'Meeting transcripts and summaries'],
    ],
  },
  {
    group: 'Product & user insight',
    items: [
      ['Mixpanel', 'Monitoring how users interact with system features'],
      ['UserGuiding', 'Step-by-step user guides for delivered systems'],
    ],
  },
]

export const experience = [
  {
    role: 'GIS Engineer',
    company: 'Locus Blue',
    period: 'Nov 2022 – Present',
    location: 'Tokyo, Japan (Remote)',
    points: [
      'Developed and enhanced **100+ GIS features** for a web-based point cloud processing and visualization platform using Vue 3 and CesiumJS.',
      'Implemented **2 major processing capabilities**—Ground Surface Extraction and AI-based area-type detection—incorporating configurable parameters, previews & notifications.',
      'Enhanced **2D and 3D visualization** by implementing orthographic camera mode, reset-view functionality, automatic camera state saving, and custom mouse controls.',
      'Improved point cloud visualization through **25+ rendering and styling enhancements**, including intensity gradients, classification styling, attribute configuration, and interactive metadata display.',
      'Resolved **350+ application bugs** related to rendering, camera controls, and measurement tools, and implemented automated unit tests using Vitest to improve reliability.',
      'Developed **3 administrative and UI capabilities**: usage-log visualization, administrative pagination, and bilingual English/Japanese interfaces.',
      'Leveraged AI-assisted development tools to streamline programming, technical documentation, and research while collaborating in Agile development workflows.',
      'Annotated **100+ LiDAR training datasets** for an AI-based point cloud autoclassification algorithm, contributing to a project reporting **90% classification accuracy**.',
      'Co-authored **1 peer-reviewed research paper** on ground surface classification methods, contributing to LiDAR and point cloud processing research.',
    ],
    tags: ['Vue 3', 'CesiumJS', 'Vitest', 'LiDAR', 'Point Cloud'],
  },
  {
    role: 'Full-Stack Web Developer',
    company: 'Apollo Technologies Inc.',
    period: 'Apr 2017 – Sep 2022',
    location: 'Davao City, Philippines',
    points: [
      'Developed **15+ custom Odoo Enterprise Resource Planning (ERP) modules** using Python to support business operations and workflows.',
      'Contributed to the **end-to-end development and implementation of 2 enterprise systems** (inventory management and accounting) using Java, Spring Boot, Vue.js, and Python.',
      'Developed **5+ message queues and 5+ microservices** using Python and Java to facilitate communication and data integration between two systems.',
      'Participated in the full software development lifecycle (SDLC) of **1 Warehouse Management System (WMS)**, including research, system design, frontend and backend development, testing, deployment, and maintenance.',
      'Identified and resolved **600+ software issues** during system testing and ongoing maintenance, contributing to application stability and reliability in an Agile development environment.',
    ],
    tags: ['Python', 'Odoo', 'Java', 'Spring Boot', 'Vue.js', 'Microservices'],
  },
  {
    role: 'Science Research Assistant',
    company: 'Phil-LiDAR 1, University of the Philippines Mindanao',
    period: 'Jan 2016 – Dec 2016',
    location: 'Davao City, Philippines',
    points: [
      'Led field survey activities, coordinating field enumerators, logistics, and local government units (LGUs) to support LiDAR-based flood risk assessment research.',
      'Performed **LiDAR data digitization and geospatial feature extraction** using ArcMap (ArcGIS) to identify and assess structures potentially affected by simulated flood events.',
      'Supported **LiDAR-based research and geospatial data analysis**, contributing to the preparation and validation of research outputs for flood hazard assessment.',
    ],
    tags: ['ArcGIS', 'LiDAR', 'Field Research'],
  },
]

// Live demos embedded on the page. Each one is shown only if its URL responds when the page loads.
export const projects = [
  {
    name: 'Inventory system',
    url: 'https://sarahmehosay.github.io/inventory-fe/',
    description:
      'A web app for managing stock: list, search, add and edit items, archive and restore them, and spot low-stock items at a glance. This demo runs on built-in sample data in the browser; the full system connects it to a REST API backend.',
    stack: [
      ['Frontend', ['Vue 3', 'Vite']],
      ['Languages', ['JavaScript', 'HTML', 'CSS']],
      ['Backend (not in demo)', ['FastAPI (Python)', 'Spring Boot (Java)']],
    ],
  },
  {
    name: 'Point cloud viewer',
    url: 'https://sarahmehosay.github.io/laz-viewer/',
    description:
      'Views LAS/LAZ LiDAR point clouds on a 3D globe. Drop a .las or .laz file into the viewer and it is decoded and displayed right in the browser. The full version also extracts the ground surface on a server; that part needs the backend, which is not running in this demo.',
    stack: [
      ['Frontend', ['Vue 3', 'Vite', 'CesiumJS', 'Tailwind CSS', 'loaders.gl', 'proj4', 'Vitest']],
      ['Languages', ['JavaScript', 'HTML', 'CSS']],
      ['Backend (not in demo)', ['FastAPI (Python)', 'laspy', 'NumPy', 'SciPy']],
    ],
  },
]

export const education = [
  { school: 'University of the Philippines Mindanao', degree: 'Bachelor of Science in Computer Science', date: 'Jun 2015' },
]

// Add a `url` to any course to link its certificate.
export const training = [
  { course: 'Advanced Learning Algorithms', provider: 'DeepLearning.AI & Stanford Online via Coursera', date: 'Oct 2026' },
  { course: 'Agile Leadership: Introduction to Change', provider: 'University of Colorado System via Coursera', date: 'Aug 2026' },
  { course: 'Introduction to Cybersecurity Tools & Cyberattacks', provider: 'IBM via Coursera', date: 'Aug 2026' },
  { course: 'Generative AI: Prompt Engineering Basics', provider: 'IBM via Coursera', date: 'Mar 2026' },
  { course: 'Generative AI for Leaders', provider: 'Vanderbilt University via Coursera', date: 'Jan 2026' },
  { course: 'Supervised Machine Learning: Regression and Classification', provider: 'DeepLearning.AI & Stanford Online via Coursera', date: 'Aug 2025' },
  { course: 'Getting Started with CyberGIS', provider: 'University of Illinois Urbana-Champaign via Coursera', date: 'Oct 2024' },
  { course: 'Generative AI: Introduction and Applications', provider: 'IBM via Coursera', date: 'May 2024' },
  { course: 'Generative AI for Everyone', provider: 'DeepLearning.AI via Coursera', date: 'Mar 2024' },
]
