export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  tags: string[]
  category: 'Distributed' | 'Frontend' | 'AI & ML' | 'Full Stack' | 'Frontend & AI' | 'Full Stack & AI/ML' | 'Extension'
  image: string
  github: string
  demo: string
  timeline: string
  metrics: { label: string; value: string }[]
  challenges: string[]
  results: string[]
  architecture: string[] // List of steps/components in the diagram
  futureImprovements: string[]
}

export interface Experience {
  id: string
  role: string
  company: string
  period: string
  from: string
  to: string
  duration: string
  location: string
  description: string[]
  tags: string[]
  linkedProjectIds?: string[]
}

export interface EducationEntry {
  id: string
  level: string
  institution: string
  location: string
  period: string
  result: string
  side: 'left' | 'right'
}

export interface Achievement {
  id: string
  title: string
  issuer: string
  date: string
  description: string
  category: 'Award' | 'Hackathon' | 'Leadership' | 'Open Source'
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string // MDX / Markdown content
  date: string
  readTime: string
  tags: string[]
  coverImage: string
}

export const projectsData: Project[] = [
  {
    id: 'BillBuddy',
    title: 'BillBuddy',
    description: 'An AI-powered expense-splitting platform that simplifies group payments with real-time sync and automated settlement reminders.',
    longDescription: 'BillBuddy is a smart, real-time expense splitting platform for managing group finances. It supports group expense creation, multiple split types, individual and shared expense handling, and an analytics dashboard for tracking spending patterns. Convex powers real-time backend sync between members, Clerk handles authentication, and Gemini AI generates intelligent spending insights and automated settlement reminders.',
    tags: ['Next.js 15', 'React 19', 'Tailwind CSS v4', 'Convex', 'Clerk', 'Gemini AI', 'Recharts', 'Vercel'],
    category: 'Full Stack & AI/ML',
    image: 'https://raw.githubusercontent.com/Ankit-iiitkota/BillBuddy/main/screenshots/banner.png',
    github: 'https://github.com/Ankit-iiitkota/BillBuddy',
    demo: 'https://bill-buddy-vert.vercel.app/',
    timeline: '2025 - 2026',
    metrics: [],
    challenges: [
      'Keeping group balances accurate and instantly visible to every member as expenses are added, edited, or settled.',
      'Generating genuinely useful AI spending insights without overwhelming users with noise.'
    ],
    results: [
      'Built real-time group sync on Convex so balance updates and new expenses appear instantly for all members without manual refresh.',
      'Integrated Gemini AI to surface spending pattern insights and automate settlement reminders across groups.'
    ],
    architecture: [
      'Client (Next.js 15 / React 19) -> Clerk Authentication',
      'Authenticated Session -> Convex Real-time Backend & Database',
      'Expense Events -> Convex Sync -> Live Balance Updates across group members',
      'Spending Data -> Gemini AI -> Insights & Recharts Analytics Dashboard'
    ],
    futureImprovements: [
      'Add multi-currency support with live exchange rate conversion for international groups.',
      'Build a mobile app companion with push notifications for settlement reminders.'
    ]
  },
  {
    id: 'AyurVision',
    title: 'AyurVision',
    description: 'An AI-powered health analysis platform bridging modern computer vision with traditional Ayurvedic diagnosis.',
    longDescription: 'AyurVision supports two workflows: patients upload health images for AI-powered analysis and receive detailed condition information, causes, and remedies based on Ayurvedic principles, while Ayurvedic specialists access a dashboard to review all patient reports alongside AI-generated insights. The platform combines a TensorFlow.js analysis pipeline with a full patient/specialist account system.',
    tags: ['React.js', 'Tailwind CSS', 'Node.js', 'Express', 'MongoDB', 'TensorFlow.js', 'OpenAI API'],
    category: 'Full Stack & AI/ML',
    image: '/ayurvison.png',
    github: 'https://github.com/Ankit-iiitkota/AyurVision',
    demo: '',
    timeline: '2025 - 2026',
    metrics: [],
    challenges: [
      'Designing an image analysis pipeline that produces consistent, explainable Ayurvedic condition insights rather than opaque predictions.',
      'Building separate but connected experiences for patients (self-service analysis) and specialists (case review) on one shared data model.'
    ],
    results: [
      'Implemented an image capture and upload flow feeding a TensorFlow.js + OpenAI API analysis pipeline that returns condition information, causes, and remedies.',
      'Built a specialist dashboard surfacing every patient report alongside AI-powered insights for faster review.'
    ],
    architecture: [
      'Patient Client -> Image Capture/Upload -> Express Backend',
      'Express Backend -> TensorFlow.js + OpenAI API Analysis Pipeline',
      'Analysis Result -> MongoDB Patient Report Store',
      'Specialist Dashboard -> MongoDB -> Reviews reports & AI insights per patient'
    ],
    futureImprovements: [
      'Expand the model training set to cover a broader range of Ayurvedic conditions and edge cases.',
      'Add secure specialist-to-patient messaging directly inside the dashboard.'
    ]
  },
  {
    id: 'LinkedinBot',
    title: 'LinkedIn Auto Job Applier',
    description: 'A Python automation tool that searches, filters, and applies to LinkedIn jobs with AI-tailored resumes and application tracking.',
    longDescription: 'An automated job-hunting agent for LinkedIn built on Selenium (undetected-chromedriver). It searches for roles matching configurable filters (experience level, work arrangement, date posted), excludes blacklisted companies or keywords, and completes Easy Apply multi-step forms automatically. An AI layer answers unknown application questions and rewords resume bullets to naturally surface job-description keywords without fabricating experience. A local Flask web UI tracks full application history.',
    tags: ['Python', 'Selenium', 'undetected-chromedriver', 'Flask', 'Groq', 'Gemini', 'OpenAI-compatible APIs', 'LaTeX (Tectonic)'],
    category: 'AI & ML',
    image: '/linkedin-auto-bot.png',
    github: 'https://github.com/Ankit-iiitkota/linkedin_auto_bot',
    demo: '',
    timeline: '2025 - 2026',
    metrics: [],
    challenges: [
      'Automating multi-step Easy Apply forms reliably across LinkedIn’s frequently changing DOM structure without triggering bot detection.',
      'Tailoring resume content to job descriptions using AI while strictly preserving factual accuracy and never fabricating experience.'
    ],
    results: [
      'Built a Selenium automation layer with randomized human-like intervals and stealth mode to reliably complete Easy Apply applications end-to-end.',
      'Implemented an AI resume-tailoring pipeline that rewords existing bullets and skill lines to surface keywords, compiling tailored PDF resumes via a LaTeX (Tectonic) pipeline.'
    ],
    architecture: [
      'Config Files (search filters, blacklist, personals) -> Selenium Automation Engine',
      'Job Search -> Filter Pipeline -> Easy Apply Form Automation',
      'Unknown Form Fields -> AI Question Answering (Groq / Gemini / OpenAI-compatible)',
      'Resume Data (JSON) -> AI Tailoring -> LaTeX Compilation -> Tailored PDF Resume',
      'Application Events -> Local Flask Web UI -> History & Tracking Dashboard'
    ],
    futureImprovements: [
      'Add more granular per-company customization rules for cover letter tone and content.',
      'Extend AI question-answering coverage to more non-standard application form field types.'
    ]
  },
  {
    id: 'AIJobFinder',
    title: 'AI Job Finder',
    description: 'A zero-cost, end-to-end job discovery and outreach engine: parses your resume, finds matching roles, tailors applications, and emails recruiters automatically.',
    longDescription: 'AI Job Finder automates the full job search loop: it parses a resume into structured data, scans free job APIs every 2 hours for matching openings, rewords resume bullets with job-description keywords (never fabricating experience) to generate ATS-optimized PDF resumes, and runs a free recruiter-email discovery pipeline (site scraping, pattern learning, DNS verification, confidence scoring). It then sends AI-drafted, personalized cold outreach emails through the user’s own Gmail (approval mode by default) with a 7-day automated follow-up ladder and reply detection, all tracked on a kanban-style dashboard.',
    tags: ['Next.js 16', 'TypeScript', 'Prisma', 'PostgreSQL', 'n8n', 'Groq LLM', 'Webhooks'],
    category: 'Full Stack & AI/ML',
    image: '/ai-job-finder.png',
    github: 'https://github.com/Ankit-iiitkota/job_finder',
    demo: '',
    timeline: '2025 - 2026',
    metrics: [],
    challenges: [
      'Coordinating six independent scheduled automations (job scanning, tailoring, email finding, sending, follow-ups, reply detection) without heavy work blocking the web request path.',
      'Building a free recruiter-email discovery pipeline (scraping, pattern learning, DNS verification) accurate enough to trust for real outreach.'
    ],
    results: [
      'Designed a webhook-driven architecture where Next.js and n8n communicate bidirectionally with Postgres as the single source of truth, keeping automations decoupled from the request/response cycle.',
      'Built a confidence-scored recruiter email finder combining site scraping and pattern learning with DNS verification, running entirely on free-tier services and open-source tooling.'
    ],
    architecture: [
      'Resume Upload -> Resume Parser -> Structured Skill/Experience Data (Postgres via Prisma)',
      'Scheduled n8n Workflow -> Free Job APIs -> Job Match Scan (every 2 hours)',
      'Matched Job -> Groq LLM Tailoring -> ATS-Optimized PDF Resume',
      'Recruiter Discovery Pipeline -> Site Scraping + DNS Verification -> Confidence-Scored Contact',
      'AI-Drafted Outreach -> Gmail Send (approval mode) -> 7-Day Follow-up Ladder -> Dashboard Tracking'
    ],
    futureImprovements: [
      'Add LinkedIn connection-note and DM generation directly into the outreach queue (manual send only, respecting LinkedIn ToS).',
      'Expand the job source pool beyond current free APIs for broader market coverage.'
    ]
  },
  {
    id: 'VeraAI',
    title: 'VERA AI',
    description: 'A deterministic AI message engine generating context-sensitive merchant engagement messages through a 7-stage decision workflow.',
    longDescription: 'VERA AI is a deterministic AI message engine built with Python and FastAPI that generates context-sensitive merchant engagement messages from structured merchant, category, trigger, and customer data. Rather than relying on unconstrained LLM generation, it runs requests through a 7-stage workflow — Feature Extraction, Signal Detection, Goal Inference, Candidate Ranking, and a Rule Engine — for deterministic, explainable AI decision-making, with response quality improved through rule-based ranking, template optimization, and a 5-dimensional evaluation framework across five business categories.',
    tags: ['Python', 'FastAPI', 'REST APIs', 'AI Workflows', 'Rule Engine', 'Docker'],
    category: 'AI & ML',
    image: '/vera-ai.png',
    github: 'https://github.com/Ankit-iiitkota/magicpin-vera-engine',
    demo: '',
    timeline: '2025 - 2026',
    metrics: [],
    challenges: [
      'Generating merchant engagement messages that are context-sensitive and persuasive while remaining fully deterministic and explainable, not black-box LLM output.',
      'Evaluating message quality consistently across five very different business categories.'
    ],
    results: [
      'Designed a 7-stage workflow (Feature Extraction, Signal Detection, Goal Inference, Candidate Ranking, Rule Engine) producing deterministic, explainable message decisions.',
      'Built a 5-dimensional evaluation framework and rule-based ranking system that improved response quality and template consistency across five business categories.'
    ],
    architecture: [
      'Merchant/Category/Trigger/Customer Data -> Feature Extraction Stage',
      'Extracted Features -> Signal Detection -> Goal Inference',
      'Inferred Goal -> Candidate Message Ranking -> Rule Engine',
      'Rule Engine Output -> Deterministic Merchant Engagement Message -> FastAPI REST Response'
    ],
    futureImprovements: [
      'Extend the rule engine to support additional business categories beyond the current five.',
      'Add an admin console for merchants to tune message tone and rule weightings directly.'
    ]
  },
  {
    id: 'PixelSpark',
    title: 'PixelSpark',
    description: 'A full-stack MERN app for generating AI images with DALL-E and sharing them with a community gallery.',
    longDescription: 'PixelSpark lets users generate imaginative images from text prompts using OpenAI’s DALL-E API and share them with a community showcase gallery. Users can browse and search the gallery by prompt text or creator name, post their generated images with metadata, and use a "Surprise Me" button for randomized creative prompts. Images are hosted via Cloudinary with MongoDB storing gallery metadata.',
    tags: ['React 18', 'Vite', 'React Router', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'OpenAI API (DALL-E)', 'Cloudinary'],
    category: 'Full Stack & AI/ML',
    image: '/pixelSpark.png',
    github: 'https://github.com/Ankit-iiitkota/pixelSpark',
    demo: 'https://Ankit-iiitkota.github.io/pixelSpark/',
    timeline: '2025 - 2026',
    metrics: [],
    challenges: [
      'Handling AI image generation latency and Cloudinary uploads without blocking the community gallery browsing experience.',
      'Building prompt/creator search across a growing community gallery with consistent performance.'
    ],
    results: [
      'Integrated the OpenAI DALL-E API with a Cloudinary storage pipeline so generated images post directly into a searchable community gallery.',
      'Implemented search by prompt text or creator name plus a "Surprise Me" randomized prompt generator to encourage exploration.'
    ],
    architecture: [
      'Client (React 18 / Vite) -> Prompt Input -> Express API',
      'Express API -> OpenAI DALL-E API -> Generated Image',
      'Generated Image -> Cloudinary Upload -> MongoDB Metadata Record',
      'Gallery Client -> MongoDB Query (search by prompt/creator) -> Rendered Community Feed'
    ],
    futureImprovements: [
      'Add likes/favorites and user profile pages for saved generations.',
      'Support image-to-image editing and prompt variation generation from an existing gallery post.'
    ]
  },
]

export const experienceData: Experience[] = [
  {
  id: 'exp1',
  role: 'Frontend Developer Intern',
  company: 'Intern Alpha',
  period: 'Jun 2025 - Aug 2025',
  from: 'Jun 2025',
  to: 'Aug 2025',
  duration: '3m',
  location: 'Remote',
  description: [
    'Developed scalable and responsive user interfaces using React.js, JavaScript (ES6+), HTML5, and CSS3, improving application performance and code maintainability.',
    'Collaborated with UI/UX designers, backend developers, and QA teams to build production-ready features, ensuring seamless API integration and cross-browser compatibility.',
    'Optimized reusable UI components by enhancing accessibility, responsiveness, and component reusability, contributing to a consistent user experience across devices.'
  ],
  tags: [
    'React.js',
    'JavaScript',
    'HTML5',
    'CSS3',
    'API Integration'
  ]
},
]

export const educationData: EducationEntry[] = [
  {
    id: 'edu1',
    level: 'B.Tech, Computer Science & Engineering',
    institution: 'Indian Institute of Information Technology, Kota',
    location: 'Kota, Rajasthan',
    period: '2023 - 2027',
    result: 'CGPA: 7.18',
    side: 'right'
  },
  {
    id: 'edu2',
    level: 'Class XII',
    institution: 'Central Hindu School',
    location: 'Gorakhpur, Uttar Pradesh',
    period: 'Completed 2022',
    result: '90 %',
    side: 'left'
  },
  {
    id: 'edu3',
    level: 'Class X',
    institution: 'Central Hindu School',
    location: 'Gorakhpur, Uttar Pradesh',
    period: 'Completed 2020',
    result: '90.8 %',
    side: 'right'
  }
]

export const achievementsData: Achievement[] = [
  {
  id: 'ach3',
  title: '1st Runner-Up – DevQuest 2025',
  issuer: 'IIT Jodhpur',
  date: '2025',
  description: 'Secured 1st Runner-Up at DevQuest 2025, a national-level hackathon hosted by IIT Jodhpur, by developing an innovative software solution under strict time constraints.',
  category: 'Hackathon'
},
{
  id: 'ach4',
  title: 'Top 10 – Hack the Chain 2.0',
  issuer: 'IIIT Kota TechSummit',
  date: '2024',
  description: 'Ranked among the Top 10 teams at Hack the Chain 2.0 for building a scalable and impactful blockchain-based software solution.',
  category: 'Hackathon'
},
  {
    id: 'ach4b',
    title: 'Smart India Hackathon Top Team',
    issuer: 'Smart India Hackathon (SIH)',
    date: '2024',
    description: 'Selected among the top teams in the institute-level screening of Smart India Hackathon (SIH).',
    category: 'Hackathon'
  },
  {
    id: 'ach5',
    title: 'CodeChef 3-Star Coder',
    issuer: 'CodeChef',
    date: 'Active',
    description: 'Achieved CodeChef 3-Star Rating (Peak Rating: 1456), demonstrating competitive programming proficiency.',
    category: 'Award'
  },
  {
    id: 'ach6',
    title: '350+ SQL Problems Solved',
    issuer: 'LeetCode / GeeksforGeeks',
    date: 'Active',
    description: 'Solved 300+ SQL problems across various platforms demonstrating strong database query and optimization abilities.',
    category: 'Award'
  }
]

export type Testimonial = {
  id: string
  name: string
  role: string
  quote: string
}

export const testimonialsData: Testimonial[] = [
  {
    id: 'test1',
    name: 'Rajesh Kumar',
    role: 'AI Engineer, Galaxy Automation AI',
    quote: 'I’ve seen Ankit consistently approach complex problems with a practical mindset. His expertise in full-stack development and AI, combined with his dedication to learning, makes him a dependable engineer and an excellent teammate.'
  },
  {
    id: 'test2',
    name: 'Yash Agrawal',
    role: 'AI Engineer, Scaler AI Labs',
    quote: 'Ankit has a strong foundation in AI and modern web technologies. His ability to build scalable solutions and quickly adapt to new challenges makes him stand out.'
  },
  {
    id: 'test3',
    name: 'Oregano',
    role: 'B.Tech CSE, IIIT Guwahati',
    quote: 'Ankit is someone who genuinely enjoys solving problems and learning new technologies. He’s easy to work with, contributes actively during discussions, and always looks for practical solutions instead of shortcuts.'
  },
  {
    id: 'test4',
    name: 'Kashish Bhutia',
    role: 'B.Tech CSE, IIIT Kota',
    quote: 'I’ve worked with Ankit on multiple occasions, and one thing that stands out is his consistency. Whether it’s building projects, participating in hackathons, or helping teammates, he always puts in the effort and delivers quality work.'
  },
  {
    id: 'test5',
    name: 'Amit Anand',
    role: 'Software Development Engineer, Amazon',
    quote: 'Ankit demonstrates strong problem-solving skills and a genuine curiosity for learning. His focus on clean implementation and continuous improvement will help him excel in software engineering.'
  },
  {
    id: 'test6',
    name: 'Raman Rai',
    role: 'RTO College, Kota',
    quote: 'Ankit is a disciplined and hardworking individual with excellent technical skills. His dedication toward projects and willingness to help others make him a valuable team member.'
  }
]

export const blogData: BlogPost[] = [
  {
    id: 'blog1',
    title: 'Building a High-Performance 3D Grid inside GLSL Fragment Shaders',
    slug: 'glsl-fragment-shader-grid',
    excerpt: 'Deep-dive into rendering infinitely scaling grid overlays on the GPU using ray-plane intersections and anti-aliasing math.',
    date: 'May 12, 2026',
    readTime: '6 min read',
    tags: ['Graphics', 'GLSL', 'Three.js'],
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    content: `## The Quest for High-Performance Grids

When designing modern interactive web platforms, developers frequently add grid lines. The traditional approach of inserting thousands of DOM tags creates massive CPU rendering bottlenecks. The modern, elegant way is to write a **fragment shader** in GLSL!

### Ray-Plane Intersections

To draw a 3D grid in a fragment shader, we cast a ray from the camera position through the screen pixel. We then find the exact intersection point with the grid plane ($y = 0$):

$$\\vec{r}(t) = \\vec{o} + t\\vec{d}$$

If we solve for $t$ where $y = 0$, we get the spatial grid coordinates:

\`\`\`glsl
// GLSL snippet representing intersection
float t = -ray_origin.y / ray_direction.y;
vec3 intersection_point = ray_origin + t * ray_direction;
\`\`\`

### Anti-Aliased Lines

If we check if the coordinate is near an integer boundary using a simple \`step()\` function, the lines will experience massive aliasing artifacts at a distance. To fix this, we calculate the screen-space derivatives:

\`\`\`glsl
vec2 grid_coord = intersection_point.xz;
vec2 der = fwidth(grid_coord);
vec2 grid_line = smoothstep(line_width - der, line_width + der, abs(fract(grid_coord - 0.5) - 0.5));
float line_opacity = 1.0 - min(grid_line.x, grid_line.y);
\`\`\`

This ensures that lines smoothly blend out as they approach sub-pixel widths at the horizon, delivering a pristine visual experience at 60 FPS.`
  },
  {
    id: 'blog2',
    title: 'Zustand vs Redux in React 19: The Paradigm Shift',
    slug: 'react-19-zustand-redux',
    excerpt: 'Analyze state stores in React 19 concurrent environments. How Zustand achieves clean render tracking with zero boilerplate.',
    date: 'Apr 25, 2026',
    readTime: '4 min read',
    tags: ['React', 'Zustand', 'State'],
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    content: `## The State of React State Management

React 19 brings concurrent renderings, transitions, and native async support. Traditional giants like Redux often require verbose boilerplate (actions, actions creators, slices, dispatchers) that overcomplicates developer flows.

### Enter Zustand

Zustand is a lightweight state management store built on hooks. It manages states outside the React tree, avoiding re-renders unless specified state properties change.

#### What makes it work in React 19?

- **useSyncExternalStore**: Zustand uses React's native subscription method under the hood, guaranteeing state integrity during concurrent renders.
- **Zero Boilerplate**: You define a store function directly and use it as a hook anywhere in your code.
- **Transient State Updates**: You can subscribe to state properties without causing a re-render using selector functions.

\`\`\`typescript
// Pure simplicity
const theme = usePortfolioStore((state) => state.theme);
\`\`\`

By simplifying state architectures, developers can focus on premium layouts and fluid interactive effects.`
  }
]
