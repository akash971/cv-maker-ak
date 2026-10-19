# 📄 CV Maker Pro - Dual Style CV Builder

A full-stack, customizable, and intuitive web application to build and export professional Curriculum Vitae (CV) & Resumes in two distinct formats:
1. **🇧🇩 Bangladeshi Official Style** — Faithful reproduction of the authentic Bangladeshi CV format with shaded grey headings, colon-aligned bio-data & education credentials, language proficiency table, framed referee boxes, formal declaration, and candidate signature line.
2. **🌍 International Style** — Modern, ATS-compliant international resume featuring executive role badges, categorized skill pills, achievement bullets, project highlights, and custom accent themes.

---

## 🌟 Key Features

### 1. Zero Restrictions — Complete Customization
- **Reorder Any Section**: Move sections up or down with one click.
- **Rename Anything**: Rename section titles, degree labels, or table headers freely.
- **Add Any Section**:
  - 📝 Paragraph Text (Career Objective, Executive Summary, About Me)
  - 🔢 Numbered / Bullet List (Key Strengths, Interests, Computer Knowledge, Duties)
  - 🎓 Education Qualification (Examinations, Boards, Sessions, Institutions, GPA)
  - 💼 Work Experience (Role, Company, Location, Dates, Achievement bullets)
  - 📋 Personal Bio-Data Colon Grid (Custom fields: Religion, Passport No, NID, etc.)
  - 📊 Custom Table / Grid (Language ratings, exam scores, custom columns)
  - 🗃️ Reference Boxes (Framed referee cards with name, designation, phone)
  - 🏷️ Skill Badges (Categorized technology and tool tags)
  - ✍️ Declaration & Signature (Honesty pledge + date line)
- **Delete / Hide Sections**: Temporarily hide or permanently delete any section.
- **Design & Typography**:
  - Fonts: Times New Roman (Classic BD), Inter, Roboto, Arial, Georgia, Garamond.
  - Heading Bar Styles: Shaded Grey Bar (Exact photo match), Modern Left Bar, Underline, Rounded Pill, Minimal.
  - Custom Color Palette: Charcoal, Navy Blue, BD Green, Crimson, Purple, or any custom Hex code.
  - Text density and page margin controls.
- **Photo Customization**:
  - Direct Base64 conversion via `FileReader` — zero server uploads or disk storage needed.
  - Automatically scales/compresses device photos to optimize `localStorage` and ensure crystal-clear 300DPI print.
  - Toggle Photo ON/OFF.
  - Shape: Passport rectangle (35×45mm), Square, or Circle.
  - Positioning: Top Right, Top Left, Centered.

### 2. Class 5 Child-Friendly UI / UX
- **Live Split-Screen**: Instant real-time preview on standard A4 paper simulation as you type.
- **One-Click Magic Demo Fill**:
  - `[🇧🇩 Load BD Demo]` — Pre-fills the exact details from the sample photo (Md. Emran Hossen Biplob, Rangpur Polytechnic Institute, etc.).
  - `[🌍 Load Intl Demo]` — Pre-fills a modern software engineer resume.
- **Interactive Beginner Guide**: Step-by-step tutorial modal explaining the app in simple language.
- **Auto-Save & Storage**: Changes are automatically saved to browser `localStorage` on every keystroke. Saved versions library stores full CV records locally and offline.

### 3. Stateless Backend & Seamless Free Hosting Deployment
- **100% Stateless Architecture**:
  - No file-system reads or writes (`fs`) in API operations.
  - In-memory template presets & runtime cache.
  - Dynamic CORS: Configure `CLIENT_URL` (e.g. `https://my-cv-app.vercel.app`) to support separate frontend/backend deployments.
  - Fully compatible with stateless hosts (Render, Railway, Vercel, Netlify, Fly.io).
- **Exporting Options**:
  - 🖨️ **Print / Save as PDF** — High-fidelity browser vector print to PDF with print-optimized CSS.
  - 💾 **Export JSON** — Download complete CV data file.
  - 📤 **Import JSON** — Restore any previously exported CV.

---

## 🚀 How to Run & Deploy

### Environment Variables
| Variable | Description | Default |
|---|---|---|
| `PORT` | Backend port | `5000` |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS (comma-separated or `*`) | `*` (all origins) |

### Step 1: Start Backend
```bash
npm start
```
Runs at: **`http://localhost:5000`**

### Step 2: Run Frontend Development Server
```bash
npm run client
```
Runs Vite hot-module reloading at: **`http://localhost:5173`**

---

## 📁 Project Structure

```
CV maker/
├── package.json               # Root scripts and server dependencies
├── server/
│   ├── index.js               # Stateless Express REST API & static server
│   ├── templates.js           # Built-in Bangladeshi & International presets
├── client/
│   ├── vite.config.js         # Vite configuration with Tailwind & API proxy
│   ├── index.html             # Entry HTML with Google Fonts
│   ├── src/
│   │   ├── App.jsx            # Main app coordinating state & split view
│   │   ├── main.jsx           # React root
│   │   ├── index.css          # Print CSS & Tailwind v4 styles
│   │   ├── data/
│   │   │   └── defaultTemplates.js # Exact BD photo data & Intl demo data
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Top bar with switcher & print button
│   │   │   ├── Class5GuideModal.jsx # Beginner-friendly tutorial modal
│   │   │   ├── SavedCvsModal.jsx    # Server save/load/delete modal
│   │   │   ├── Editor/
│   │   │   │   ├── EditorPanel.jsx
│   │   │   │   ├── PersonalInfoEditor.jsx
│   │   │   │   ├── SectionsManager.jsx
│   │   │   │   ├── StyleCustomizer.jsx
│   │   │   │   ├── TextSectionEditor.jsx
│   │   │   │   ├── BulletListEditor.jsx
│   │   │   │   ├── EducationListEditor.jsx
│   │   │   │   ├── PersonalInfoGridEditor.jsx
│   │   │   │   ├── TableSectionEditor.jsx
│   │   │   │   ├── ReferenceBoxesEditor.jsx
│   │   │   │   ├── ExperienceCardsEditor.jsx
│   │   │   │   ├── SkillBadgesEditor.jsx
│   │   │   │   ├── DeclarationEditor.jsx
│   │   │   │   └── AddSectionModal.jsx
│   │   │   └── Preview/
│   │   │       ├── PreviewPanel.jsx
│   │   │       ├── BangladeshiTemplate.jsx
│   │   │       └── InternationalTemplate.jsx
```
