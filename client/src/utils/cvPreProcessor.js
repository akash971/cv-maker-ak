/**
 * cvPreProcessor.js
 * Pre-processor utility for cleaning Markdown artifacts, stripping dev/localhost remnants,
 * formatting key-value pairs, and normalizing CV data for professional print & display.
 */

// Strip dev/localhost URLs and ports (e.g., localhost:5173, http://localhost:5000, 127.0.0.1:5173)
export function stripDevArtifacts(text) {
  if (typeof text !== 'string') return text;
  return text
    // Replace localhost or 127.0.0.1 URLs with clean text (or empty if URL-only)
    .replace(/https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/?/gi, '')
    .replace(/(?:localhost|127\.0\.0\.1):\d+/gi, '')
    // Strip raw development page indicators like "1/2", "2/2", "Page 1 of 2"
    .replace(/^\s*\d+\s*\/\s*\d+\s*$/gm, '')
    .replace(/\bPage\s+\d+\s+of\s+\d+\b/gi, '')
    .trim();
}

// Strip markdown separator artifacts like " | :", "|:---|", leading/trailing pipes
export function cleanTextArtifacts(val) {
  if (val === null || val === undefined) return '';
  if (typeof val !== 'string') return String(val);

  let cleaned = stripDevArtifacts(val);

  // If the line is purely a markdown table separator like "| :--- | :--- |" or "|---|", return empty
  if (/^\|?[\s:\-|]+\|?$/.test(cleaned.trim())) {
    return '';
  }

  // Strip raw table/colon artifacts
  cleaned = cleaned
    // Strip leading or trailing "| :"
    .replace(/^\s*\|\s*:\s*/, '')
    .replace(/\s*\|\s*:\s*$/, '')
    // Replace internal " | : " with ": "
    .replace(/\s*\|\s*:\s*/g, ': ')
    // Strip leading pipe or colon
    .replace(/^\s*[|:]+\s*/, '')
    // Strip trailing pipe or colon
    .replace(/\s*[|:]+\s*$/, '')
    // Normalize double colons if any created
    .replace(/:\s*:/g, ':')
    .trim();

  return cleaned;
}

// Clean an individual key-value label or field value
export function cleanKeyValue(label, value) {
  let cleanLabel = cleanTextArtifacts(label || '');
  let cleanVal = cleanTextArtifacts(value || '');

  // Strip trailing colon from label so template colon doesn't duplicate (e.g. "Department:" -> "Department")
  cleanLabel = cleanLabel.replace(/[:|]+\s*$/, '').trim();

  // Strip leading colon from value if leaked
  cleanVal = cleanVal.replace(/^\s*[:|]+/, '').trim();

  return { label: cleanLabel, value: cleanVal };
}

// Detect and parse markdown tables if present in text content
export function parseMarkdownTableIfPresent(text) {
  if (typeof text !== 'string') return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  // Check if lines have pipe characters
  const pipeLines = lines.filter(l => l.includes('|'));
  if (pipeLines.length < 2) return null;

  const tableRows = [];
  for (const line of pipeLines) {
    // Skip separator lines like "|:---|:---|"
    if (/^\|?[\s:\-|]+\|?$/.test(line)) continue;
    
    // Split by pipe
    const cells = line
      .split('|')
      .map(c => cleanTextArtifacts(c.trim()))
      .filter((_, idx, arr) => {
        // filter out empty outer splits from leading/trailing pipes
        if (idx === 0 && line.startsWith('|') && arr[0] === '') return false;
        if (idx === arr.length - 1 && line.endsWith('|') && arr[arr.length - 1] === '') return false;
        return true;
      });

    if (cells.length > 0) {
      tableRows.push(cells);
    }
  }

  if (tableRows.length >= 2) {
    const headers = tableRows[0];
    const rows = tableRows.slice(1);
    return { headers, rows };
  }

  return null;
}

// Detect and parse key-value pairs formatted with pipes or colons in plain text
export function parseKeyValueLines(text) {
  if (typeof text !== 'string') return null;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  const pairs = [];
  let isAllKeyValue = true;

  for (const line of lines) {
    // Matches "Key | : Value" or "Key : Value" or "Key | Value"
    const match = line.match(/^([^|:]+)(?:\|\s*:|\s*:\s*|\s*\|\s*)(.+)$/);
    if (match) {
      const { label, value } = cleanKeyValue(match[1], match[2]);
      if (label && value) {
        pairs.push({ label, value });
        continue;
      }
    }
    isAllKeyValue = false;
    break;
  }

  if (isAllKeyValue && pairs.length > 0) {
    return pairs;
  }
  return null;
}

// Check if a field represents an address or multiline info that should span full-width in a 2-column grid
export function isLongOrAddressField(field) {
  if (!field) return false;
  const label = (field.label || '').toLowerCase();
  const val = String(field.value || '');
  return (
    label.includes('address') ||
    val.includes('\n') ||
    val.length > 40
  );
}

// Full CV data pre-processor before rendering / printing / exporting
export function preProcessCvData(cvData) {
  if (!cvData) return cvData;
  const cleaned = JSON.parse(JSON.stringify(cvData));

  // Personal Info
  if (cleaned.personal) {
    for (const key of Object.keys(cleaned.personal)) {
      if (typeof cleaned.personal[key] === 'string') {
        cleaned.personal[key] = cleanTextArtifacts(cleaned.personal[key]);
      }
    }
  }

  // Design text
  if (cleaned.design) {
    if (cleaned.design.headerTitle) cleaned.design.headerTitle = cleanTextArtifacts(cleaned.design.headerTitle);
    if (cleaned.design.headerSubtitle) cleaned.design.headerSubtitle = cleanTextArtifacts(cleaned.design.headerSubtitle);
    if (cleaned.design.declarationText) cleaned.design.declarationText = cleanTextArtifacts(cleaned.design.declarationText);
    if (cleaned.design.signatureText) cleaned.design.signatureText = cleanTextArtifacts(cleaned.design.signatureText);
    if (cleaned.design.dateText) cleaned.design.dateText = cleanTextArtifacts(cleaned.design.dateText);
  }

  // Sections
  if (Array.isArray(cleaned.sections)) {
    cleaned.sections = cleaned.sections.map(sec => {
      const s = { ...sec };
      if (s.title) s.title = cleanTextArtifacts(s.title);

      if (s.type === 'text' && typeof s.content === 'string') {
        s.content = cleanTextArtifacts(s.content);
      }

      if (s.type === 'education_list' && Array.isArray(s.items)) {
        s.items = s.items.map(item => {
          const cleanedItem = {};
          for (const k of Object.keys(item)) {
            cleanedItem[k] = cleanTextArtifacts(item[k]);
          }
          return cleanedItem;
        });
      }

      if (s.type === 'personal_info_grid' && Array.isArray(s.fields)) {
        s.fields = s.fields.map(f => {
          const { label, value } = cleanKeyValue(f.label, f.value);
          return { label, value };
        });
      }

      if (s.type === 'table') {
        if (Array.isArray(s.headers)) {
          s.headers = s.headers.map(h => cleanTextArtifacts(h));
        }
        if (Array.isArray(s.rows)) {
          s.rows = s.rows
            // Filter out separator rows
            .filter(row => !row.every(cell => /^\|?[\s:\-|]+\|?$/.test(String(cell || '').trim())))
            .map(row => row.map(cell => cleanTextArtifacts(cell)));
        }
      }

      if (s.type === 'bullet_list' && Array.isArray(s.items)) {
        s.items = s.items.map(item => cleanTextArtifacts(item));
      }

      if (s.type === 'declaration') {
        if (s.text) s.text = cleanTextArtifacts(s.text);
        if (s.signName) s.signName = cleanTextArtifacts(s.signName);
        if (s.dateLabel) s.dateLabel = cleanTextArtifacts(s.dateLabel);
      }

      return s;
    });
  }

  return cleaned;
}
