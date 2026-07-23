export type KnowledgeEntry = {
  id: string
  title: string
  category: string
  content: string
}

export const portfolioKnowledgeBase: KnowledgeEntry[] = [
  {
    id: 'personal-information',
    title: 'Personal Information',
    category: 'Personal Information',
    content: `Name: Ankit Chaurasiya
College: Indian Institute of Information Technology, Kota (IIIT Kota)
Degree: Bachelor of Technology in Computer Science and Engineering
Location: India
Email: ankitiiitkota@gmail.com
LinkedIn: https://www.linkedin.com/in/ankitchaurasiya29/
GitHub: https://github.com/Ankit-iiitkota
Resume: Available as a downloadable PDF through the portfolio or via email request.`
  },
  {
    id: 'about-me',
    title: 'About Me',
    category: 'About Me',
    content: `Ankit is a problem-solving full-stack developer focused on premium product experiences, scalable engineering, and intelligent web interfaces. He blends software craftsmanship with modern design systems to create polished digital products for startups, growth teams, and engineering-led ventures.`
  },
  {
    id: 'skills-languages',
    title: 'Languages',
    category: 'Skills',
    content: `JavaScript, TypeScript, Python, HTML5, CSS3, SQL, Bash`
  },
  {
    id: 'skills-frameworks',
    title: 'Frameworks',
    category: 'Skills',
    content: `React, Vite, Tailwind CSS, Node.js, Express.js, Next.js, Framer Motion, Zustand, React Router, Three.js`
  },
  {
    id: 'skills-databases',
    title: 'Databases',
    category: 'Skills',
    content: `PostgreSQL, MongoDB, Firebase, Supabase, SQLite`
  },
  {
    id: 'skills-tools',
    title: 'Tools',
    category: 'Skills',
    content: `Git, GitHub, VS Code, Figma, Postman, Docker, Vite, ESLint, Prettier`
  },
  {
    id: 'skills-cloud-ai',
    title: 'Cloud & AI',
    category: 'Skills',
    content: `AWS, Google Cloud Platform, Firebase Hosting, OpenAI API, generative AI integrations, embeddings, prompt engineering`
  },
  {
    id: 'project-billbuddy',
    title: 'Project: BillBuddy',
    category: 'Projects',
    content: `BillBuddy is a finance automation project designed to simplify expense tracking and billing workflows. It includes a polished UI, intelligent report summaries, and integrations that help users stay organized with real-time transaction insights.`
  },
  {
    id: 'project-portfolio',
    title: 'Project: Portfolio',
    category: 'Projects',
    content: `This portfolio is a premium full-stack web project built using React, TypeScript, Vite, Tailwind CSS, and animated interactions. It highlights immersive components, glassmorphism, and AI-powered exploration features.`
  },
  {
    id: 'project-other',
    title: 'Other Projects',
    category: 'Projects',
    content: `Other work includes developer tooling, dashboard experiences, open source contributions, and engineering-focused lab projects created to solve real developer problems.`
  },
  {
    id: 'experience',
    title: 'Experience',
    category: 'Experience',
    content: `Ankit has experience building full-stack applications, portfolio experiences, and engineering dashboards for product-focused teams. He designs and ships user interfaces with strong attention to detail, accessibility, and performance.`
  },
  {
    id: 'achievements',
    title: 'Achievements',
    category: 'Achievements',
    content: `Recognized for building premium portfolios, technical dashboards, and AI-enhanced web applications. Ankit delivers refined UI experiences for engineering and product teams.`
  },
  {
    id: 'hackathons',
    title: 'Hackathons',
    category: 'Hackathons',
    content: `Participated in competitive hackathons and innovation sprints focused on product development, AI integrations, and rapid prototyping.`
  },
  {
    id: 'certificates',
    title: 'Certificates',
    category: 'Certificates',
    content: `Holds relevant certificates in web development, cloud fundamentals, and software engineering best practices.`
  },
  {
    id: 'open-source',
    title: 'Open Source',
    category: 'Open Source',
    content: `Contributed to GitHub repositories, published developer resources, and maintains open source utilities that support modern web workflows.`
  },
  {
    id: 'education',
    title: 'Education',
    category: 'Education',
    content: `Bachelor of Technology in Computer Science and Engineering from IIIT Kota.`
  },
  {
    id: 'contact-information',
    title: 'Contact Information',
    category: 'Contact Information',
    content: `Contact via email: ankitiiitkota@gmail.com. LinkedIn: https://www.linkedin.com/in/ankitchaurasiya29/. GitHub: https://github.com/Ankit-iiitkota.`
  }
]

export const suggestedQuestions = [
  'Tell me about yourself',
  'Show your projects',
  'What technologies do you kow?',
  'How can I contact you?',
  'Show your resume',
  'What are your achievements?'
]
