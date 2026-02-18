const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('ui');

canvas.width = 800;
canvas.height = 400;

// Assets
const GHOST_IMG = new Image(); GHOST_IMG.src = "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/cute_ghost";
const BAD_1 = new Image(); BAD_1.src = "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/badghost_frame01";
const BAD_2 = new Image(); BAD_2.src = "https://mzpiu4p9ugnygfqo.public.blob.vercel-storage.com/assets0001A/badghost_frame02";

// Game State
let ghost = { x: 200, y: 200, w: 42, h: 42, vx: 0, vy: 0, jumped: false, dashCD: 0 };
let chaser = { x: -150, y: 150, w: 90, h: 90, speed: 2.8 };
let platforms = [], orbs = [], keys = {}, cameraX = 0, score = 0, frame = 0, active = true;

// Input Listeners
window.onkeydown = (e) => { 
    keys[e.code] = true; 
    if(e.code === 'Shift') doDash(); 
};
window.onkeyup = (e) => keys[e.code] = false;

function doDash() {
    if (ghost.dashCD <= 0) { ghost.vx = 16; ghost.dashCD = 80; }
}

const bind = (id, key, func) => {
    const el = document.getElementById(id);
    el.ontouchstart = (e) => { e.preventDefault(); if(func) func(); else keys[key] = true; };
    el.ontouchend = (e) => { e.preventDefault(); keys[key] = false; };
};
bind('leftBtn', 'ArrowLeft'); bind('rightBtn', 'ArrowRight'); bind('jumpBtn', 'Space'); bind('dashBtn', null, doDash);

function init() {
    platforms = [{x: 0, y: 350, w: 1000, h: 60}];
    for(let i=1; i<1000; i++) {
        let px = i * 360, py = 150 + Math.random()*180, pw = 150 + Math.random()*150;
        platforms.push({x: px, y: py, w: pw, h: 40});
        if(Math.random() > 0.4) orbs.push({x: px + pw/2, y: py - 60, collected: false});
    }
}

function update() {
    if(!active) return;
    frame++;
    if(ghost.dashCD > 0) ghost.dashCD--;

    // Gamepad
    const gp = navigator.getGamepads()[0];
    if(gp) {
        keys['ArrowLeft'] = gp.axes[0] < -0.4 || gp.buttons[14].pressed;
        keys['ArrowRight'] = gp.axes[0] > 0.4 || gp.buttons[15].pressed;
        keys['Space'] = gp.buttons[0].pressed;
        if(gp.buttons[2].pressed) doDash();
    }

    // Physics
    if(keys['ArrowRight']) ghost.vx += 0.8;
    if(keys['ArrowLeft']) ghost.vx -= 0.8;
    if((keys['Space'] || keys['ArrowUp']) && !ghost.jumped) { ghost.vy = -12; ghost.jumped = true; }

    ghost.vx *= 0.91; ghost.vy += 0.55;
    ghost.x += ghost.vx; ghost.y += ghost.vy;

    // Collisions
    platforms.forEach(p => {
        if(ghost.x < p.x + p.w && ghost.x + ghost.w > p.x && ghost.y + ghost.h > p.y && ghost.y + ghost.h < p.y + p.h + 10 && ghost.vy >= 0) {
            ghost.y = p.y - ghost.h; ghost.vy = 0; ghost.jumped = false;
        }
    });

    orbs.forEach(o => {
        if(!o.collected && Math.hypot(ghost.x - o.x, ghost.y - o.y) < 40) { o.collected = true; score += 1000; }
    });

    // Chaser AI
    chaser.speed = 3.0 + (score / 25000);
    chaser.x += chaser.speed;
    chaser.y += (ghost.y - chaser.y) * 0.03;

    if(ghost.y > canvas.height + 50 || ghost.x < chaser.x + 35) {
        active = false; alert("RECLAIMED BY THE VOID. Score: " + Math.floor(score)); location.reload();
    }

    cameraX = ghost.x - 200;
    score += 1;
    scoreEl.innerText = `Souls: ${Math.floor(score)} | DASH: ${ghost.dashCD > 0 ? 'CHARGING' : 'READY'}`;
}

function draw() {
    ctx.fillStyle = "#0a000f"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save(); ctx.translate(-cameraX, 0);

    // Draw Orbs
    orbs.forEach(o => {
        if(!o.collected) {
            ctx.beginPath(); ctx.arc(o.x, o.y + Math.sin(frame/10)*8, 8, 0, Math.PI*2);
            ctx.fillStyle = "#0ff"; ctx.shadowBlur = 15; ctx.shadowColor = "#0ff"; ctx.fill();
        }
    });

    // Draw Platforms
    ctx.shadowBlur = 0; ctx.fillStyle = "#151525";
    platforms.forEach(p => { ctx.fillRect(p.x, p.y, p.w, p.h); ctx.strokeStyle="#334"; ctx.strokeRect(p.x, p.y, p.w, p.h); });

    // Player
    ctx.drawImage(GHOST_IMG, ghost.x, ghost.y, ghost.w, ghost.h);

    // Animated Bad Ghost
    let badImg = (Math.floor(frame / 12) % 2 === 0) ? BAD_1 : BAD_2;
    ctx.shadowBlur = 25; ctx.shadowColor = "red";
    ctx.drawImage(badImg, chaser.x, chaser.y, chaser.w, chaser.h);

    // Trailing Fog
    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(chaser.x - 1000, 0, 1000, canvas.height);

    ctx.restore();
    requestAnimationFrame(() => { update(); draw(); });
}

init(); draw();
