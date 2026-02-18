const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('ui');
const loadingScreen = document.getElementById('loading-screen');

canvas.width = 800;
canvas.height = 400;

// Internal placeholders for assets to prevent loading hangs
const GHOST_IMG = new Image();
const BAD_1 = new Image();
const BAD_2 = new Image();

// Using the URLs but adding a cache-buster and better error handling
const assetLinks = [
    "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/cute_ghost",
    "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/badghost_frame01",
    "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/badghost_frame02"
];

let loaded = 0;
function checkLoad() {
    loaded++;
    if (loaded >= 3) {
        document.getElementById('status').innerText = "NIGHTMARE READY";
        document.getElementById('start-btn').style.display = "block";
        document.getElementById('load-bar').style.width = "100%";
    }
}

// Attach sources
GHOST_IMG.crossOrigin = "anonymous";
GHOST_IMG.src = assetLinks[0];
GHOST_IMG.onload = checkLoad;
GHOST_IMG.onerror = () => { GHOST_IMG.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAlUlEQVRYR+2X0QqAIAxF7f8/unYpCDYlzfWSp9Aue8reSAtYInInInonm7mPAB9YAnwfIDpAnYAnIAnIAnKAgBwgIAd46wByZ7ovm6S79pveW8vAi8AL4AL4AnwfIDpAnYAnIAnIAnKAgBwgIAd46wByZ7ovm6S79pveW8vAi8AL4AL4AnwfIDpAnYAnIAnIAnKAgBxAd8AByuIDp9Z9Y7EAAAAASUVORK5CYII="; checkLoad(); };

BAD_1.crossOrigin = "anonymous";
BAD_1.src = assetLinks[1];
BAD_1.onload = checkLoad;
BAD_1.onerror = () => { BAD_1.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAWUlEQVRYR+2X0QqAIAxF7f8/unYpCDYlzfWSp9Aue8reSAtYInInInonm7mPAB9YAnwfIDpAnYAnIAnIAnKAgBwgIAd46wByZ7ovm6S79pveW8vAi8AL4AL4Anwf8AXoKxIDp+UvEwAAAABJRU5ErkJggg=="; checkLoad(); };

BAD_2.crossOrigin = "anonymous";
BAD_2.src = assetLinks[2];
BAD_2.onload = checkLoad;
BAD_2.onerror = () => { BAD_2.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAWUlEQVRYR+2X0QqAIAxF7f8/unYpCDYlzfWSp9Aue8reSAtYInInInonm7mPAB9YAnwfIDpAnYAnIAnIAnKAgBwgIAd46wByZ7ovm6S79pveW8vAi8AL4AL4Anwf8AXoKxIDp+UvEwAAAABJRU5ErkJggg=="; checkLoad(); };

// --- Game Logic ---
let ghost = { x: 200, y: 200, w: 42, h: 42, vx: 0, vy: 0, jumped: false, dashCD: 0 };
let chaser = { x: -200, y: 150, w: 90, h: 90, speed: 2.8 };
let platforms = [], orbs = [], keys = {}, cameraX = 0, score = 0, frame = 0, active = false;

document.getElementById('start-btn').onclick = () => {
    loadingScreen.style.display = "none";
    active = true;
    init();
    loop();
};

window.onkeydown = (e) => { keys[e.code] = true; if(e.code === 'Shift') doDash(); };
window.onkeyup = (e) => keys[e.code] = false;

function doDash() { if (ghost.dashCD <= 0 && active) { ghost.vx = 18; ghost.dashCD = 80; } }

const bind = (id, key, func) => {
    const el = document.getElementById(id);
    el.addEventListener('touchstart', (e) => { 
        e.preventDefault(); if(func) func(); else keys[key] = true; 
    }, {passive: false});
    el.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; }, {passive: false});
};
bind('leftBtn', 'ArrowLeft'); bind('rightBtn', 'ArrowRight'); bind('jumpBtn', 'Space'); bind('dashBtn', null, doDash);

function init() {
    platforms = [{x: 0, y: 350, w: 1000, h: 60}];
    for(let i=1; i<500; i++) {
        let px = i * 360, py = 160 + Math.random()*160, pw = 160 + Math.random()*140;
        platforms.push({x: px, y: py, w: pw, h: 40});
        if(Math.random() > 0.45) orbs.push({x: px + pw/2, y: py - 60, collected: false});
    }
}

function update() {
    if(!active) return;
    frame++;
    if(ghost.dashCD > 0) ghost.dashCD--;

    if(keys['ArrowRight']) ghost.vx += 0.85;
    if(keys['ArrowLeft']) ghost.vx -= 0.85;
    if((keys['Space'] || keys['ArrowUp']) && !ghost.jumped) { ghost.vy = -12.5; ghost.jumped = true; }

    ghost.vx *= 0.92; ghost.vy += 0.58;
    ghost.x += ghost.vx; ghost.y += ghost.vy;

    platforms.forEach(p => {
        if(ghost.x < p.x + p.w && ghost.x + ghost.w > p.x && ghost.y + ghost.h > p.y && ghost.y + ghost.h < p.y + p.h + 10 && ghost.vy >= 0) {
            ghost.y = p.y - ghost.h; ghost.vy = 0; ghost.jumped = false;
        }
    });

    orbs.forEach(o => {
        if(!o.collected && Math.hypot(ghost.x - o.x, ghost.y - o.y) < 45) { o.collected = true; score += 1500; }
    });

    chaser.speed = 3.1 + (score / 22000);
    chaser.x += chaser.speed;
    chaser.y += (ghost.y - chaser.y) * 0.04;

    if(ghost.y > canvas.height + 60 || ghost.x < chaser.x + 35) {
        active = false; alert("RECLAIMED BY THE VOID. Score: " + Math.floor(score)); location.reload();
    }

    cameraX = ghost.x - 200;
    score += 1.2;
    scoreEl.innerText = `Souls: ${Math.floor(score)} | DASH: ${ghost.dashCD > 0 ? '...' : 'READY'}`;
}

function draw() {
    ctx.fillStyle = "#050008"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.translate(-cameraX, 0);

    orbs.forEach(o => {
        if(!o.collected) {
            ctx.beginPath(); ctx.arc(o.x, o.y + Math.sin(frame/10)*8, 8, 0, Math.PI*2);
            ctx.fillStyle = "#0ff"; ctx.shadowBlur = 15; ctx.shadowColor = "#0ff"; ctx.fill();
        }
    });

    ctx.shadowBlur = 0; ctx.fillStyle = "#111120";
    platforms.forEach(p => { ctx.fillRect(p.x, p.y, p.w, p.h); ctx.strokeRect(p.x, p.y, p.w, p.h); });

    ctx.drawImage(GHOST_IMG, ghost.x, ghost.y, ghost.w, ghost.h);
    let badImg = (Math.floor(frame / 10) % 2 === 0) ? BAD_1 : BAD_2;
    ctx.shadowBlur = 20; ctx.shadowColor = "red";
    ctx.drawImage(badImg, chaser.x, chaser.y, chaser.w, chaser.h);

    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(0,0,0,0.85)";
    ctx.fillRect(chaser.x - 1000, 0, 1000, canvas.height);
    ctx.restore();
}

function loop() {
    update(); draw();
    if(active) requestAnimationFrame(loop);
    }
