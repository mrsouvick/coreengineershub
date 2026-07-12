# Product Requirements Document (PRD)
## Project: Core Engineers Hub — Website

---

## 1. Overview

**Product Name:** Core Engineers Hub

**Purpose:** A free educational resource platform built as a companion to the YouTube channel "Core Engineers Hub." It serves engineering students under MAKAUT (Maulana Abul Kalam Azad University of Technology) with free notes, guidance, suggestions, courses, and study material — all organized in one clean, easy-to-navigate website.

**Target Audience:** Engineering students enrolled under MAKAUT (all branches, all semesters), looking for structured notes, exam suggestions, career guidance, and free video-based courses.

**Design Direction:** Light-themed, modern, professional, clean — should NOT look like a generic AI-generated template. Needs custom visual identity, good typography, thoughtful spacing, and a polished feel similar to a well-funded edtech startup (think: Notion, Coursera-lite, or a clean university portal).

**Deliverable:** A fully functional full-stack web application, deployable (Vercel/Netlify/Render friendly), with working buttons, pages, forms, admin capability, and content management — not just a static mockup.

---

## 2. Goals & Success Criteria

- Students can find semester-wise and subject-wise notes/resources within 2-3 clicks.
- Admin (channel owner) can upload/manage content without touching code.
- Site should feel human-made, warm, and trustworthy — not like a generic AI template.
- Fully responsive (mobile-first, since most students will browse on phones).
- Fast load times, clean navigation, SEO-friendly (so students find it via Google too).

---

## 3. Tech Stack (Recommended for Full-Stack Deployability)

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS
- **Backend:** Next.js API routes / Server Actions (or a separate Node.js + Express backend if preferred)
- **Database:** PostgreSQL (via Supabase or Neon) — stores users, resources, courses, notes metadata
- **File/Media Storage:** Supabase Storage or Cloudinary (for PDFs, notes, thumbnails)
- **Auth:** NextAuth.js / Clerk / Supabase Auth — supports Student login (optional) + Admin login (required, protected)
- **Video Embeds:** YouTube iframe embeds (pull from channel via YouTube Data API v3, or manually linked)
- **Deployment:** Vercel (frontend + serverless functions), Supabase/Neon (DB) — free-tier friendly
- **Search:** Simple full-text search on notes/resources (title, subject, semester, branch tags)

> Note to the coding assistant: Please scaffold this as a complete, working full-stack app with seed/demo data so it is deployable immediately, not just UI shells.

---

## 4. Branding & Design Guidelines

- **Theme:** Light mode as primary (with optional dark mode toggle as a stretch goal).
- **Color Palette (suggested):**
  - Primary: Deep Blue (#1E3A8A) or Teal (#0F766E) — conveys trust, education, engineering
  - Accent: Warm Amber/Orange (#F59E0B) — for CTAs, highlights, buttons
  - Background: Off-white / soft gray (#F9FAFB, #FFFFFF)
  - Text: Charcoal (#1F2937) instead of pure black for softer readability
- **Typography:** A clean modern sans-serif pairing — e.g., "Inter" or "Poppins" for headings, "Inter" or "Source Sans Pro" for body text. Avoid default system fonts to prevent generic look.
- **Visual Style:**
  - Rounded cards with soft shadows (avoid harsh borders)
  - Generous white space, no clutter
  - Custom icons (Lucide/Heroicons) instead of emoji
  - Subtle micro-animations on hover/scroll (Framer Motion) for a premium feel
  - Real engineering-themed illustrations/graphics (circuits, gears, blueprints subtly used) rather than generic stock photos
- **Logo/Branding:** Placeholder logo area for "Core Engineers Hub" — text logo with an engineering icon (gear/circuit motif), using primary color.

---

## 5. Site Structure / Pages

### 5.1 Home Page
- Hero section: Channel intro, tagline (e.g., "Free Guidance for MAKAUT Engineers"), CTA buttons ("Browse Notes", "Watch Free Courses", "Subscribe on YouTube")
- Stats bar: Number of students helped, notes uploaded, subscribers, branches covered
- Featured resources / latest uploads (auto-pulled, card layout)
- Branch selector (CSE, ECE, ME, CE, EE, IT, etc.) — quick navigation
- Testimonials/student reviews carousel
- Latest YouTube videos embedded (auto-fetched from channel)
- Footer with social links, quick links, contact

### 5.2 Notes & Resources Page
- Filter/search by: Branch, Semester, Subject, Type (Notes/PYQ/Suggestions/Syllabus)
- Grid/list view toggle
- Each resource card: title, subject, semester tag, file type icon, download button, view count
- Resource detail page: preview (PDF viewer embedded), download button, related resources, share button

### 5.3 Free Courses Page
- Course cards (thumbnail, title, description, duration, playlist link)
- Each course links to a course detail page with embedded YouTube playlist, syllabus/topics covered, downloadable companion notes if any

### 5.4 Guidance / Blog Page
- Articles/posts: career guidance, exam tips, semester roadmaps, how-to-study guides
- Simple blog-style layout with categories and tags
- Individual post pages (rich text, images, embedded videos)

### 5.5 About Page
- Story of Core Engineers Hub channel, mission, founder info
- Why this platform exists, MAKAUT focus explanation
- Photo/branding section

### 5.6 Contact / Community Page
- Contact form (name, email, message → stored in DB + optional email notification)
- Social links: YouTube, Instagram, Telegram/WhatsApp community, Discord (whichever applicable)
- FAQ section

### 5.7 Student Login (Optional but recommended)
- Sign up / Login (email or Google OAuth)
- Dashboard: saved/bookmarked resources, download history
- Not mandatory for browsing — most content should be accessible without login to reduce friction

### 5.8 Admin Dashboard (Protected Route)
- Login for admin (channel owner) only
- CRUD operations:
  - Upload/edit/delete Notes & Resources (with file upload, tag by branch/semester/subject)
  - Add/edit/delete Courses (YouTube playlist link, description)
  - Write/edit/delete Blog/Guidance posts
  - View contact form submissions
  - View basic analytics (page views, downloads, popular resources)

---

## 6. Core Features Checklist

- [ ] Fully responsive design (mobile, tablet, desktop)
- [ ] Working navigation with no dead links/buttons
- [ ] Functional search & filter system across resources
- [ ] File upload + download system for notes/PDFs
- [ ] YouTube video/playlist embedding
- [ ] Admin panel with authentication, protected routes
- [ ] Contact form with backend storage
- [ ] SEO basics: meta tags, sitemap, Open Graph tags for social sharing
- [ ] Fast page loads (image optimization, lazy loading)
- [ ] 404 page and error handling
- [ ] Newsletter/email signup (optional, for updates)
- [ ] Bookmark/save resource feature (if login enabled)

---

## 7. Non-Functional Requirements

- **Performance:** Lighthouse score 85+ on mobile
- **Accessibility:** Proper alt text, keyboard navigation, sufficient color contrast
- **Security:** Admin routes protected, file upload validation (only PDFs/docs allowed, size limits)
- **Scalability:** Should handle growth as more branches/semesters/resources are added without redesign
- **Maintainability:** Clean component structure so channel owner (or a future dev) can add content types easily

---

## 8. Sample Data (For Initial Seeding)

Please seed the database with realistic placeholder data so the deployed site doesn't look empty:
- 3 branches (CSE, ECE, ME) × 2 semesters each with 4-5 sample notes/resources
- 3 sample free courses with YouTube playlist placeholders
- 3 sample guidance/blog posts
- 1 admin account (demo credentials)

---

## 9. Out of Scope (For V1)

- Paid courses / payment gateway integration
- Live class scheduling
- Mobile app (web-first, responsive only)
- Multi-language support (English only for V1)

---

## 10. Instructions for the AI Coding Assistant

Build this as a complete, working, deployable full-stack web application based on the structure above. Prioritize:
1. A distinctive, non-generic light-themed visual design (not default Tailwind/shadcn look — customize colors, spacing, typography, and add subtle animations).
2. Fully working buttons, forms, and navigation — no placeholder "Coming Soon" links.
3. Functional admin CRUD for managing notes, courses, and blog content, connected to a real database.
4. Clean, realistic seed data so the site looks populated and professional immediately after deployment.
5. Mobile-first responsive layouts throughout.

