// engine2.js - Core Engine Part 2: Terminal, Hacking, Game Logic, Horror Progression
let termLines=[]; let termInput=''; let inputEl;
function terminalInit(){const term=document.getElementById('terminal');term.textContent='$ haunted_term> ';termLines=['$ haunted_term> type help'];term.scrollTop=term.scrollHeight;document.addEventListener('keydown',termKey);}
function termKey(e){if(currentWindow!=='terminal')return;const term=document.getElementById('terminal');if(e.key==='Enter'){processCmd(termInput);termInput='';}else if(e.key==='Backspace'){termInput=termInput.slice(0,-1);}else if(e.key.length===1){termInput+=e.key;}updateTerm();}
function updateTerm(){const term=document.getElementById('terminal');term.textContent=termLines.join('\n')+'$ haunted_term> '+termInput+'|';term.scrollTop=term.scrollHeight;}
function processCmd(cmd){termLines.push('$ haunted_term> '+cmd);if(cmd==='help'){termLines.push('cmds: ls, cat creepy_log.txt, scrapy_hack, clear');}
else if(cmd==='ls'){termLines.push('creepy_log.txt  shadow.mp4  phone_scrape.py');}
else if(cmd==='cat creepy_log.txt'){termLines.push('They know you\'re here... footsteps...');horrorEvent();}
else if(cmd==='scrapy_hack'){startScrapyHack();}
else if(cmd==='clear'){termLines=['$ haunted_term> cleared'];}
else{termLines.push('cmd not found. horror intensifies...');horrorEvent();}
updateTerm();}
function startHack(){if(gameState.hacked){content.innerHTML+='<p>Phone data: '+gameState.phoneData+'</p>';return;}
content.innerHTML=`<div id="hack-term" style="background:#000;color:#0f0;font-family:monospace;height:400px;overflow:auto;padding:10px;"></div>`;hackTerm=document.getElementById('hack-term');hackTerm.innerHTML='scrapy startproject phonehack\ncd phonehack\nscrapy crawl badguy -o data.json\nSimulating scrape...';setTimeout(()=>{simulateScrapy();},2000);}
function simulateScrapy(){playCreep();hackTerm.innerHTML+='\n[+] Scraped: "Victim screams recorded... location: your house!"\n[+] Horror files: ghost_selfie.jpg';gameState.phoneData='Victim screams... your house!';gameState.hacked=true;gameState.horrorLevel+=3;setTimeout(playScream,1000);setTimeout(()=>{content.innerHTML+='<p>HACK SUCCESS! But now they\'re coming...</p>';finalHorror();},3000);}
function finalHorror(){desktop.style.background='radial-gradient(circle,rgba(255,0,0,0.8),#000)';desktop.classList.add('horror-shake');playScream();setInterval(()=>{if(Math.random()<0.5)showGhost();},1000);gameState.horrorLevel=10;}
function endGame(){alert('Game Over: 30min Survived?\nHorror Level: '+gameState.horrorLevel+'\nYou were haunted forever... Refresh to play again.');}
// Mobile Touch Keyboard for Terminal (Simplified)
if('ontouchstart' in window){document.addEventListener('keydown',e=>{if(e.key==='Enter'&&currentWindow==='terminal')e.preventDefault();});}
// Progressive Horror: Scenes over time
setInterval(updateGameState,5000); function updateGameState(){gameState.horrorLevel=Math.min(10,gameState.time/300);if(gameState.scene===1&&gameState.hacked){loadScene(2);content.innerHTML+='<p>Final Puzzle: Enter code 666</p><input id="code" type="password"><button onclick="checkCode()">Submit</button>';}
if(gameState.time>1200){finalHorror();}}
function checkCode(){let code=document.getElementById('code').value;if(code==='666'){alert('Escape! But horror follows...');}else{horrorEvent();}}
// Auto-progress for long playtime: Fake events
setTimeout(()=>{if(gameState.scene===0)openApp('files');},10000);
setTimeout(()=>{playScream();showGhost();},30000);
setTimeout(()=>{if(!gameState.hacked)content.innerHTML='<p>Phone vibrating... Hack now!</p>';},60000);
// Pointer trail horror
setInterval(()=>{if(gameState.horrorLevel>3){pointer.style.filter='hue-rotate(180deg)';pointer.style.boxShadow='0 0 20px #f00';playCreep();}},10000);
console.log('Hacked Shadows Loaded - Horror Desktop Sim for Win11/Mobile. Play 30min, hack fictional Scrapy phone scene. Pure fiction!');
