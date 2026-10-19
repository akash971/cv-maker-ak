# 📝 Commit Summary: Stateless Architecture & Free Hosting Refactor

**Repository:** [akash971/cv-maker-ak](https://github.com/akash971/cv-maker-ak.git)  
**Date:** October 19, 2026  
**Type:** Architectural Refactor (`refactor`)

---

## 🎯 Objectives Achieved
Refactored the full-stack CV/Resume builder to eliminate all local server file-system (`fs`) and disk storage dependencies (`server/data/`, `server/uploads/`, `multer`), enabling seamless deployment to stateless free-tier hosts (Render, Railway, Vercel, Netlify, Fly.io) without data loss or disk-write permission errors.

---

## 🛠️ Summary of Changes

### 1. Photo Uploads (Client-Side Base64 Engine)
- **Direct Base64 Conversion**: Updated the frontend photo upload handler in `PersonalInfoEditor.jsx` to process candidate passport photos directly into Base64 data URLs (`data:image/...`) using the browser's native `FileReader.readAsDataURL()`.
- **Canvas Scaling & Storage Quota Optimization**: Added an automatic off-screen canvas scaling algorithm (max dimension 800px at 0.9 JPEG quality) to prevent high-resolution smartphone photos (5MB–15MB) from exceeding browser `localStorage` limits, while maintaining sharp 300 DPI vector print quality.
- **Native Template Rendering**: The Base64 data URL string is stored directly in `cvData.design.photo.url`. Both `BangladeshiTemplate.jsx` and `InternationalTemplate.jsx` render this natively without requiring external HTTP photo requests or backend asset hosting.
- **Disk Route Elimination**:
  - Removed local `multer` disk storage and `/uploads` static route serving in `server/index.js`.
  - Removed `/uploads` proxy from `client/vite.config.js`.
  - Removed `multer` dependency from root `package.json`.

---

### 2. CV Data Persistence (Stateless & Offline-First)
- **Local Storage Version Library**: Refactored `SavedCvsModal.jsx` to store, load, and manage CV versions directly inside browser `localStorage` under `cv_saved_versions_library`.
- **Legacy Draft Migration**: Added automatic detection and migration of legacy single-draft storage keys (`cv_*`).
- **Portable JSON Backup & Restore**:
  - Added a dedicated one-click **"Download JSON"** export button for every individual saved version card in the modal.
  - Added an **"Import JSON to Library"** button allowing users to restore external backup files directly into their local version library.
- **Storage-Quota Resilient Auto-Save**: Updated auto-save in `App.jsx` to automatically prune older undo snapshots if storage limits are approached, preventing `QuotaExceededError`.
- **Removed Server File-System Operations**: Removed all `fs.readdirSync`, `fs.readFileSync`, `fs.writeFileSync`, and `fs.unlinkSync` operations on `server/data/`. Backend endpoints (`/api/cv/list`, `/api/cv/:id`, `/api/cv/save`, `/api/templates`) now run as a pure in-memory cache for the server runtime without touching disk.

---

### 3. Dynamic CORS & Deployment Configuration
- **Dynamic Origin Matching**: Configured Express `cors` middleware in `server/index.js` to dynamically parse `process.env.CLIENT_URL` (supporting comma-separated frontend URLs, single domain, or `*` wildcard), while preserving localhost dev origins in non-production environments.
- **Zero Disk Requirement**: Containers on free-tier platforms can sleep, spin down, or be restarted without crashing due to ephemeral or read-only file systems.

---

## 📁 Modified Files

| File | Change Description |
|---|---|
| `server/index.js` | Removed `multer`, `UPLOAD_DIR`, and `DATA_DIR` `fs` operations; added dynamic CORS and in-memory CV store |
| `package.json` | Removed unused `multer` dependency |
| `client/vite.config.js` | Removed `/uploads` proxy route |
| `client/src/components/Editor/PersonalInfoEditor.jsx` | Implemented Base64 `FileReader` conversion with automatic canvas optimization |
| `client/src/components/SavedCvsModal.jsx` | Converted to browser `localStorage` version management with JSON export/import |
| `client/src/App.jsx` | Enhanced auto-save resilience and undo history pruning for Base64 payloads |
| `README.md` | Updated architecture documentation, environment variable specs, and run guides |

---

## ✅ Verification & Validation
- **Frontend Build (`vite build`)**: Passed with 0 errors (`dist/` generated cleanly).
- **Linter (`oxlint`)**: Passed with 0 errors across all 26 client files.
- **Server Verification**: Verified `/api/health`, `/api/templates`, in-memory saving, and CORS origin matching with `CLIENT_URL=https://my-cv-app.vercel.app`.

---

# 📱 Commit Summary: Mobile Responsiveness Overhaul (iPhone 7 Plus to 2026 Smartphones)

**Date:** October 19, 2026  
**Type:** Feature / Mobile UX (`feat`)

## 🎯 Objectives Achieved
Engineered a comprehensive mobile responsive design ensuring complete, seamless usability on viewports ranging from classic devices like iPhone 7 Plus (414px width) up to modern 2026 smartphones (360px–430px+, Dynamic Island/notches, foldables).

---

## 🛠️ Summary of Changes

### 1. Mobile Bottom Navigation Bar (`MobileBottomNav.jsx`)
- Built a thumb-friendly bottom navigation bar mounted on screens `< 1024px` (`lg:hidden`).
- Features 5 primary action tabs with active state indicators:
  - **Edit Form**: Opens candidate information & sections editor.
  - **Preview**: Switches directly to the live A4 paper preview.
  - **Style**: Opens typography, theme colors, and layout customizer.
  - **Saved**: Opens saved CV versions & JSON import/export modal.
  - **PDF**: Triggers direct instant vector print generation.
- Added iOS home indicator safe area inset handling (`pb-safe`) to prevent overlap on modern iPhones.

### 2. Responsive A4 Paper Scaling Engine (`PreviewPanel.jsx`)
- Re-architected the A4 preview (base 794px × 1123px) to dynamically scale using `ResizeObserver`.
- On narrow viewports (e.g. 414px iPhone 7 Plus), the preview automatically scales to ~48%–50% to fit edge-to-edge with zero horizontal scrolling or clipping.
- Added negative vertical margin compensation (`marginBottom: -1123 * (1 - scale)px`) eliminating dead blank whitespace beneath the scaled canvas.
- Added a floating touch toolbar with **Fit**, **100% Reading View**, **Zoom In (+)**, and **Zoom Out (-)** controls.

### 3. Compact Header & Overflow Menu (`Navbar.jsx`)
- Restructured navigation bar into a non-wrapping single row on mobile.
- Features quick-toggle for **BD / Intl** template switch and high-visibility **PDF** button.
- Added a compact **`•••`** dropdown menu for secondary actions:
  - Class 5 BD Guide
  - Saved CVs Library
  - Import JSON File
  - Export Current CV (JSON)
  - Undo Last Action

### 4. Form Editors & Dialogs Touch Optimization
- **`PersonalInfoEditor.jsx`**: Responsive `grid-cols-1 sm:grid-cols-2` for photo shape, alignment, and position controls.
- **`ReferenceBoxesEditor.jsx`**: Referee card inputs refactored to single-column on mobile and two-column on tablet/desktop.
- **`StyleCustomizer.jsx`**: Text sizing and page margin dropdowns converted to responsive grids.
- **`TableSectionEditor.jsx`**: Wrapped table editor in horizontal scroll container with minimum cell widths (`85px`) to prevent input distortion on small screens.
- **`SectionsManager.jsx`**: Touch-friendly button padding (`p-1.5 rounded-lg active:scale-95`), `stopPropagation` on actions, and delete confirmation prompt.
- **`AddSectionModal.jsx` & `Class5GuideModal.jsx` & `SavedCvsModal.jsx`**: Modals updated with `max-h-[88dvh]`, smooth touch scrolling, and responsive stacked buttons.

### 5. Viewport & Dynamic Height Architecture (`index.html`, `index.css`)
- Added `viewport-fit=cover`, `maximum-scale=5.0`, and dark slate `<meta name="theme-color">` for notch/island support.
- Switched full-height containers to `100dvh` (Dynamic Viewport Height) to eliminate UI jumping when mobile Safari / Chrome show or hide the address bar.
- Added `touch-action: manipulation` and tap-highlight prevention utilities.

---

## 📁 Modified Files

| File | Change Description |
|---|---|
| `client/index.html` | Added `viewport-fit=cover` and mobile meta tags |
| `client/src/index.css` | Added `100dvh`, iOS safe area utilities, and tap touch rules |
| `client/src/App.jsx` | Integrated `MobileBottomNav`, `100dvh` viewport, and bottom navigation padding |
| `client/src/components/MobileBottomNav.jsx` | Dedicated thumb-friendly mobile bottom navigation component |
| `client/src/components/Navbar.jsx` | Compact mobile header with quick BD/Intl switch and `•••` overflow menu |
| `client/src/components/Preview/PreviewPanel.jsx` | Responsive A4 scaling engine with touch zoom controls |
| `client/src/components/Editor/EditorPanel.jsx` | Mobile-friendly short tabs and responsive sub-bar |
| `client/src/components/Editor/PersonalInfoEditor.jsx` | Responsive grid layouts for photo controls |
| `client/src/components/Editor/ReferenceBoxesEditor.jsx` | Responsive inputs for referee details |
| `client/src/components/Editor/SectionsManager.jsx` | Touch targets, delete confirmation, and touch event isolation |
| `client/src/components/Editor/StyleCustomizer.jsx` | Responsive dropdown grids |
| `client/src/components/Editor/TableSectionEditor.jsx` | Scrollable table editor container with min cell widths |
| `client/src/components/Editor/AddSectionModal.jsx` | Mobile dvh modal sizing |
| `client/src/components/Class5GuideModal.jsx` | Mobile dvh dialog with responsive action buttons |
| `client/src/components/SavedCvsModal.jsx` | Mobile dvh dialog with full-width action controls |

