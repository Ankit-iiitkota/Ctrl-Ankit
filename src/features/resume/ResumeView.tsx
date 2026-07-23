import React from 'react'
import { Download, Printer } from 'lucide-react'

export const ResumeView: React.FC = () => {
  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = '/Resume_Ankit_Chaurasiya.pdf'
    link.download = 'Ankit_Chaurasiya_Resume.pdf'
    link.click()
  }

  return (
    <section
      id="resume"
      className="relative w-full py-24 px-6 border-b border-white/5 bg-[var(--bg-primary)] print:bg-white print:text-black print:py-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-12 print:hidden">
          <div className="text-left">
            <span className="text-[10px] font-bold font-display uppercase tracking-widest text-accent-400">
              10 &bull; Credentials
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-100 font-display mt-2">
              Curriculum Vitae
            </h2>
            <div className="h-0.5 w-12 bg-accent-500 mt-4 rounded-full" />
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Print Resume"
              data-cursor="PRINT"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent-600 to-accent-400 hover:from-accent-500 hover:to-accent-300 shadow-md shadow-accent-600/10 cursor-pointer"
              data-cursor="SAVE"
            >
              <Download size={14} /> PDF Copy
            </button>
          </div>
        </div>

        {/* Paper CV Body (Structured for perfect print styling layout) */}
        <div className="bg-slate-950/20 glassmorphism rounded-3xl border border-white/5 p-8 md:p-12 text-left print:border-none print:bg-white print:p-0 print:text-black shadow-2xl flex flex-col">
          
          <div className="flex flex-col gap-8 max-h-[500px] overflow-y-auto pr-4 print:max-h-none print:overflow-visible print:pr-0">
          
          {/* Header Identity */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 print:border-black/10 pb-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold font-display tracking-tight text-slate-100 print:text-black">
                Ankit Chaurasiya
              </h1>
              <p className="text-xs text-accent-400 print:text-purple-700 font-semibold mt-1">
                Computer Science Student | Full Stack Developer & Data Scientist
              </p>
            </div>

            <div className="text-[11px] text-slate-400 print:text-slate-600 flex flex-col gap-1 font-matrix">
              <span>Phone: +91-7719538411</span>
              <span>Email: ankitiiitkota@gmail.com</span>
              <div className="flex gap-2.5">
                <a href="https://linkedin.com/in/ankit-chaurasiya" target="_blank" rel="noreferrer" className="hover:text-accent-400 print:text-black">LinkedIn</a>
                <span>&bull;</span>
                <a href="https://github.com/ankitchaurasiya" target="_blank" rel="noreferrer" className="hover:text-accent-400 print:text-black">GitHub</a>
              </div>
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-3">
              Education
            </h3>
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 print:text-slate-950">
                  Indian Institute of Information Technology Kota
                </h4>
                <p className="text-xs text-slate-400 print:text-slate-600 italic mt-0.5">
                  Bachelor of Technology in Computer Science and Engineering (CGPA: 7.18)
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[11px] text-slate-400 print:text-slate-600 font-matrix">Kota, India</span>
                <div className="text-[10px] text-accent-500 print:text-purple-700 font-bold font-matrix mt-0.5">2023 - 2027</div>
              </div>
            </div>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-3">
              Experience
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-200 print:text-slate-950">
                    Unifindss
                  </h4>
                  <p className="text-xs text-slate-400 print:text-slate-600 italic mt-0.5">
                    Product Management Intern
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 print:text-slate-600 font-matrix">Remote</span>
                  <div className="text-[10px] text-accent-500 print:text-purple-700 font-bold font-matrix mt-0.5">Nov 2025 - Jan 2026</div>
                </div>
              </div>
              <ul className="list-disc list-inside text-xs text-slate-400 print:text-slate-600 leading-relaxed flex flex-col gap-1 pl-1">
                <li>Led product initiatives for a campus ecosystem serving <strong>2,000+ students</strong>, collaborating with engineering and design teams on feature development.</li>
                <li>Built <strong>12+ reusable React components</strong> and standardized UI workflows, improving scalability and maintainability.</li>
                <li>Analyzed <strong>50+ user requests</strong> and coordinated testing across <strong>8+ release cycles</strong>, enhancing product quality and navigation.</li>
              </ul>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-4">
              Projects
            </h3>
            <div className="flex flex-col gap-5">
              {[
                {
                  title: 'BillBuddy',
                  tech: 'Next.js 15, React 19, Tailwind CSS v4, Convex, Clerk, Gemini AI, Recharts',
                  bullets: [
                    'Built a real-time expense-splitting platform with instant group balance sync powered by Convex.',
                    'Integrated Gemini AI for spending pattern insights and automated settlement reminders.',
                    'Implemented Clerk authentication and Recharts analytics dashboards across group finances.'
                  ]
                },
                {
                  title: 'AyurVision',
                  tech: 'React.js, Tailwind CSS, Node.js, Express, MongoDB, TensorFlow.js, OpenAI API',
                  bullets: [
                    'Built an AI health analysis platform bridging computer vision with Ayurvedic diagnosis principles.',
                    'Engineered a TensorFlow.js + OpenAI API image analysis pipeline returning condition, causes, and remedies.',
                    'Designed a specialist dashboard for reviewing patient reports alongside AI-generated insights.'
                  ]
                },
                {
                  title: 'LinkedIn Auto Job Applier',
                  tech: 'Python, Selenium, Flask, Groq, Gemini, LaTeX (Tectonic)',
                  bullets: [
                    'Automated LinkedIn Easy Apply job applications using Selenium with stealth, human-like behavior.',
                    'Built an AI resume-tailoring pipeline rewording bullets to job-description keywords without fabrication.',
                    'Developed a local Flask dashboard tracking full application history and status.'
                  ]
                },
                {
                  title: 'AI Job Finder',
                  tech: 'Next.js 16, TypeScript, Prisma, PostgreSQL, n8n, Groq LLM',
                  bullets: [
                    'Built an end-to-end job discovery engine parsing resumes and scanning free job APIs every 2 hours.',
                    'Designed a webhook-driven Next.js + n8n architecture with Postgres as the single source of truth.',
                    'Engineered a confidence-scored recruiter email discovery pipeline and automated AI outreach with follow-ups.'
                  ]
                },
                {
                  title: 'VERA AI',
                  tech: 'Python, FastAPI, REST APIs, Rule Engine, Docker',
                  bullets: [
                    'Developed a deterministic AI message engine generating context-sensitive merchant engagement messages.',
                    'Designed a 7-stage workflow (Feature Extraction, Signal Detection, Goal Inference, Candidate Ranking, Rule Engine).',
                    'Improved response quality via rule-based ranking and a 5-dimensional evaluation framework.'
                  ]
                },
                {
                  title: 'PixelSpark',
                  tech: 'React 18, Vite, Node.js, Express.js, MongoDB, OpenAI API (DALL-E), Cloudinary',
                  bullets: [
                    'Built a full-stack MERN app generating AI images via DALL-E with a community showcase gallery.',
                    'Integrated Cloudinary image storage with MongoDB metadata for a searchable community feed.',
                    'Implemented prompt/creator search and a randomized "Surprise Me" prompt generator.'
                  ]
                }
              ].map((proj) => (
                <div key={proj.title} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="text-xs font-bold text-slate-200 print:text-slate-900">{proj.title}</h4>
                    <span className="text-[10px] text-accent-400 print:text-purple-600 font-matrix font-medium">{proj.tech}</span>
                  </div>
                  <ul className="list-disc list-inside text-3xs text-slate-400 print:text-slate-650 leading-relaxed flex flex-col gap-0.5 pl-1">
                    {proj.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-3">
              Technical Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-xs">
              {[
                { label: 'Languages', val: 'C/C++, JavaScript, Python, Java, SQL, GraphQL, HTML/CSS' },
                { label: 'Frameworks', val: 'React.js, Express, Node.js, TensorFlow, Pandas, NumPy, Tailwind CSS, Bootstrap' },
                { label: 'Tools', val: 'MongoDB, PostgreSQL, MySQL, Git/GitHub, Docker, Postman, PowerBI, VS Code' },
                { label: 'Design/AI', val: 'Adobe Photoshop, Figma, Canva, Prompt Engineering (ChatGPT, Midjourney), Google Stitch, Claude, Agentic AI' },
                { label: 'Coursework', val: 'Data Structures, Algorithms, Operating Systems, OOPs, DBMS, Software Engineering, System Design' }
              ].map((skill) => (
                <div key={skill.label} className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">{skill.label}</span>
                  <span className="text-3xs text-slate-250 print:text-slate-800">{skill.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-3">
              Achievements
            </h3>
            <ul className="list-disc list-inside text-3xs text-slate-400 print:text-slate-655 leading-relaxed flex flex-col gap-1 pl-1">
              <li>Winner - Hacksprint National Hackathon.</li>
              <li>Achieved CodeChef -Star Rating (Max Rating: 1456).</li>
              <li>Solved 300+ DSA problems across coding platforms.</li>
              <li>Semifinalist - Sparkthon Walmart Hackathon.</li>
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-3">
              Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Data Analytics Job Simulation',
                  issuer: 'Quantium',
                  desc: 'Executed end-to-end data preparation and customer analytics to drive actionable business insights. Developed data-driven strategies using Python to optimize retail performance.'
                },
                {
                  title: 'Data Analytics Job Simulation',
                  issuer: 'Deloitte Australia',
                  desc: 'Applied forensic technology and data analysis to solve complex real-world business challenges. Synthesized large datasets to identify patterns.'
                },
                {
                  title: 'Project Manager Job Simulation',
                  issuer: 'Siemens Mobility',
                  desc: 'Focused on KPI development and dashboarding to streamline progress tracking and resource management.'
                }
              ].map((cert, idx) => (
                <div key={idx} className="flex flex-col gap-1 bg-slate-950/20 dark:bg-slate-950/40 print:bg-slate-100 p-4 rounded-xl border border-white/5 print:border-black/10">
                  <h4 className="text-[11px] font-bold text-slate-200 print:text-slate-900 leading-snug">{cert.title}</h4>
                  <span className="text-[9px] text-accent-400 print:text-purple-700 font-semibold font-matrix uppercase tracking-wider">{cert.issuer}</span>
                  <p className="text-[10px] text-slate-400 print:text-slate-600 mt-1 leading-relaxed">{cert.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Positions of Responsibility */}
          <div>
            <h3 className="text-xs font-bold font-display uppercase tracking-widest text-accent-400 print:text-purple-700 border-b border-white/5 print:border-black/10 pb-2 mb-3">
              Positions of Responsibility
            </h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Student Placement Coordinator',
                  dept: 'Tnp Cell — IIIT Kota',
                  date: 'May 2026 – Present',
                  bullets: [
                    'Coordinating company outreach, recruiter engagement, and internship opportunities for the 2027 batch.'
                  ]
                },
                {
                  title: 'Club Coordinator',
                  dept: 'Neon Cinematics — IIIT Kota',
                  date: 'Apr 2025 – April 2026',
                  bullets: [
                    'Leading creative workshops for 400+ students to improve technical filmmaking and engagement.'
                  ]
                },
                {
                  title: 'Junior IT Executive',
                  dept: 'TechKnow Society — IIIT Kota',
                  date: 'Sept 2023 – Aug 2024',
                  bullets: [
                    'Managed technical operations for a Tech Summit with over 800 attendees, overseeing digital promotions.'
                  ]
                },
                {
                  title: 'Class Representative',
                  dept: 'IIIT Kota',
                  date: 'Aug 2024 – Present',
                  bullets: [
                    'Liaised between 250+ students and department faculty to streamline academic coordination, resolve administrative queries, and foster peer collaboration.'
                  ]
                }
              ].map((pos, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 print:text-slate-900">{pos.title}</h4>
                    <p className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">{pos.dept}</p>
                    <ul className="list-disc list-inside text-3xs text-slate-400 print:text-slate-655 mt-1 pl-1">
                      {pos.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                    </ul>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-accent-500 print:text-purple-700 font-bold font-matrix">{pos.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          </div>
        </div>
      </div>
    </section>
  )
}
export default ResumeView
