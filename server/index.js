const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { bangladeshiClassicCV, internationalModernCV } = require('./templates');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Directories
const DATA_DIR = path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Serve static uploads
app.use('/uploads', express.static(UPLOAD_DIR));

// Setup multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'), false);
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get preset templates
app.get('/api/templates', (req, res) => {
  res.json({
    templates: [
      {
        id: 'bangladeshi_classic',
        name: '🇧🇩 Bangladeshi Classic (Photo Match)',
        description: 'Authentic Bangladeshi curriculum vitae with shaded headings, colon-aligned bio-data, and language table.',
        data: bangladeshiClassicCV
      },
      {
        id: 'international_modern',
        name: '🌍 International Modern (ATS Ready)',
        description: 'Sleek global resume with role highlights, skill tags, and modern project showcases.',
        data: internationalModernCV
      }
    ]
  });
});

// List all saved CVs
app.get('/api/cv/list', (req, res) => {
  try {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    const list = files.map(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
        return {
          id: content.id || file.replace('.json', ''),
          title: content.title || 'Untitled CV',
          name: content.personal?.fullName || 'Anonymous',
          styleMode: content.styleMode || 'bangladeshi',
          updatedAt: content.updatedAt || fs.statSync(path.join(DATA_DIR, file)).mtime
        };
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    res.json({ success: true, count: list.length, cvs: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Helper to sanitize CV id and prevent path traversal
const sanitizeId = (id) => (id || '').toString().replace(/[^a-zA-Z0-9_-]/g, '');

// Get CV by ID
app.get('/api/cv/:id', (req, res) => {
  try {
    const rawId = req.params.id;
    // Check preset first
    if (rawId === 'bangladeshi_classic' || rawId === 'bd_classic_preset') {
      return res.json({ success: true, cv: bangladeshiClassicCV });
    }
    if (rawId === 'international_modern' || rawId === 'intl_modern_preset') {
      return res.json({ success: true, cv: internationalModernCV });
    }

    const id = sanitizeId(rawId);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid CV ID' });
    }

    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, error: 'CV not found' });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json({ success: true, cv: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save or update CV
app.post('/api/cv/save', (req, res) => {
  try {
    const cvData = req.body;
    if (!cvData || !cvData.personal) {
      return res.status(400).json({ success: false, error: 'Invalid CV payload' });
    }
    const id = sanitizeId(cvData.id) || `cv_${Date.now()}`;
    const payload = {
      ...cvData,
      id,
      updatedAt: new Date().toISOString()
    };
    const filePath = path.join(DATA_DIR, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
    res.json({ success: true, id, message: 'CV saved successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete CV
app.delete('/api/cv/:id', (req, res) => {
  try {
    const id = sanitizeId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid CV ID' });
    }
    const filePath = path.join(DATA_DIR, `${id}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: 'CV deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'CV not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Upload profile photo
app.post('/api/cv/upload-photo', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, photoUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend if built
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 CV Maker Backend Server running on port ${PORT}`);
  console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads dir: ${UPLOAD_DIR}`);
  console.log(`===============================================`);
});
