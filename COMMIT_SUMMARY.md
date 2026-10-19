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
