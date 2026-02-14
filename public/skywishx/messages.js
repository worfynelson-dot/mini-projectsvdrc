// api/messages.js  — Vercel Serverless Function
// Handles: GET (fetch all) · POST (add new) · PATCH (toggle like)
// Storage : Vercel Blob  (BLOB_READ_WRITE_TOKEN env var — set in Vercel dashboard)

const { put, list, head } = require('@vercel/blob');

const BLOB_PATH  = 'skywishx/messages.json';
const CORS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/* ── Blob helpers ─────────────────────────────────────── */
async function readMessages() {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url + '?t=' + Date.now()); // bust cache
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
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
  // Preflight
  if (req.method === 'OPTIONS') {
    return res.writeHead(200, CORS).end();
  }
  Object.entries(CORS).forEach(([k, v]) => res.setHeader(k, v));

  // ── GET  /api/messages ────────────────────────────────
  if (req.method === 'GET') {
    const messages = await readMessages();
    // Sort newest first
    messages.sort((a, b) => b.timestamp - a.timestamp);
    return res.status(200).json({ ok: true, messages });
  }

  // ── POST /api/messages  — add new message ─────────────
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

    const { nickname, text, category, lang, color } = body || {};

    if (!nickname || !text)
      return res.status(400).json({ ok: false, error: 'nickname and text are required' });
    if (text.length > 280)
      return res.status(400).json({ ok: false, error: 'text too long (max 280)' });

    const messages = await readMessages();
    const newMsg = {
      id:        'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      nickname:  nickname.slice(0, 30),
      text:      text.slice(0, 280),
      category:  ['wish','love','dream','prayer','random'].includes(category) ? category : 'random',
      lang:      lang   || 'id',
      color:     ['blue','pink','purple','gold','teal'].includes(color) ? color : 'blue',
      likes:     0,
      likedBy:   [],
      timestamp: Date.now(),
    };
    messages.push(newMsg);
    await writeMessages(messages);
    return res.status(201).json({ ok: true, message: newMsg });
  }

  // ── PATCH /api/messages  — toggle like ────────────────
  if (req.method === 'PATCH') {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

    const { id, sessionId } = body || {};
    if (!id || !sessionId)
      return res.status(400).json({ ok: false, error: 'id and sessionId required' });

    const messages = await readMessages();
    const msg = messages.find(m => m.id === id);
    if (!msg) return res.status(404).json({ ok: false, error: 'not found' });

    if (!msg.likedBy) msg.likedBy = [];
    if (msg.likedBy.includes(sessionId)) {
      msg.likes = Math.max(0, (msg.likes || 0) - 1);
      msg.likedBy = msg.likedBy.filter(s => s !== sessionId);
    } else {
      msg.likes = (msg.likes || 0) + 1;
      msg.likedBy.push(sessionId);
    }

    await writeMessages(messages);
    return res.status(200).json({ ok: true, message: msg });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
};
