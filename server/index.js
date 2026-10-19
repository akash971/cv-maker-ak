const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { bangladeshiClassicCV, internationalModernCV } = require('./templates');

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration accepting frontend origin environment variables
const clientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim().replace(/\/$/, ''))
  .filter(Boolean);

const defaultDevOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (server-to-server, curl, mobile apps, health checks)
    if (!origin) return callback(null, true);

    // If wildcard or CLIENT_URL is not set / set to '*'
    if (!process.env.CLIENT_URL || process.env.CLIENT_URL === '*' || clientUrls.includes('*')) {
      return callback(null, true);
    }

    // Check configured CLIENT_URL origins
    if (clientUrls.includes(origin)) {
      return callback(null, true);
    }

    // In non-production, allow common localhost origins
    if (process.env.NODE_ENV !== 'production' && (
      defaultDevOrigins.includes(origin) || 
      /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(origin)
    )) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsers (allows JSON up to 10MB to accommodate base64 payload if sent to API)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory stateless CV storage for server runtime (Zero local file-system writes/reads)
const inMemoryCvStore = new Map();
inMemoryCvStore.set('bangladeshi_classic', { ...bangladeshiClassicCV, id: 'bangladeshi_classic' });
inMemoryCvStore.set('international_modern', { ...internationalModernCV, id: 'international_modern' });

// API Health
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'stateless',
    timestamp: new Date().toISOString() 
  });
});

// Preset templates
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

// Helper to sanitize CV id
const sanitizeId = (id) => (id || '').toString().replace(/[^a-zA-Z0-9_-]/g, '');

// List all saved CVs (In-Memory, Stateless)
app.get('/api/cv/list', (req, res) => {
  try {
    const list = Array.from(inMemoryCvStore.values()).map(cv => ({
      id: cv.id,
      title: cv.title || 'Untitled CV',
      name: cv.personal?.fullName || 'Anonymous',
      styleMode: cv.styleMode || 'bangladeshi',
      updatedAt: cv.updatedAt || new Date().toISOString()
    }));
    res.json({ success: true, count: list.length, cvs: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get CV by ID (In-Memory, Stateless)
app.get('/api/cv/:id', (req, res) => {
  try {
    const rawId = req.params.id;
    if (rawId === 'bangladeshi_classic' || rawId === 'bd_classic_preset') {
      return res.json({ success: true, cv: bangladeshiClassicCV });
    }
    if (rawId === 'international_modern' || rawId === 'intl_modern_preset') {
      return res.json({ success: true, cv: internationalModernCV });
    }

    const id = sanitizeId(rawId);
    if (!id || !inMemoryCvStore.has(id)) {
      return res.status(404).json({ success: false, error: 'CV not found in memory' });
    }
    res.json({ success: true, cv: inMemoryCvStore.get(id) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save or update CV (In-Memory, Stateless)
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
    inMemoryCvStore.set(id, payload);
    res.json({ success: true, id, message: 'CV saved successfully (stateless in-memory)!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete CV (In-Memory, Stateless)
app.delete('/api/cv/:id', (req, res) => {
  try {
    const id = sanitizeId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, error: 'Invalid CV ID' });
    }
    if (inMemoryCvStore.has(id)) {
      inMemoryCvStore.delete(id);
      res.json({ success: true, message: 'CV deleted successfully from memory' });
    } else {
      res.status(404).json({ success: false, error: 'CV not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend if built (for monorepo single-service deployments)
const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
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
  console.log(`🌐 Configured CLIENT_URL: ${process.env.CLIENT_URL || 'All origins allowed (*)'}`);
  console.log(`💾 Architecture: 100% Stateless (Zero disk writes/reads)`);
  console.log(`===============================================`);
});
