/* ============================================================
   SkyWishX — engine02.js
   Messages · Storage · i18n · Floating Bubbles · UI · Sound
   ============================================================ */

/* ── i18n ───────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    appName: 'SkyWishX', tagline: 'Send your wishes to the sky',
    placeholder: 'Write your wish, dream, or prayer...',
    nickname: 'Your name / nickname',
    category: 'Category', send: 'Send to Sky ✈️',
    wish: '🌟 Wish', love: '💕 Love', dream: '🌙 Dream',
    prayer: '🙏 Prayer', random: '✨ Random',
    color: 'Bubble Color', messages: 'Messages',
    birdHint: 'Click a bird 🐦 to read a random message!',
    clickMsg: 'Click any floating message to read it',
    likes: 'likes', liked: 'Liked!', share: 'Share',
    totalMsg: 'Total Messages', online: 'In the Sky',
    settings: 'Settings', sound: 'Ambient Sound',
    speed: 'Fly Speed', density: 'Message Density',
    history: 'Message Board', filter: 'Filter',
    search: 'Search messages...', close: 'Close',
    toastSent: '✈️ Your wish is flying!',
    toastBird: '🐦 A bird brought you a message!',
    toastLike: '❤️ Liked!',
    errorNick: 'Please enter your name!',
    errorEmpty: 'Please write a message!',
    timeDay: '☀️ Day', timeDusk: '🌅 Dusk', timeNight: '🌙 Night', timeDawn: '🌄 Dawn',
    rain: '🌧️ Rain', allLang: 'All Languages',
    from: 'from', at: 'at', anonymous: 'Anonymous'
  },
  id: {
    appName: 'SkyWishX', tagline: 'Kirim harapanmu ke langit',
    placeholder: 'Tulis harapan, mimpi, atau doamu...',
    nickname: 'Nama / nickname kamu',
    category: 'Kategori', send: 'Kirim ke Langit ✈️',
    wish: '🌟 Harapan', love: '💕 Cinta', dream: '🌙 Mimpi',
    prayer: '🙏 Doa', random: '✨ Acak',
    color: 'Warna Balon', messages: 'Pesan',
    birdHint: 'Klik burung 🐦 untuk baca pesan acak!',
    clickMsg: 'Klik balon pesan untuk membacanya',
    likes: 'suka', liked: 'Disukai!', share: 'Bagikan',
    totalMsg: 'Total Pesan', online: 'Di Langit',
    settings: 'Pengaturan', sound: 'Suara Ambient',
    speed: 'Kecepatan Terbang', density: 'Kepadatan Pesan',
    history: 'Papan Pesan', filter: 'Filter',
    search: 'Cari pesan...', close: 'Tutup',
    toastSent: '✈️ Harapanmu sedang terbang!',
    toastBird: '🐦 Seekor burung membawa pesanmu!',
    toastLike: '❤️ Disukai!',
    errorNick: 'Masukkan namamu dulu!',
    errorEmpty: 'Tulis pesan dulu ya!',
    timeDay: '☀️ Siang', timeDusk: '🌅 Senja', timeNight: '🌙 Malam', timeDawn: '🌄 Fajar',
    rain: '🌧️ Hujan', allLang: 'Semua Bahasa',
    from: 'dari', at: 'pukul', anonymous: 'Anonim'
  },
  jp: {
    appName: 'SkyWishX', tagline: '願いを空へ送ろう',
    placeholder: '願い、夢、または祈りを書いて...',
    nickname: 'ニックネーム',
    category: 'カテゴリ', send: '空へ送る ✈️',
    wish: '🌟 願い', love: '💕 愛', dream: '🌙 夢',
    prayer: '🙏 祈り', random: '✨ ランダム',
    color: 'バブルカラー', messages: 'メッセージ',
    birdHint: '鳥🐦をクリックしてランダムなメッセージを読もう！',
    clickMsg: 'メッセージバブルをクリックして読む',
    likes: 'いいね', liked: 'いいね！', share: 'シェア',
    totalMsg: '総メッセージ', online: '空中',
    settings: '設定', sound: '環境音',
    speed: '飛行速度', density: 'メッセージ密度',
    history: 'メッセージボード', filter: 'フィルター',
    search: 'メッセージを検索...', close: '閉じる',
    toastSent: '✈️ 願いが飛んでいます！',
    toastBird: '🐦 鳥がメッセージを運んできた！',
    toastLike: '❤️ いいね！',
    errorNick: '名前を入力してください！',
    errorEmpty: 'メッセージを書いてください！',
    timeDay: '☀️ 昼', timeDusk: '🌅 夕暮れ', timeNight: '🌙 夜', timeDawn: '🌄 夜明け',
    rain: '🌧️ 雨', allLang: 'すべての言語',
    from: 'から', at: '時刻', anonymous: '匿名'
  },
  kr: {
    appName: 'SkyWishX', tagline: '하늘에 소원을 보내요',
    placeholder: '소원, 꿈, 기도를 적어보세요...',
    nickname: '닉네임',
    category: '카테고리', send: '하늘로 보내기 ✈️',
    wish: '🌟 소원', love: '💕 사랑', dream: '🌙 꿈',
    prayer: '🙏 기도', random: '✨ 랜덤',
    color: '버블 색상', messages: '메시지',
    birdHint: '새🐦를 클릭해서 랜덤 메시지 읽기!',
    clickMsg: '메시지 버블을 클릭해서 읽기',
    likes: '좋아요', liked: '좋아요!', share: '공유',
    totalMsg: '총 메시지', online: '하늘에서',
    settings: '설정', sound: '환경음',
    speed: '비행 속도', density: '메시지 밀도',
    history: '메시지 보드', filter: '필터',
    search: '메시지 검색...', close: '닫기',
    toastSent: '✈️ 소원이 날아가고 있어요!',
    toastBird: '🐦 새가 메시지를 가져왔어요!',
    toastLike: '❤️ 좋아요!',
    errorNick: '이름을 입력해주세요!',
    errorEmpty: '메시지를 작성해주세요!',
    timeDay: '☀️ 낮', timeDusk: '🌅 황혼', timeNight: '🌙 밤', timeDawn: '🌄 새벽',
    rain: '🌧️ 비', allLang: '모든 언어',
    from: '에서', at: '시각', anonymous: '익명'
  },
  fr: {
    appName: 'SkyWishX', tagline: 'Envoyez vos vœux au ciel',
    placeholder: 'Écrivez votre vœu, rêve ou prière...',
    nickname: 'Votre nom / pseudo',
    category: 'Catégorie', send: 'Envoyer au Ciel ✈️',
    wish: '🌟 Vœu', love: '💕 Amour', dream: '🌙 Rêve',
    prayer: '🙏 Prière', random: '✨ Aléatoire',
    color: 'Couleur', messages: 'Messages',
    birdHint: 'Cliquez un oiseau 🐦 pour un message aléatoire !',
    clickMsg: 'Cliquez un message flottant pour le lire',
    likes: 'j\'aime', liked: 'Aimé !', share: 'Partager',
    totalMsg: 'Total Messages', online: 'Dans le Ciel',
    settings: 'Paramètres', sound: 'Son Ambiant',
    speed: 'Vitesse', density: 'Densité',
    history: 'Tableau des Messages', filter: 'Filtrer',
    search: 'Rechercher...', close: 'Fermer',
    toastSent: '✈️ Votre vœu vole !',
    toastBird: '🐦 Un oiseau vous apporte un message !',
    toastLike: '❤️ Aimé !',
    errorNick: 'Entrez votre prénom !',
    errorEmpty: 'Écrivez un message !',
    timeDay: '☀️ Jour', timeDusk: '🌅 Crépuscule', timeNight: '🌙 Nuit', timeDawn: '🌄 Aube',
    rain: '🌧️ Pluie', allLang: 'Toutes les Langues',
    from: 'de', at: 'à', anonymous: 'Anonyme'
  },
  es: {
    appName: 'SkyWishX', tagline: 'Envía tus deseos al cielo',
    placeholder: 'Escribe tu deseo, sueño o oración...',
    nickname: 'Tu nombre / apodo',
    category: 'Categoría', send: 'Enviar al Cielo ✈️',
    wish: '🌟 Deseo', love: '💕 Amor', dream: '🌙 Sueño',
    prayer: '🙏 Oración', random: '✨ Aleatorio',
    color: 'Color', messages: 'Mensajes',
    birdHint: '¡Haz clic en un pájaro 🐦 para un mensaje aleatorio!',
    clickMsg: 'Haz clic en un mensaje flotante para leerlo',
    likes: 'me gusta', liked: '¡Gustado!', share: 'Compartir',
    totalMsg: 'Total Mensajes', online: 'En el Cielo',
    settings: 'Ajustes', sound: 'Sonido Ambiental',
    speed: 'Velocidad', density: 'Densidad',
    history: 'Tablero de Mensajes', filter: 'Filtrar',
    search: 'Buscar mensajes...', close: 'Cerrar',
    toastSent: '✈️ ¡Tu deseo está volando!',
    toastBird: '🐦 ¡Un pájaro trajo un mensaje!',
    toastLike: '❤️ ¡Gustado!',
    errorNick: '¡Ingresa tu nombre!',
    errorEmpty: '¡Escribe un mensaje!',
    timeDay: '☀️ Día', timeDusk: '🌅 Crepúsculo', timeNight: '🌙 Noche', timeDawn: '🌄 Amanecer',
    rain: '🌧️ Lluvia', allLang: 'Todos los Idiomas',
    from: 'de', at: 'a las', anonymous: 'Anónimo'
  }
};

class I18n {
  constructor() { this.lang = localStorage.getItem('swx_lang') || 'id'; }
  t(k) { return (TRANSLATIONS[this.lang] || TRANSLATIONS.en)[k] || k; }
  set(l) { this.lang = l; localStorage.setItem('swx_lang', l); }
  get langName() {
    const names = { en:'English', id:'Bahasa Indonesia', jp:'日本語', kr:'한국어', fr:'Français', es:'Español' };
    return names[this.lang] || this.lang;
  }
}

/* ── Message Store  (Vercel Blob via API) ─────────────────── */
class MessageStore {
  constructor() {
    this.messages  = [];
    this.onUpdate  = null;   // callback when poll brings new messages
    this._pollTimer = null;
  }

  /* ── Bootstrap ─────────────────────────────────────────── */
  async init() {
    await this._fetchFromAPI();
    this._startPolling();
    return this.messages;
  }

  /* ── Fetch all from API ─────────────────────────────────── */
  async _fetchFromAPI() {
    try {
      const res  = await fetch('/api/messages');
      if (!res.ok) return;
      const data = await res.json();
      const incoming = data.messages || [];
      // Detect genuinely new messages (not in current list)
      const newOnes = incoming.filter(m => !this.messages.find(e => e.id === m.id));
      this.messages = incoming;
      if (newOnes.length && this.onUpdate) this.onUpdate(newOnes);
    } catch (e) {
      console.warn('[SkyWishX] API unreachable, running in offline mode');
    }
  }

  /* ── Poll every 12 seconds ─────────────────────────────── */
  _startPolling() {
    this._pollTimer = setInterval(() => this._fetchFromAPI(), 12000);
  }

  /* ── Add new message (POST to API) ─────────────────────── */
  async add(msg) {
    const res  = await fetch('/api/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(msg),
    });
    if (!res.ok) throw new Error('Failed to post message');
    const data   = await res.json();
    const newMsg = data.message;
    // Optimistically push to local list
    this.messages.unshift(newMsg);
    return newMsg;
  }

  /* ── Like (PATCH to API) ────────────────────────────────── */
  async like(id, sessionId) {
    // Optimistic local update
    const local = this.messages.find(m => m.id === id);
    if (local) {
      if (!local.likedBy) local.likedBy = [];
      const already = local.likedBy.includes(sessionId);
      local.likes   = Math.max(0, (local.likes || 0) + (already ? -1 : 1));
      already ? (local.likedBy = local.likedBy.filter(s => s !== sessionId))
              : local.likedBy.push(sessionId);
    }
    // Server update
    try {
      const res = await fetch('/api/messages', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        const idx  = this.messages.findIndex(m => m.id === id);
        if (idx !== -1) this.messages[idx] = data.message;
      }
    } catch {}
    return local;
  }

  getRandom() {
    if (!this.messages.length) return null;
    return this.messages[Math.floor(Math.random() * this.messages.length)];
  }

  getFiltered({ category, lang, search } = {}) {
    return this.messages.filter(m => {
      if (category && category !== 'all' && m.category !== category) return false;
      if (lang     && lang     !== 'all' && m.lang     !== lang)     return false;
      if (search && !m.text.toLowerCase().includes(search.toLowerCase()) &&
          !m.nickname.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }

  isLiked(id, sessionId) {
    const msg = this.messages.find(m => m.id === id);
    return msg?.likedBy?.includes(sessionId) || false;
  }
}

/* ── Floating Message System ─────────────────────────────── */
class FloatingMessageSystem {
  constructor(container, store, i18n, onMsgClick) {
    this.container  = container;
    this.store      = store;
    this.i18n       = i18n;
    this.onMsgClick = onMsgClick;
    this.active     = [];
    this.maxActive  = 12;
    this.density    = 5000;
    this._usedIds   = new Set(); // avoid same message twice at once
    this._loop();
  }

  setDensity(d) { this.density = d; }

  _loop() {
    this._spawn();
    setTimeout(() => this._loop(), this.density + Math.random() * 2000);
  }

  _spawn() {
    if (this.active.length >= this.maxActive) return;
    if (!this.store.messages.length) return;

    // Pick a random message not currently shown
    const avail = this.store.messages.filter(m => !this._usedIds.has(m.id));
    if (!avail.length) { this._usedIds.clear(); return; }
    const msg = avail[Math.floor(Math.random() * avail.length)];
    this._createBubble(msg);
  }

  spawnSpecific(msg) { this._createBubble(msg); }

  _createBubble(msg) {
    const el = document.createElement('div');
    el.className = `msg-bubble msg-bubble--${msg.color} msg-bubble--${msg.category}`;

    const catIcons = { wish:'🌟', love:'💕', dream:'🌙', prayer:'🙏', random:'✨' };
    const icon  = catIcons[msg.category] || '✨';
    const short = msg.text.length > 55 ? msg.text.slice(0, 52) + '…' : msg.text;

    // Format date
    const dateStr = msg.timestamp
      ? new Date(msg.timestamp).toLocaleDateString(undefined, { day:'numeric', month:'short', year:'2-digit' })
      : '';

    el.innerHTML = `
      <div class="bubble-icon">${icon}</div>
      <div class="bubble-text">${short}</div>
      <div class="bubble-footer">
        <span class="bubble-nick">— ${msg.nickname}</span>
        ${dateStr ? `<span class="bubble-date">${dateStr}</span>` : ''}
      </div>
    `;

    // Random position — spread across sky (5-65% vertical, 2-88% horizontal)
    const top  = 5  + Math.random() * 60;
    const left = 2  + Math.random() * 87;
    el.style.top  = top  + '%';
    el.style.left = left + '%';

    // Each bubble gets unique float phase
    el.style.animationDelay    = `${-Math.random() * 6}s`;
    el.style.animationDuration = `${6 + Math.random() * 5}s`;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.onMsgClick(msg);
    });

    el.addEventListener('mouseenter', () => {
      el.style.zIndex    = '150';
      el.style.transform = 'translateY(-6px) scale(1.06)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.zIndex    = '';
      el.style.transform = '';
    });

    this.container.appendChild(el);
    this.active.push(el);
    this._usedIds.add(msg.id);

    // Lifetime: 20-45s then fade out
    const lifetime = 20000 + Math.random() * 25000;
    setTimeout(() => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(-20px) scale(0.8)';
      el.style.transition = 'all 1.5s ease';
      setTimeout(() => {
        el.remove();
        this.active    = this.active.filter(a => a !== el);
        this._usedIds.delete(msg.id);
      }, 1500);
    }, lifetime);
  }

  // Called when new messages arrive via poll — spawn them immediately
  spawnNew(newMessages) {
    newMessages.slice(0, 3).forEach((msg, i) => {
      setTimeout(() => this.spawnSpecific(msg), i * 800);
    });
  }
}

/* ── Toast System ────────────────────────────────────────── */
class ToastSystem {
  constructor(container) {
    this.container = container;
    this.queue = [];
  }

  show(text, type = 'info', duration = 3000) {
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.textContent = text;
    this.container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('toast--visible'));
    setTimeout(() => {
      el.classList.remove('toast--visible');
      setTimeout(() => el.remove(), 400);
    }, duration);
  }
}

/* ── Sound System (Web Audio API) ────────────────────────── */
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.nodes = [];
  }

  _init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  toggle() {
    this.enabled ? this.stop() : this.start();
    return this.enabled;
  }

  start() {
    this._init();
    this.enabled = true;
    this._ambientWind();
    this._ambientBirds();
  }

  stop() {
    this.enabled = false;
    this.nodes.forEach(n => { try { n.stop(); n.disconnect(); } catch {} });
    this.nodes = [];
  }

  _ambientWind() {
    if (!this.enabled || !this.ctx) return;
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate * 3, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.03;

    const src = this.ctx.createBufferSource();
    src.buffer = buf; src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass'; filter.frequency.value = 600; filter.Q.value = 0.3;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.15;

    src.connect(filter).connect ? filter.connect(gain) : null;
    try { src.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination); src.start(); } catch {}
    this.nodes.push(src);
    setTimeout(() => this.enabled && this._ambientWind(), 3000);
  }

  _ambientBirds() {
    if (!this.enabled || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const freqs = [440, 523, 659, 784, 880];
    osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);

    try { osc.connect(gain); gain.connect(this.ctx.destination); osc.start(); osc.stop(this.ctx.currentTime + 0.4); } catch {}
    this.nodes.push(osc);
    if (this.enabled) setTimeout(() => this._ambientBirds(), 2000 + Math.random() * 5000);
  }
}

/* ── Share System ────────────────────────────────────────── */
class ShareSystem {
  static share(msg) {
    const text = `"${msg.text}" — ${msg.nickname} | SkyWishX 🌤️`;
    if (navigator.share) {
      navigator.share({ title: 'SkyWishX', text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {}).catch(() => {});
    }
  }
}

/* ── Stats System ─────────────────────────────────────────── */
class StatsSystem {
  constructor(store) { this.store = store; }
  get total() { return this.store.messages.length; }
  get inSky() { return Math.min(this.store.messages.length, 12 + Math.floor(Math.random() * 8)); }
  get topCategory() {
    const counts = {};
    this.store.messages.forEach(m => counts[m.category] = (counts[m.category] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'wish';
  }
}

/* ── Main App Engine ─────────────────────────────────────── */
class AppEngine {
  constructor() {
    this.i18n    = new I18n();
    this.store   = new MessageStore();
    this.sessionId = localStorage.getItem('swx_sid') || 'sid_' + Math.random().toString(36).slice(2);
    localStorage.setItem('swx_sid', this.sessionId);
    this.currentLang = this.i18n.lang;
    this.settings = {
      speed: 'normal',
      density: 'normal',
      soundOn: false,
      rain: false
    };
  }

  async init() {
    await this.store.init();
    this._buildUI();
    this._initEngines();
    this._bindEvents();
    this._applyLang();
    this._startStats();
    this._scheduleNewMsgCheck();
  }

  _buildUI() {
    // UI is in index.html, so we just update dynamic text
  }

  _initEngines() {
    const sky = document.getElementById('sky');

    // Sky Canvas
    this.skyCanvas      = new SkyCanvas('sky-canvas');
    this.windSystem     = new WindSystem(document.getElementById('wind-canvas'));
    this.shootingStars  = new ShootingStarSystem(document.getElementById('sky-canvas'));
    this.clouds         = new CloudSystem(sky);
    this.fireflySystem  = new FireflySystem(sky);
    this.rainSystem     = new RainSystem(sky);
    this.timeManager    = new TimeManager();
    this.planeSystem    = new PlaneSystem(sky);
    this.soundSystem    = new SoundSystem();

    this.birdSystem = new BirdSystem(sky, () => {
      const msg = this.store.getRandom();
      if (msg) {
        this.toast.show(this.i18n.t('toastBird'), 'bird');
        setTimeout(() => this._showModal(msg), 300);
      }
    });

    this.floatingMsgs = new FloatingMessageSystem(
      sky, this.store, this.i18n,
      (msg) => this._showModal(msg)
    );

    // Real-time: when poll detects new messages → spawn them + update stats
    this.store.onUpdate = (newMsgs) => {
      this.floatingMsgs.spawnNew(newMsgs);
      this._updateStats();
      if (newMsgs.length) {
        this.toast.show(`✨ ${newMsgs.length} new message${newMsgs.length > 1 ? 's' : ''} in the sky!`, 'info', 2500);
      }
    };

    this.toast  = new ToastSystem(document.getElementById('toast-container'));
    this.stats  = new StatsSystem(this.store);

    // Apply initial time
    this.timeManager.onChange = (t) => this._applyTime(t);
    this._applyTime(this.timeManager.current);

    // Night → fireflies
    if (this.timeManager.current === 'night') this.fireflySystem.enable();

    // Render loop
    const loop = () => {
      this.skyCanvas.draw();
      this.windSystem.draw(this.timeManager.current);
      this.shootingStars.draw(this.timeManager.current);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    // Auto time sync every 5 mins
    setInterval(() => this.timeManager.autoSync(), 300000);
  }

  _applyTime(t) {
    this.skyCanvas.setTimeOfDay(t);
    document.getElementById('sky').className = `sky sky--${t}`;
    document.querySelectorAll('.time-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.time === t);
    });
    if (t === 'night') this.fireflySystem.enable();
    else this.fireflySystem.disable();
  }

  _bindEvents() {
    // Send form
    document.getElementById('send-btn').addEventListener('click', () => this._sendMessage());
    document.getElementById('msg-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.ctrlKey) this._sendMessage();
    });

    // Modal close
    document.getElementById('modal-close').addEventListener('click', () => this._closeModal());
    document.getElementById('modal-overlay').addEventListener('click', (e) => {
      if (e.target === document.getElementById('modal-overlay')) this._closeModal();
    });

    // Like button in modal
    document.getElementById('modal-like-btn').addEventListener('click', async () => {
      if (this._modalMsg) {
        const msg = await this.store.like(this._modalMsg.id, this.sessionId);
        if (msg) {
          const liked = this.store.isLiked(this._modalMsg.id, this.sessionId);
          document.getElementById('modal-like-count').textContent = msg.likes || 0;
          document.getElementById('modal-like-btn').classList.toggle('liked', liked);
          this.toast.show(this.i18n.t('toastLike'), 'like');
        }
      }
    });

    // Share button
    document.getElementById('modal-share-btn').addEventListener('click', () => {
      if (this._modalMsg) {
        ShareSystem.share(this._modalMsg);
        this.toast.show('📋 Copied!', 'info');
      }
    });

    // Language selector
    document.getElementById('lang-select').addEventListener('change', (e) => {
      this.i18n.set(e.target.value);
      this._applyLang();
    });

    // Time buttons
    document.querySelectorAll('.time-btn').forEach(b => {
      b.addEventListener('click', () => this.timeManager.set(b.dataset.time));
    });

    // Panel toggles
    document.getElementById('btn-settings').addEventListener('click', () => this._togglePanel('settings-panel'));
    document.getElementById('btn-history').addEventListener('click', () => {
      this._togglePanel('history-panel');
      this._renderHistory();
    });
    document.getElementById('btn-compose').addEventListener('click', () => this._togglePanel('compose-panel'));

    document.querySelectorAll('.panel-close').forEach(b => {
      b.addEventListener('click', () => b.closest('.side-panel').classList.remove('open'));
    });

    // Sound toggle
    document.getElementById('sound-toggle').addEventListener('change', (e) => {
      this.soundSystem.toggle();
    });

    // Rain toggle
    document.getElementById('rain-toggle').addEventListener('change', (e) => {
      this.rainSystem.toggle();
    });

    // Speed
    document.getElementById('speed-select').addEventListener('change', (e) => {
      const densityMap = { slow: 8000, normal: 5000, fast: 2500 };
      this.floatingMsgs.setDensity(densityMap[e.target.value]);
    });

    // History search & filter
    document.getElementById('history-search').addEventListener('input', () => this._renderHistory());
    document.getElementById('history-cat').addEventListener('change', () => this._renderHistory());
    document.getElementById('history-lang').addEventListener('change', () => this._renderHistory());

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { this._closeModal(); this._closeAllPanels(); }
    });
  }

  async _sendMessage() {
    const nick  = document.getElementById('nick-input').value.trim();
    const text  = document.getElementById('msg-input').value.trim();
    const cat   = document.getElementById('cat-select').value;
    const color = document.querySelector('.color-btn.active')?.dataset.color || 'blue';

    if (!nick) { this.toast.show(this.i18n.t('errorNick'), 'error'); document.getElementById('nick-input').focus(); return; }
    if (!text) { this.toast.show(this.i18n.t('errorEmpty'), 'error'); document.getElementById('msg-input').focus(); return; }
    if (text.length > 280) { this.toast.show('Max 280 characters!', 'error'); return; }

    const sendBtn = document.getElementById('send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳ Sending...';

    try {
      const msg = await this.store.add({ nickname: nick, text, category: cat, lang: this.i18n.lang, color });

      this.planeSystem.launch(msg);
      setTimeout(() => this.floatingMsgs.spawnSpecific(msg), 4000);

      this.toast.show(this.i18n.t('toastSent'), 'success');
      document.getElementById('msg-input').value = '';
      document.getElementById('char-count').textContent = '0/280';

      if (window.innerWidth < 768) {
        document.getElementById('compose-panel').classList.remove('open');
      }
      this._updateStats();
      this._confetti();
    } catch (err) {
      this.toast.show('❌ Failed to send. Check connection.', 'error');
    } finally {
      sendBtn.disabled = false;
      sendBtn.setAttribute('data-i18n', 'send');
      sendBtn.textContent = this.i18n.t('send');
    }
  }

  _showModal(msg) {
    this._modalMsg = msg;
    const catIcons = { wish:'🌟', love:'💕', dream:'🌙', prayer:'🙏', random:'✨' };
    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date(msg.timestamp).toLocaleDateString();

    document.getElementById('modal-icon').textContent = catIcons[msg.category] || '✨';
    document.getElementById('modal-text').textContent = msg.text;
    document.getElementById('modal-nick').textContent = `— ${msg.nickname}`;
    document.getElementById('modal-meta').textContent = `${dateStr} ${timeStr}`;
    document.getElementById('modal-like-count').textContent = msg.likes || 0;
    document.getElementById('modal-cat').textContent = msg.category;
    document.getElementById('modal-like-btn').classList.toggle('liked', this.store.isLiked(msg.id, this.sessionId));
    document.getElementById('modal-overlay').setAttribute('data-color', msg.color);

    document.getElementById('modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  _closeModal() {
    document.getElementById('modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
    this._modalMsg = null;
  }

  _togglePanel(id) {
    const panel = document.getElementById(id);
    const wasOpen = panel.classList.contains('open');
    this._closeAllPanels();
    if (!wasOpen) panel.classList.add('open');
  }

  _closeAllPanels() {
    document.querySelectorAll('.side-panel').forEach(p => p.classList.remove('open'));
  }

  _renderHistory() {
    const search = document.getElementById('history-search').value;
    const cat    = document.getElementById('history-cat').value;
    const lang   = document.getElementById('history-lang').value;
    const msgs   = this.store.getFiltered({ search, category: cat, lang });
    const list   = document.getElementById('history-list');

    if (!msgs.length) {
      list.innerHTML = `<div class="history-empty">✨ No messages found</div>`;
      return;
    }

    list.innerHTML = msgs.slice().reverse().slice(0, 50).map(m => {
      const catIcons = { wish:'🌟', love:'💕', dream:'🌙', prayer:'🙏', random:'✨' };
      const icon = catIcons[m.category] || '✨';
      const liked = this.store.isLiked(m.id, this.sessionId);
      const dateStr = new Date(m.timestamp).toLocaleDateString();
      return `
        <div class="history-item history-item--${m.color}" data-id="${m.id}">
          <div class="history-header">
            <span class="history-icon">${icon}</span>
            <span class="history-nick">${m.nickname}</span>
            <span class="history-date">${dateStr}</span>
          </div>
          <div class="history-text">${m.text}</div>
          <div class="history-footer">
            <button class="history-like-btn ${liked ? 'liked' : ''}" data-id="${m.id}">
              ❤️ ${m.likes || 0}
            </button>
            <button class="history-read-btn" data-id="${m.id}">Read ↗</button>
          </div>
        </div>`;
    }).join('');

    // Bind events in history
    list.querySelectorAll('.history-like-btn').forEach(b => {
      b.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = b.dataset.id;
        await this.store.like(id, this.sessionId);
        this._renderHistory();
        this.toast.show(this.i18n.t('toastLike'), 'like');
      });
    });

    list.querySelectorAll('.history-read-btn').forEach(b => {
      b.addEventListener('click', () => {
        const msg = this.store.messages.find(m => m.id === b.dataset.id);
        if (msg) this._showModal(msg);
      });
    });
  }

  _applyLang() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const attr = el.getAttribute('data-i18n-attr') || 'textContent';
      if (attr === 'placeholder') el.placeholder = this.i18n.t(key);
      else el.textContent = this.i18n.t(key);
    });
    document.getElementById('lang-select').value = this.i18n.lang;
  }

  _updateStats() {
    document.getElementById('stat-total').textContent = this.stats.total;
    document.getElementById('stat-sky').textContent = this.stats.inSky;
  }

  _startStats() {
    this._updateStats();
    setInterval(() => this._updateStats(), 10000);
  }

  _scheduleNewMsgCheck() {
    // Occasionally show toast about new message
    setInterval(() => {
      if (Math.random() > 0.7) {
        const msg = this.store.getRandom();
        if (msg) {
          const names = ['someone', msg.nickname];
          const who = names[Math.floor(Math.random() * names.length)];
        }
      }
    }, 30000);
  }

  _confetti() {
    const colors = ['#FFD700', '#FF69B4', '#87CEEB', '#98FB98', '#DDA0DD'];
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        position:fixed; top:50%; left:50%;
        width:8px; height:8px; border-radius:2px;
        background:${colors[i % colors.length]};
        pointer-events:none; z-index:9999;
        animation: confettiFly 1.2s ease-out forwards;
        --tx:${(Math.random() - 0.5) * 300}px;
        --ty:${-(80 + Math.random() * 200)}px;
        --rot:${Math.random() * 720}deg;
        animation-delay:${Math.random() * 0.3}s;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }

  // Color picker buttons
  initColorPicker() {
    document.querySelectorAll('.color-btn').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
    });
    document.querySelector('.color-btn')?.classList.add('active');

    // Char counter
    document.getElementById('msg-input').addEventListener('input', (e) => {
      const len = e.target.value.length;
      const counter = document.getElementById('char-count');
      counter.textContent = `${len}/280`;
      counter.style.color = len > 250 ? '#FF6B6B' : '';
    });
  }
}

// Boot
window.addEventListener('DOMContentLoaded', async () => {
  const app = new AppEngine();
  await app.init();
  app.initColorPicker();
  window._skyApp = app;
});

window.AppEngine = AppEngine;
