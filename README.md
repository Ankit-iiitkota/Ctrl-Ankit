# 🌌 Ctrl+Ankit — Developer Portfolio OS

A professional, high-end developer portfolio designed as an interactive desktop environment. Built with an editorial aesthetic, dynamic micro-interactions, hardware-accelerated animations, and responsive theme adaptation.

---

## 🎨 Design Philosophy & Aesthetics
* **Midnight Glass vs. Warm Editorial Matte Linen**: Seamlessly adapts between a deep midnight charcoal theme and a low-glare, warm concrete paper theme using a vector-morphing celestial toggle.
* **Futuristic Custom Cursor**: A custom GSAP-engineered pointer reticle that calculates motion velocity, applies physics-based tilt rotation, and manages a lagging double-layered ghost trail.
* **Fluid Hero Background**: A dynamic, GPU-friendly fluid backdrop reacting to cursor movement in the hero section.
* **Splash Screen**: A branded entry animation that greets visitors before revealing the main interface.

---

## 🛠️ The Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | **React 19** | Dynamic view declarations, custom context state pipelines, and ref-based DOM bindings. |
| **Language** | **TypeScript** | Strict compile-time typing, interface contracts, and module safety. |
| **Build Engine** | **Vite** | Lightning-fast HMR server, bundle chunk optimization, and asset compilation. |
| **Styling** | **Tailwind CSS** | Editorial layouts, utility overrides, and adaptive variables mapping. |
| **Physics / Scroll** | **Lenis Scroll** | Inertial momentum-based scrolling physics for buttery-smooth page glides. |
| **State Management** | **Zustand** | Central store for cursor, theme, navigation, and visitor telemetry. |
| **Animations** | **Framer Motion & GSAP** | Staggered springs, entrance overlays, and SVG morphing celestial vectors. |
| **3D / Visuals** | **Three.js (react-three-fiber/drei)** | Hardware-accelerated 3D and shader-driven visual effects. |
| **Forms & Email** | **React Hook Form, Zod, EmailJS** | Validated contact form submissions delivered via EmailJS. |
| **Analytics** | **Google Analytics (GA4)** | Traffic and visitor engagement tracking. |

---

## 🚀 Key Architectural Features

### ⚡ Performance Optimization
* **Ref-Based Cursor Acceleration**: Cursor coordinate tracking writes directly to React refs, triggering raw CSS transform writes via `requestAnimationFrame`. This bypasses React re-renders completely on mouse movement.
* **Viewport-Aware Animation Throttling**: Scroll- and view-driven animations pause when off-screen to keep CPU/GPU usage low.

### 📋 Interactive Portfolio Modules
1. **Interactive Navigation Dock**: Retro-futuristic dark glass dock loading and jumping to page sections.
2. **About Me Registry**: Clean grid layout highlighting educational milestones and tech parameters.
3. **Experience & Education Timelines**: Constellation-styled backgrounds detailing company profiles, technical metrics, achievements, and academic history.
4. **Galaxy Orbit Skill Deck**: Interactive orbital skill visualization showing proficiency across tech categories.
5. **Milestone Achievements**: Spotlight cards categorizing hackathon wins, competitive coding profiles, and accolades.
6. **Featured Projects**: Custom slider displaying horizontal cards and deep-linking into detailed project pages.
7. **Leadership & Credentials**: Side-by-side dual columns displaying positions of responsibility and professional certification badges.
8. **AI Portfolio Chatbot**: An in-page assistant that answers visitor questions about Ankit's skills, projects, experience, achievements, and contact details.
9. **Print-Optimized CV Sheet**: A scroll-wrapped container for screen efficiency that dynamically expands to a clean, formatted single-page resume sheet under print commands (`Ctrl + P` / Save PDF).
10. **Contact Form**: Validated contact form with EmailJS-powered delivery.

---

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ankit-iiitkota/Ctrl-Ankit.git
   cd Ctrl-Ankit
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Build for production compilation**:
   ```bash
   npm run build
   ```

5. **Preview production bundle locally**:
   ```bash
   npm run preview
   ```

---

## 📄 License & Compliance
Designed and compiled by **Ankit Chaurasiya**.
All rights reserved © 2026.
