/* =================================================================
   WishyPhotos — core.js  (Shared across all pages)
   ================================================================= */

const DB_KEY = 'wishyPhotos_db';
const SESSION_KEY = 'wishyPhotos_session';
const BASE_PATH = '/wishyPhotos';

// ── Database ─────────────────────────────────────────────────
function getDB() {
  const raw = localStorage.getItem(DB_KEY);
  if (raw) return JSON.parse(raw);
  const db = { users: [], posts: [], nextUserId: 1, nextPostId: 1 };
  saveDB(db);
  return db;
}

function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// ── Session ──────────────────────────────────────────────────
function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    userId: user.id,
    username: user.username
  }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function getCurrentUser() {
  const s = getSession();
  if (!s) return null;
  const db = getDB();
  return db.users.find(u => u.id === s.userId) || null;
}

// ── Auth Guard — call on every protected page ────────────────
function requireAuth() {
  if (!getSession()) {
    window.location.href = BASE_PATH + '/index.html';
    return false;
  }
  return true;
}

function requireGuest() {
  if (getSession()) {
    window.location.href = BASE_PATH + '/feed.html';
    return false;
  }
  return true;
}

// ── Navigation ───────────────────────────────────────────────
function goTo(page) {
  window.location.href = BASE_PATH + '/' + page;
}

// ── Default Avatar ───────────────────────────────────────────
function defaultAvatar(name) {
  const colors = ['#fe2c55','#25f4ee','#5b5fc7','#ff6f3c','#20c997','#845ef7','#f59f00','#e64980'];
  const c = colors[(name || 'U').charCodeAt(0) % colors.length];
  const l = (name || 'U')[0].toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
      <rect width="200" height="200" rx="100" fill="${c}"/>
      <text x="100" y="125" text-anchor="middle" font-size="90"
            font-family="Arial,sans-serif" font-weight="bold" fill="white">${l}</text>
    </svg>`
  )}`;
}

function getAvatar(user) {
  return user.avatar || defaultAvatar(user.displayName || user.username);
}

// ── Image Upload (Vercel Blob via /api/upload) ───────────────
async function uploadImageToBlob(file, onProgress) {
  // Try Vercel Blob API first
  try {
    const filename = `wishy_${Date.now()}_${Math.random().toString(36).slice(2,8)}.${file.name.split('.').pop()}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `/api/upload?filename=${encodeURIComponent(filename)}`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve(data.url);
        } else {
          reject(new Error('Blob upload failed'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.send(file);
    });
  } catch (err) {
    console.warn('Blob upload failed, falling back to base64:', err);
    return fileToBase64(file);
  }
}

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

// ── Time Ago ─────────────────────────────────────────────────
function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  const months = Math.floor(days / 30);
  return months + 'mo ago';
}

// ── Toast ────────────────────────────────────────────────────
function showToast(message, type = 'success') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = 'toast ' + type;
  requestAnimationFrame(() => toast.classList.add('show'));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Format Number ────────────────────────────────────────────
function formatNum(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return String(n);
}

// ── Hash Password (simple) ───────────────────────────────────
async function hashPassword(pw) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pw + '_wishySalt2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// ── Shared CSS injection (toast) ─────────────────────────────
function injectToastCSS() {
  if (document.getElementById('toast-css')) return;
  const style = document.createElement('style');
  style.id = 'toast-css';
  style.textContent = `
    .toast {
      position: fixed; top: 30px; left: 50%;
      transform: translateX(-50%) translateY(-100px);
      background: #1a1a1a; color: #fff;
      padding: 14px 28px; border-radius: 14px;
      font-size: 14px; font-weight: 600; z-index: 9999;
      box-shadow: 0 10px 40px rgba(0,0,0,0.6);
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid #333; font-family: 'Inter', sans-serif;
    }
    .toast.show { transform: translateX(-50%) translateY(0); }
    .toast.success { border-color: #25f4ee; }
    .toast.error { border-color: #fe2c55; }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => injectToastCSS());