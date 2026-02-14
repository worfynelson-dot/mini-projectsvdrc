// api/admin.js  — Vercel Serverless Function
// ADMIN ONLY: edit, delete, update any message
// Auth: X-Admin-Token header must match ADMIN_PASSWORD env var

const { put, list } = require('@vercel/blob');

const BLOB_PATH     = 'skywishx/messages.json';
// Password is checked server-side — set ADMIN_PASSWORD in Vercel env vars
// Fallback to hardcoded for initial deploy (change after setup!)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'AdityaGalihPratama2013';

const CORS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Admin-Token',
};

/* ── Auth ─────────────────────────────────────────────── */
function isAuthorized(req) {
  const token = req.headers['x-admin-token'] || '';
  return token === ADMIN_PASSWORD;
}

/* ── Blob helpers ─────────────────────────────────────── */
async function readMessages() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url + '?t=' + Date.now());
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function writeMessages(messages) {
  await put(BLOB_PATH, JSON.stringify(messages), {
    access:          'public',
    contentType:     'application/json',
    addRandomSuffix: false,
    allowOverwrite:  true,
  });
}

/* ── Handler ──────────────────────────────────────────── */
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.writeHead(200, CORS).end();
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  // Verify admin password for ALL requests
  if (!isAuthorized(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  // ── GET /api/admin  — get all messages (full data) ────
  if (req.method === 'GET') {
    const messages = await readMessages();
    messages.sort((a, b) => b.timestamp - a.timestamp);
    return res.status(200).json({ ok: true, messages, total: messages.length });
  }

  // ── PUT /api/admin  — edit a message ──────────────────
  if (req.method === 'PUT') {
    const { id, updates } = body || {};
    if (!id) return res.status(400).json({ ok: false, error: 'id required' });

    const messages = await readMessages();
    const idx = messages.findIndex(m => m.id === id);
    if (idx === -1) return res.status(404).json({ ok: false, error: 'Message not found' });

    // Only allow specific fields to be updated
    const allowed = ['nickname','text','category','lang','color','likes','timestamp'];
    allowed.forEach(field => {
      if (updates[field] !== undefined) messages[idx][field] = updates[field];
    });
    messages[idx].editedAt = Date.now();
    messages[idx].editedByAdmin = true;

    await writeMessages(messages);
    return res.status(200).json({ ok: true, message: messages[idx] });
  }

  // ── DELETE /api/admin  — delete a message ─────────────
  if (req.method === 'DELETE') {
    const { id } = body || {};
    if (!id) return res.status(400).json({ ok: false, error: 'id required' });

    const messages  = await readMessages();
    const filtered  = messages.filter(m => m.id !== id);
    if (filtered.length === messages.length)
      return res.status(404).json({ ok: false, error: 'Message not found' });

    await writeMessages(filtered);
    return res.status(200).json({ ok: true, deleted: id, remaining: filtered.length });
  }

  // ── POST /api/admin  — admin add message (manual) ─────
  if (req.method === 'POST') {
    const { nickname, text, category, lang, color, timestamp } = body || {};
    if (!nickname || !text) return res.status(400).json({ ok: false, error: 'nickname and text required' });

    const messages = await readMessages();
    const newMsg = {
      id:        'adm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
      nickname:  nickname.slice(0, 30),
      text:      text.slice(0, 280),
      category:  category  || 'random',
      lang:      lang      || 'id',
      color:     color     || 'blue',
      likes:     0,
      likedBy:   [],
      timestamp: timestamp || Date.now(),
      addedByAdmin: true,
    };
    messages.push(newMsg);
    await writeMessages(messages);
    return res.status(201).json({ ok: true, message: newMsg });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
