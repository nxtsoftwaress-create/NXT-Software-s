# NXT Softwares

Premium marketing site for **NXT Softwares** — a software development studio that engineers web and mobile products, from MVPs to production platforms.

**Live site sections:** Hero → Services → Philosophy → Solutions → Industries → Work → Process → Technology → About → Why NXT → FAQ → Engagement → Consultation → Contact.

---

## ✨ Features

- **Theme-aware UI** — full dark/light mode with a persistent toggle (`src/lib/theme.ts`)
- **Animated hero** — flowing-paths SVG background with scroll parallax and a metallic shimmer headline (`src/components/ui/nxt-hero.tsx`)
- **Framer-motion throughout** — scroll reveals, section transitions, and animated dashboard mocks in the Work section
- **FAQ accordion** — built on Radix UI primitives (`src/components/ui/faqs-01.tsx`)
- **Contact integration** — email (`nxtsoftwaress@gmail.com`), WhatsApp deep links, and Web3Forms submission
- **Welcome popup & cookie consent** — dismissible, theme-aware onboarding UI
- **Legacy static site** preserved under `legacy/` for reference

## 🛠 Tech Stack

| Category      | Tools                                                          |
| ------------- | -------------------------------------------------------------- |
| Framework     | React 18 + TypeScript                                          |
| Build tool    | Vite 5                                                         |
| Styling       | Tailwind CSS 3, PostCSS, Autoprefixer                          |
| Animation     | framer-motion, GSAP                                            |
| UI primitives | Radix UI (Accordion, Slot, Separator), lucide-react icons      |
| Data viz      | D3, topojson-client (contact globe)                            |
| Utilities     | clsx, tailwind-merge, class-variance-authority, react-use-measure |

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18 or newer
- npm (comes with Node)

### Install

```bash
npm install
```

### Develop

Starts the dev server on [http://localhost:5173](http://localhost:5173):

```bash
npm run dev
```

### Build

Type-checks with `tsc -b` and outputs a production bundle to `dist/`:

```bash
npm run build
```

### Preview

Serves the production build locally:

```bash
npm run preview
```

## 📁 Project Structure

```
├── index.html                  # App entry
├── vite.config.ts              # Vite config
├── tailwind.config.js          # Tailwind theme + keyframes
├── src/
│   ├── main.tsx                # React root
│   ├── App.tsx                 # Section composition
│   ├── index.css               # Tailwind layers + custom CSS (mock theme scope, shimmer)
│   ├── lib/                    # site config (links, email), theme, utils, tech logos
│   ├── sections/               # One file per page section (services, work, faq …)
│   ├── components/ui/          # Hero, mocks, FAQ, contact, shared UI
│   └── components/welcome/     # Welcome popup
└── legacy/                     # Original static site (kept for reference)
```

## 📬 Contact

- **Email:** [nxtsoftwaress@gmail.com](mailto:nxtsoftwaress@gmail.com)
- **Website:** NXT Softwares — *We engineer what's next.*
