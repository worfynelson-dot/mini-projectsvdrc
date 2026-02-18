const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('ui');
const loadBar = document.getElementById('load-bar');
const statusText = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const loadingScreen = document.getElementById('loading-screen');

canvas.width = 800;
canvas.height = 400;

// Asset Loading Logic
let loadedCount = 0;
const assets = [
    "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/cute_ghost",
    "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/badghost_frame01",
    "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/badghost_frame02"
];
const images = [];

assets.forEach((src, index) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
        loadedCount++;
        let progress = (loadedCount / assets.length) * 100;
        loadBar.style.width = progress + "%";
        if (loadedCount === assets.length) {
            statusText.innerText = "NIGHTMARE READY";
            startBtn.style.display = "block";
        }
    };
    images.push(img);
});

// Assignments for easy use
const GHOST_IMG = images[0];
const BAD_1 = images[1];
const BAD_2 = images[2];

// Game State
let ghost = { x: 200, y: 200, w: 42, h: 42, vx: 0, vy: 0, jumped: false, dashCD: 0 };
let chaser = { x: -200, y: 150, w: 90, h: 90, speed: 2.8 };
let platforms = [], orbs = [], keys = {}, cameraX = 0, score = 0, frame = 0, active = false;

startBtn.onclick = () => {
    loadingScreen.style.display = "none";
    active = true;
    init();
    loop();
};

// Input handling
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

    // Movement
    if(keys['ArrowRight']) ghost.vx += 0.85;
    if(keys['ArrowLeft']) ghost.vx -= 0.85;
    if((keys['Space'] || keys['ArrowUp']) && !ghost.jumped) { ghost.vy = -12.5; ghost.jumped = true; }

    ghost.vx *= 0.92; ghost.vy += 0.58;
    ghost.x += ghost.vx; ghost.y += ghost.vy;

    // Collisions
    platforms.forEach(p => {
        if(ghost.x < p.x + p.w && ghost.x + ghost.w > p.x && ghost.y + ghost.h > p.y && ghost.y + ghost.h < p.y + p.h + 10 && ghost.vy >= 0) {
            ghost.y = p.y - ghost.h; ghost.vy = 0; ghost.jumped = false;
        }
    });

    orbs.forEach(o => {
        if(!o.collected && Math.hypot(ghost.x - o.x, ghost.y - o.y) < 45) { o.collected = true; score += 1500; }
    });

    // Chaser logic
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
    update();
    draw();
    if(active) requestAnimationFrame(loop);
            }
