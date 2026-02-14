<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Hacked Shadows - Horror Desktop</title>
<style>
* {margin:0;padding:0;box-sizing:border-box;}
body {background:#111;font-family:Segoe UI,sans-serif;overflow:hidden;color:#fff;height:100vh;position:relative;cursor:none;}
#desktop {width:100vw;height:100vh;background:url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTIwMCAxMDAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJkYXJrIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0wIDBoNDAvdjQwaC00MFoiIGZpbGw9IiMwMDAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZGFyaykiIG9wYWNpdHk9IjAuOCIvPjxjaXJjbGUgY3g9IjUwJSIgY3k9IjUwJSIgcj0iMTAiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMyIvPjwvc3ZnPg==') no-repeat center/cover;position:relative;}
#taskbar {position:fixed;bottom:0;left:0;width:100%;height:40px;background:linear-gradient(to top,#000,#333);display:flex;align-items:center;padding:0 10px;z-index:1000;}
#start {width:40px;height:30px;background:#00ff00;margin-right:10px;cursor:pointer;border-radius:3px;}
#clock {color:#fff;font-size:14px;font-weight:600;}
#window {position:absolute;background:#222;border:2px solid #444;border-radius:8px;box-shadow:0 0 20px rgba(0,255,0,0.3);display:none;overflow:hidden;min-width:400px;max-width:90vw;max-height:90vh;}
#titlebar {background:linear-gradient(to right,#333,#111);height:30px;display:flex;align-items:center;padding:0 10px;font-weight:600;color:#fff;cursor:move;}
.close {margin-left:auto;background:#f00;width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer;}
#content {padding:15px;height:calc(100% - 35px);overflow:auto;}
#terminal {background:#000;color:#0f0;font-family:'Courier New',monospace;font-size:14px;line-height:1.4;white-space:pre-wrap;}
#pointer {position:absolute;width:20px;height:20px;background:radial-gradient(circle,#fff 0%,#0f0 50%,transparent 70%);pointer-events:none;z-index:999;transition:all 0.1s;border-radius:50%;box-shadow:0 0 10px #0f0;}
.icon {position:absolute;width:80px;height:80px;background:#333;border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-size:12px;color:#ccc;cursor:pointer;transition:0.2s;box-shadow:0 4px 8px rgba(0,0,0,0.5);}
.icon:hover {background:#444;box-shadow:0 0 20px #0f0;}
.icon.active {box-shadow:0 0 30px #f00, inset 0 0 20px #f00;background:#111;}
#icons {position:absolute;}
.desktop-icon {margin:20px;}
#loading {position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:#0f0;}
.fade {opacity:0;transition:opacity 1s;}
.horror-shake {animation:shake 0.5s infinite;}
@keyframes shake {0%,100%{transform:translateX(0);}25%{transform:translateX(-5px);}75%{transform:translateX(5px);}}
@media (max-width:768px) {.icon {width:60px;height:60px;font-size:10px;}.desktop-icon {margin:10px;}}
</style>
</head>
<body>
<div id="desktop">
  <div id="icons">
    <div class="icon" data-app="files" style="top:20px;left:20px;"><div style="font-size:20px;">📁</div>Files</div>
    <div class="icon" data-app="browser" style="top:20px;left:120px;"><div style="font-size:20px;">🌐</div>Browser</div>
    <div class="icon" data-app="terminal" style="top:120px;left:20px;"><div style="font-size:20px;">⚡</div>Terminal</div>
    <div class="icon" data-app="phone" style="top:120px;left:120px;"><div style="font-size:20px;">📱</div>Phone Hack</div>
  </div>
</div>
<div id="taskbar">
  <div id="start"></div>
  <div id="clock"></div>
</div>
<div id="window">
  <div id="titlebar"><span id="title"></span><div class="close" onclick="closeWindow()">&times;</div></div>
  <div id="content"></div>
</div>
<div id="pointer"></div>
<div id="loading">Loading Horror Desktop...</div>
<script src="engine1.js"></script>
<script src="engine2.js"></script>
<!-- Audio Context for Horror Sounds (Web Audio API) -->
<script>
let audioCtx; let horrorVol=0.1;
function initAudio(){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}
function playHorrorSound(freq,dur,vol=0.3,type='sine'){if(!audioCtx)return;let osc=audioCtx.createOscillator();let gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);osc.frequency.setValueAtTime(freq,audioCtx.currentTime);osc.type=type;gain.gain.setValueAtTime(vol,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.01,audioCtx.currentTime+dur);osc.start();osc.stop(audioCtx.currentTime+dur);}
function playCreep(){playHorrorSound(60+Math.random()*20,2,0.05,'sawtooth');}
function playScream(){playHorrorSound(800,0.5,0.4,'sawtooth');setTimeout(()=>playHorrorSound(400,1,0.3,'square'),200);}
function playHeartbeat(){playHorrorSound(80,0.3,0.2,'sine');}
initAudio();
</script>
</body>
</html>
