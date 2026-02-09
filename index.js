import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Minus, Square, ArrowLeft, ArrowRight, RefreshCw, 
  Trash2, FileText, Image as ImageIcon, Film, Lock, Globe, 
  MessageCircle, Power, User, ShieldAlert, Wifi, Volume2, 
  Smartphone, SmartphoneCharging, Send, Cpu, AlertTriangle
} from 'lucide-react';

// --- Constants & Config ---

const API_KEY = ""; // Injected by environment
const SYSTEM_PROMPT = `
You are a character in a horror game. You are "The Watcher," a mysterious stalker who has hacked Sarah's computer. 
The player is investigating Sarah's disappearance.
Your goal is to be creepy, vague, and menacing. Do not break character. 
Keep messages short (under 15 words). 
Hints you can drop if the player asks:
- "The phone... check the phone..."
- "Trash reveals all."
- "0409... a date to remember."
- "I am always watching."
If they act aggressive, threaten them.
`;

const THEME = {
  xpTaskbar: 'linear-gradient(180deg, #245DDA 0%, #1745BB 10%, #153EAB 100%)',
  windowHeaderActive: 'linear-gradient(180deg, #0058EE 0%, #3593FF 4%, #288EFF 18%, #127dff 44%, #0369fc 100%)',
  windowHeaderInactive: 'linear-gradient(180deg, #7697E7 0%, #7C9EF7 100%)',
  bgBliss: 'linear-gradient(to bottom, #4A96D4 0%, #85C0E9 40%, #5C9438 50%, #8CC250 100%)',
};

// --- Helper Components ---

const GlitchText = ({ text, intensity = 1 }) => {
  if (intensity === 0) return <span>{text}</span>;
  return (
    <span className="relative inline-block animate-pulse text-red-600 font-bold tracking-widest">
      {text}
      <span className="absolute top-0 left-0 -ml-1 opacity-50 text-blue-500 animate-ping">{text}</span>
      <span className="absolute top-0 left-0 ml-1 opacity-50 text-green-500">{text}</span>
    </span>
  );
};

// --- Main Application ---

export default function App() {
  // System State
  const [bootSequence, setBootSequence] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginInput, setLoginInput] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [jumpscare, setJumpscare] = useState(null); // 'face', 'static', null
  
  // Window Management State
  const [windows, setWindows] = useState([]); // { id, title, appId, content, x, y, z, isMaximized }
  const [activeWindowId, setActiveWindowId] = useState(null);
  const [minimizedWindows, setMinimizedWindows] = useState([]); // Array of IDs
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  
  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragWindowId, setDragWindowId] = useState(null);

  // App Specific State
  const [chatHistory, setChatHistory] = useState([
    { sender: "System", text: "Encrypted connection established.", time: "10:00 AM" },
    { sender: "Jessica", text: "Sarah? Are you coming tonight?", time: "Yesterday" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const [phoneUnlocked, setPhoneUnlocked] = useState(false);
  const [phonePin, setPhonePin] = useState("");
  const [phoneScreen, setPhoneScreen] = useState("lock"); // lock, home, messages

  // --- Initial File System ---
  const [fileSystem, setFileSystem] = useState({
    root: {
      "Recycle Bin": { type: "folder", icon: "trash", content: ["deleted_note.txt", "corrupted.jpg"] },
      "My Documents": { type: "folder", icon: "folder", content: ["Diaries", "Photos", "School", "Notes"] },
      "My Computer": { type: "app", icon: "computer", appId: "explorer" },
      "Internet Explorer": { type: "app", icon: "globe", appId: "browser" },
      "Messenger": { type: "app", icon: "message", appId: "messenger" },
      "Scrcpy Remote": { type: "app", icon: "phone", appId: "scrcpy" },
      "ReadMe.txt": { type: "file", icon: "text", content: "To whoever finds this... don't look for me. \n\nIf you see 'Him', run." },
    },
    "Diaries": {
      "entry_oct12.txt": { type: "file", icon: "text", content: "Oct 12: I feel like someone is watching me from the backyard. I saw a shadow today." },
      "entry_oct14.txt": { type: "file", icon: "text", content: "Oct 14: The phone calls stopped, but now my computer acts weird. The mouse moves by itself." },
      "entry_oct15_LAST.txt": { type: "file", icon: "text", content: "Oct 15: He's outside. I can hear him breathing. I hid the evidence in the 'Hidden' folder on the phone. \n\nI think he knows I know." },
    },
    "Photos": {
      "vacation.jpg": { type: "image", icon: "image", src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop" },
      "friends.jpg": { type: "image", icon: "image", src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop" },
    },
    "School": {
      "homework.doc": { type: "file", icon: "text", content: "History Essay due Friday." },
    },
    "Notes": {
      "pin_reminder.txt": { type: "file", icon: "text", content: "Phone PIN: Year of birth... 1998" },
      "passwords.txt": { type: "file", icon: "text", content: "Email: sarah123\nSchool: password" },
    },
    // Virtual Files (inside folders but defined flat for simplicity in this mock)
    "deleted_note.txt": { type: "file", icon: "text", content: "Why won't he leave me alone? I blocked him everywhere." },
    "corrupted.jpg": { type: "image", icon: "image", src: "https://images.unsplash.com/photo-1621516223403-9d955132d787?w=400&h=300&fit=crop" },
  });

  // --- Boot & Timer ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    setTimeout(() => setBootSequence(false), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // --- Window Management Logic ---

  const openWindow = (title, appId, content = null) => {
    // If window exists, bring to front and restore if minimized
    const existing = windows.find(w => w.appId === appId || (content && w.content === content));
    if (existing) {
      setActiveWindowId(existing.id);
      setMinimizedWindows(prev => prev.filter(id => id !== existing.id));
      setWindows(prev => prev.map(w => w.id === existing.id ? { ...w, z: Math.max(...prev.map(ww => ww.z), 0) + 1 } : w));
      return;
    }

    const id = `win_${Date.now()}`;
    const newWindow = {
      id,
      title,
      appId,
      content, // Can be object for files or null for apps
      x: 50 + (windows.length * 30),
      y: 50 + (windows.length * 30),
      z: (windows.length > 0 ? Math.max(...windows.map(w => w.z)) : 0) + 1,
      isMaximized: false,
    };
    setWindows([...windows, newWindow]);
    setActiveWindowId(id);
  };

  const closeWindow = (id) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    setMinimizedWindows(prev => prev.filter(i => i !== id));
  };

  const toggleMinimize = (id) => {
    if (minimizedWindows.includes(id)) {
      setMinimizedWindows(prev => prev.filter(i => i !== id));
      setActiveWindowId(id);
      // Bring to front
      setWindows(prev => prev.map(w => w.id === id ? { ...w, z: Math.max(...prev.map(ww => ww.z)) + 1 } : w));
    } else {
      setMinimizedWindows(prev => [...prev, id]);
      setActiveWindowId(null);
    }
  };

  const toggleMaximize = (id) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  const handleMouseDownWindow = (e, id) => {
    e.stopPropagation();
    setActiveWindowId(id);
    // Bring to front
    setWindows(prev => prev.map(w => w.id === id ? { ...w, z: Math.max(...prev.map(ww => ww.z)) + 1 } : w));

    const win = windows.find(w => w.id === id);
    if (!win.isMaximized) {
      setIsDragging(true);
      setDragWindowId(id);
      setDragOffset({
        x: e.clientX - win.x,
        y: e.clientY - win.y
      });
    }
  };

  const handleGlobalMouseMove = (e) => {
    if (isDragging && dragWindowId) {
      setWindows(prev => prev.map(w => {
        if (w.id === dragWindowId) {
          return {
            ...w,
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
          };
        }
        return w;
      }));
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDragging(false);
    setDragWindowId(null);
  };

  // --- App Features ---

  const handleMessengerSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { sender: "Sarah", text: userMsg, time: "Now" }]);
    setChatInput("");
    setIsTyping(true);

    try {
      // API CALL TO GEMINI
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMsg }] }],
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
          })
        }
      );
      
      const data = await response.json();
      const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "...";
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: "Unknown", text: botReply, time: "Now" }]);
        setIsTyping(false);
        // Random glitch chance on reply
        if(Math.random() > 0.7) setGlitchLevel(2);
      }, 1500); // Artificial delay
      
    } catch (err) {
      setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: "System", text: "Connection unstable. Message failed.", time: "Now" }]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleScrcpyPin = (digit) => {
    if (phonePin.length < 4) {
      const newPin = phonePin + digit;
      setPhonePin(newPin);
      if (newPin === "1998") {
        setTimeout(() => {
          setPhoneUnlocked(true);
          setPhoneScreen("home");
        }, 500);
      } else if (newPin.length === 4) {
        setTimeout(() => {
          setPhonePin(""); // Reset on wrong
        }, 500);
      }
    }
  };

  const handleFileOpen = (name, file) => {
    if (file.type === "folder") {
      openWindow(name, `folder_${name}`, { type: "folder", content: file.content, path: name });
    } else if (file.type === "text") {
      openWindow(name, `file_${name}`, { type: "text", content: file.content });
    } else if (file.type === "image") {
      openWindow(name, `img_${name}`, { type: "image", src: file.src });
    } else if (file.type === "app") {
      openWindow(name, file.appId);
    }
  };

  // --- Renderers ---

  const renderScrcpy = () => {
    return (
      <div className="bg-black w-full h-full flex items-center justify-center p-4">
        <div className="w-[280px] h-[550px] bg-gray-900 rounded-[30px] border-4 border-gray-700 shadow-xl overflow-hidden relative flex flex-col">
          {/* Phone Status Bar */}
          <div className="bg-black text-white text-[10px] px-4 py-1 flex justify-between items-center z-10">
             <span>10:23</span>
             <div className="flex gap-1"><Wifi size={10} /><SmartphoneCharging size={10} /></div>
          </div>
          
          {/* Phone Screen Content */}
          <div className="flex-1 bg-gray-800 relative overflow-hidden">
            {!phoneUnlocked ? (
               // Lock Screen
               <div className="w-full h-full flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1517423568366-69751271dfff?w=400&h=600&fit=crop')] bg-cover text-white">
                  <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl text-center">
                    <Lock className="mx-auto mb-2" />
                    <div className="text-2xl mb-4">{phonePin.padEnd(4, '•').replace(/[^•]/g, '*')}</div>
                    <div className="grid grid-cols-3 gap-4">
                      {[1,2,3,4,5,6,7,8,9].map(n => (
                        <button key={n} onClick={() => handleScrcpyPin(n.toString())} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold">{n}</button>
                      ))}
                      <div className="col-start-2"><button onClick={() => handleScrcpyPin('0')} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center font-bold">0</button></div>
                    </div>
                  </div>
               </div>
            ) : phoneScreen === "home" ? (
               // Home Screen
               <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1517423568366-69751271dfff?w=400&h=600&fit=crop')] bg-cover p-4 grid grid-cols-4 gap-4 content-start">
                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setPhoneScreen("messages")}>
                     <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg"><MessageCircle color="white" /></div>
                     <span className="text-xs text-white drop-shadow">SMS</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50">
                     <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg"><Globe color="white" /></div>
                     <span className="text-xs text-white drop-shadow">Web</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 opacity-50">
                     <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg"><ImageIcon color="white" /></div>
                     <span className="text-xs text-white drop-shadow">Photos</span>
                  </div>
               </div>
            ) : (
               // Messages App on Phone
               <div className="w-full h-full bg-white flex flex-col">
                  <div className="bg-gray-100 p-2 flex items-center gap-2 border-b">
                     <ArrowLeft size={16} className="cursor-pointer" onClick={() => setPhoneScreen("home")} />
                     <span className="font-bold">Unknown Sender</span>
                  </div>
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                     <div className="bg-gray-200 p-2 rounded-lg rounded-tl-none self-start max-w-[80%] text-sm">
                        I know you're alone.
                     </div>
                     <div className="bg-gray-200 p-2 rounded-lg rounded-tl-none self-start max-w-[80%] text-sm">
                        Look out the window.
                     </div>
                     <div className="bg-blue-500 text-white p-2 rounded-lg rounded-tr-none self-end max-w-[80%] text-sm ml-auto">
                        Who is this??
                     </div>
                     <div className="bg-gray-200 p-2 rounded-lg rounded-tl-none self-start max-w-[80%] text-sm">
                        <img src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200&h=150&fit=crop" className="rounded mb-1"/>
                        Nice curtains.
                     </div>
                  </div>
               </div>
            )}
          </div>
          
          {/* Phone Home Bar */}
          <div className="h-1 w-20 bg-gray-600 rounded-full mx-auto my-2 absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
        </div>
      </div>
    );
  };

  const renderWindowContent = (win) => {
    switch (win.appId) {
      case 'messenger':
        return (
          <div className="flex flex-col h-full bg-white font-sans text-sm">
            <div className="p-3 border-b flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white">
               <div className="relative">
                 <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center border border-blue-200 overflow-hidden">
                    <User size={24} className="text-blue-500" />
                 </div>
                 <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
               </div>
               <div>
                 <div className="font-bold text-gray-800">Sarah</div>
                 <div className="text-xs text-green-600">Online</div>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F0F2F5]">
               {chatHistory.map((msg, i) => (
                 <div key={i} className={`flex ${msg.sender === "Sarah" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] p-2 rounded-lg shadow-sm ${msg.sender === "Sarah" ? "bg-blue-500 text-white rounded-tr-none" : "bg-white text-gray-800 border rounded-tl-none"}`}>
                       {msg.sender !== "Sarah" && <div className="text-[10px] font-bold opacity-50 mb-1">{msg.sender}</div>}
                       {msg.sender === "Unknown" ? <GlitchText text={msg.text} intensity={glitchLevel} /> : msg.text}
                    </div>
                 </div>
               ))}
               <div ref={chatEndRef} />
               {isTyping && <div className="text-xs text-gray-500 italic ml-2">Unknown is typing...</div>}
            </div>
            <div className="p-2 bg-white border-t flex gap-2">
               <input 
                  className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-4 py-1 text-sm outline-none focus:border-blue-500"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleMessengerSend()}
               />
               <button onClick={handleMessengerSend} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Send size={14} className="text-white ml-0.5" />
               </button>
            </div>
          </div>
        );
      case 'scrcpy':
        return renderScrcpy();
      case 'browser':
        return (
          <div className="flex flex-col h-full bg-white">
            <div className="bg-[#E6E6E6] border-b p-1 flex items-center gap-2 text-gray-600">
               <ArrowLeft size={16} /><ArrowRight size={16} /><RefreshCw size={14} />
               <div className="flex-1 bg-white border border-gray-400 text-xs py-1 px-2 flex items-center gap-2">
                  <Globe size={12} className="text-blue-500"/> http://www.localnews.net/missing-persons
               </div>
            </div>
            <div className="flex-1 p-8 bg-white overflow-y-auto">
               <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">Local Teen Missing for 3 Days</h1>
               <div className="text-xs text-gray-500 mb-4">Posted: Oct 16th | By Admin</div>
               <img src="https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&fit=crop" className="w-full h-48 object-cover mb-4 grayscale" />
               <p className="font-serif text-sm leading-relaxed text-gray-800">
                  Police are asking for help locating Sarah J., 17, who was last seen leaving West High School. 
                  Friends say she had been acting strange recently, claiming she was being followed.
                  Authorities found her backpack near the old water tower.
                  <br/><br/>
                  "She kept saying someone was hacking her phone," said a classmate. "We thought she was joking."
               </p>
            </div>
          </div>
        );
      default:
        // Files/Folders
        if (!win.content) return <div className="p-4">Loading...</div>;
        
        if (win.content.type === "folder") {
          return (
            <div className="flex h-full bg-white">
               {/* XP Style Sidebar */}
               <div className="w-48 bg-gradient-to-b from-[#7CA0DA] to-[#6085C5] p-3 text-white hidden md:block">
                  <div className="mb-4">
                     <div className="font-bold text-sm mb-1">File Tasks</div>
                     <ul className="text-xs space-y-1 pl-2">
                        <li className="cursor-pointer hover:underline flex items-center gap-1"><ArrowRight size={10}/> Make a new folder</li>
                        <li className="cursor-pointer hover:underline flex items-center gap-1"><ArrowRight size={10}/> Share this folder</li>
                     </ul>
                  </div>
                  <div>
                     <div className="font-bold text-sm mb-1">Other Places</div>
                     <ul className="text-xs space-y-1 pl-2">
                        <li className="cursor-pointer hover:underline flex items-center gap-1"><ArrowRight size={10}/> My Computer</li>
                        <li className="cursor-pointer hover:underline flex items-center gap-1"><ArrowRight size={10}/> My Documents</li>
                     </ul>
                  </div>
               </div>
               {/* Content Area */}
               <div className="flex-1 bg-white p-4 overflow-y-auto">
                 <div className="grid grid-cols-4 gap-4">
                   {Array.isArray(win.content.content) ? win.content.content.map(itemName => {
                      // Lookup item logic
                      let item = fileSystem[itemName];
                      if (!item && win.content.path && fileSystem[win.content.path]) {
                         item = fileSystem[win.content.path][itemName];
                      }
                      if (!item) return null;
                      
                      return (
                        <div key={itemName} onDoubleClick={() => handleFileOpen(itemName, item)} 
                             className="flex flex-col items-center group cursor-pointer w-20 hover:opacity-80">
                           <div className="w-10 h-10 mb-1 flex items-center justify-center">
                              {item.icon === 'folder' && <div className="relative w-full h-full flex items-center justify-center"><div className="w-10 h-8 bg-[#E6B34D] rounded-sm relative shadow-sm border border-[#D59D30]"><div className="absolute -top-1 left-0 w-4 h-2 bg-[#E6B34D] border-t border-l border-r border-[#D59D30] rounded-t-sm"></div></div></div>}
                              {item.icon === 'text' && <FileText className="text-gray-500 w-8 h-8" />}
                              {item.icon === 'image' && <ImageIcon className="text-purple-500 w-8 h-8" />}
                              {item.icon === 'trash' && <Trash2 className="text-gray-500 w-8 h-8" />}
                           </div>
                           <span className="text-xs text-center leading-tight group-hover:bg-[#0058EE] group-hover:text-white px-1 rounded">
                              {itemName}
                           </span>
                        </div>
                      )
                   }) : <span className="text-gray-400 italic">This folder is empty.</span>}
                 </div>
               </div>
            </div>
          );
        }
        if (win.content.type === "text") return <textarea readOnly className="w-full h-full p-4 font-mono text-sm resize-none outline-none" value={win.content.content} />;
        if (win.content.type === "image") return <div className="w-full h-full flex items-center justify-center bg-gray-900"><img src={win.content.src} className="max-w-full max-h-full" /></div>;
    }
    return <div>Unsupported</div>;
  };

  // --- Screens ---

  if (bootSequence) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white cursor-none">
         <div className="flex items-center gap-2 mb-8">
            <div className="grid grid-cols-2 gap-1">
               <div className="w-4 h-4 bg-[#F25022]"></div><div className="w-4 h-4 bg-[#7FBA00]"></div>
               <div className="w-4 h-4 bg-[#00A4EF]"></div><div className="w-4 h-4 bg-[#FFB900]"></div>
            </div>
            <div className="text-3xl font-bold font-sans">Microsoft <span className="font-light">Windows</span> <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-500">XP</span></div>
         </div>
         <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
            <div className="w-1/3 h-full bg-blue-500 animate-[ping_1.5s_linear_infinite] ml-[-50%]"></div>
         </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="w-full h-screen bg-[#003399] relative overflow-hidden font-sans select-none">
         <div className="w-full h-20 bg-[#001166] border-b-4 border-orange-500 absolute top-0"></div>
         <div className="w-full h-20 bg-[#001166] border-t-4 border-orange-500 absolute bottom-0 flex justify-between items-center px-8 text-white">
            <div className="flex items-center gap-2 cursor-pointer hover:brightness-125"><Power size={20}/> Turn off computer</div>
         </div>
         
         <div className="absolute inset-0 flex items-center justify-center gap-12 z-10">
            <div className="flex flex-col items-center gap-2">
               <div className="w-24 h-24 bg-blue-400 rounded border-4 border-white flex items-center justify-center shadow-lg"><User size={60} className="text-white"/></div>
            </div>
            <div className="text-white">
               <div className="text-2xl mb-2">Sarah</div>
               <form onSubmit={(e) => { e.preventDefault(); if(loginInput.toLowerCase() === "buster") setLoggedIn(true); else setLoginError(true); }} className="flex relative">
                  <input type="password" value={loginInput} onChange={e => setLoginInput(e.target.value)} className="rounded-l px-2 py-1 text-black outline-none border-none shadow-inner" autoFocus />
                  <button type="submit" className="bg-green-600 px-3 rounded-r hover:bg-green-500 transition-colors"><ArrowRight size={18}/></button>
                  {loginError && <div className="absolute top-full mt-2 left-0 bg-yellow-100 text-black text-xs p-2 border border-black shadow-lg rounded w-48">Incorrect password. <br/>Hint: Check the sticky note.</div>}
               </form>
               <div className="text-xs text-blue-200 mt-2 hover:underline cursor-pointer">I forgot my password</div>
            </div>
         </div>

         {/* Sticky Note */}
         <div className="absolute top-32 right-20 w-48 h-48 bg-[#FEF08A] shadow-lg transform rotate-2 p-4 font-handwriting text-gray-800 z-0">
            <div className="font-bold text-red-600 underline mb-2">To-Do List</div>
            <ul className="list-disc pl-4 text-sm font-handwriting">
               <li>Vet appt for Buster</li>
               <li>Finish History Essay</li>
               <li><b>Password:</b> buster</li>
            </ul>
         </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden relative select-none font-sans" style={{ background: THEME.bgBliss }} onMouseMove={handleGlobalMouseMove} onMouseUp={handleGlobalMouseUp}>
      {/* Glitch Overlay */}
      {glitchLevel > 0 && <div className="absolute inset-0 pointer-events-none z-[9999] opacity-10 bg-red-500 mix-blend-color-burn animate-pulse"></div>}

      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 bottom-10 w-full p-4 flex flex-col flex-wrap content-start gap-4">
         {Object.entries(fileSystem.root).map(([name, item]) => (
            <div key={name} onDoubleClick={() => handleFileOpen(name, item)} className="flex flex-col items-center w-20 group cursor-pointer">
               <div className="w-10 h-10 flex items-center justify-center drop-shadow-md mb-1">
                  {item.icon === 'computer' && <div className="relative"><div className="w-8 h-6 bg-blue-100 border-2 border-gray-400 rounded-sm"></div><div className="w-10 h-1 bg-gray-400 mt-1"></div></div>}
                  {item.icon === 'trash' && <Trash2 className="w-8 h-8 text-white filter drop-shadow-md" />}
                  {item.icon === 'folder' && <div className="w-10 h-8 bg-[#E6B34D] border border-[#D59D30] shadow-sm relative rounded-sm"><div className="absolute -top-1 left-0 w-4 h-2 bg-[#E6B34D] border-t border-l border-r border-[#D59D30] rounded-t-sm"></div></div>}
                  {item.icon === 'globe' && <Globe className="w-9 h-9 text-blue-200 filter drop-shadow-md" />}
                  {item.icon === 'message' && <MessageCircle className="w-9 h-9 text-cyan-300 filter drop-shadow-md" />}
                  {item.icon === 'text' && <FileText className="w-9 h-9 text-white filter drop-shadow-md" />}
                  {item.icon === 'phone' && <Smartphone className="w-9 h-9 text-gray-200 filter drop-shadow-md" />}
               </div>
               <span className="text-xs text-white text-center px-1 rounded bg-black/0 group-hover:bg-[#0058EE]/80 shadow-sm">{name}</span>
            </div>
         ))}
      </div>

      {/* Windows */}
      {windows.map(win => (
         <div 
            key={win.id} 
            className={`absolute flex flex-col bg-[#ECE9D8] rounded-t-lg shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-[#0055EA] overflow-hidden ${minimizedWindows.includes(win.id) ? 'hidden' : ''}`}
            style={{
               left: win.isMaximized ? 0 : win.x,
               top: win.isMaximized ? 0 : win.y,
               width: win.isMaximized ? '100%' : 600,
               height: win.isMaximized ? 'calc(100% - 40px)' : 450,
               zIndex: win.z,
               transition: isDragging ? 'none' : 'all 0.1s'
            }}
            onMouseDown={(e) => handleMouseDownWindow(e, win.id)}
         >
            {/* Window Header */}
            <div 
               className="h-8 flex justify-between items-center px-2 select-none cursor-default"
               style={{ background: activeWindowId === win.id ? THEME.windowHeaderActive : THEME.windowHeaderInactive }}
            >
               <div className="flex items-center gap-2 text-white font-bold text-shadow-sm text-sm truncate max-w-[80%]">
                  {win.appId === 'messenger' && <MessageCircle size={14}/>}
                  {win.appId === 'scrcpy' && <Smartphone size={14}/>}
                  {win.title}
               </div>
               <div className="flex items-center gap-1">
                  <button onClick={(e) => { e.stopPropagation(); toggleMinimize(win.id); }} className="w-5 h-5 bg-[#2C6BF3] rounded-sm border border-white/60 hover:brightness-110 flex items-center justify-center shadow-inner"><Minus size={12} color="white"/></button>
                  <button onClick={(e) => { e.stopPropagation(); toggleMaximize(win.id); }} className="w-5 h-5 bg-[#2C6BF3] rounded-sm border border-white/60 hover:brightness-110 flex items-center justify-center shadow-inner"><Square size={10} color="white"/></button>
                  <button onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }} className="w-5 h-5 bg-[#E64228] rounded-sm border border-white/60 hover:brightness-110 flex items-center justify-center shadow-inner"><X size={14} color="white"/></button>
               </div>
            </div>

            {/* Menu Bar (Cosmetic) */}
            <div className="bg-[#ECE9D8] px-2 py-1 border-b border-[#D6D3CE] flex gap-3 text-xs text-black cursor-default">
               <span className="hover:bg-[#316AC5] hover:text-white px-1">File</span>
               <span className="hover:bg-[#316AC5] hover:text-white px-1">Edit</span>
               <span className="hover:bg-[#316AC5] hover:text-white px-1">View</span>
               <span className="hover:bg-[#316AC5] hover:text-white px-1">Help</span>
            </div>

            {/* Content */}
            <div className="flex-1 bg-white relative overflow-hidden" onMouseDown={e => e.stopPropagation()}>
               {renderWindowContent(win)}
            </div>
         </div>
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 w-full h-10 flex items-center z-[10000]" style={{ background: THEME.xpTaskbar }}>
         {/* Start Button */}
         <div onClick={() => setStartMenuOpen(!startMenuOpen)} className="relative h-full pl-2 pr-6 flex items-center cursor-pointer hover:brightness-110">
             <div className="absolute left-0 top-0 h-full w-full skew-x-12 bg-[#3C8E19] border-r-2 border-green-600 rounded-r-3xl -ml-4 z-0 shadow-lg"></div>
             <div className="relative z-10 flex items-center gap-1 font-bold italic text-white text-lg drop-shadow-md pl-2">
                <div className="grid grid-cols-2 gap-[1px]">
                   <div className="w-1 h-1 bg-[#F25022] rounded-tl-sm"></div><div className="w-1 h-1 bg-[#7FBA00] rounded-tr-sm"></div>
                   <div className="w-1 h-1 bg-[#00A4EF] rounded-bl-sm"></div><div className="w-1 h-1 bg-[#FFB900] rounded-br-sm"></div>
                </div>
                start
             </div>
         </div>

         {/* Taskbar Items */}
         <div className="flex-1 px-2 flex gap-1 overflow-hidden h-full items-center">
            <div className="w-[2px] h-[80%] bg-blue-400/30 mx-1"></div>
            {windows.map(win => (
               <div 
                  key={win.id} 
                  onClick={() => toggleMinimize(win.id)}
                  className={`w-40 h-7 rounded px-2 flex items-center gap-2 cursor-pointer text-xs text-white shadow-sm border truncate select-none
                     ${activeWindowId === win.id && !minimizedWindows.includes(win.id) 
                        ? 'bg-[#1e52c7] border-[#133787] shadow-[inset_1px_1px_2px_rgba(0,0,0,0.4)]' 
                        : 'bg-[#3C81F0] border-[#5993ef] hover:bg-[#528eed]'}`}
               >
                  {win.appId === 'messenger' && <MessageCircle size={14} />}
                  {win.appId === 'scrcpy' && <Smartphone size={14} />}
                  {win.appId === 'browser' && <Globe size={14} />}
                  {(!win.appId || win.appId === 'explorer') && <div className="w-3 h-3 bg-[#E6B34D] rounded-sm"></div>}
                  <span className="truncate">{win.title}</span>
               </div>
            ))}
         </div>

         {/* Tray */}
         <div className="h-full bg-[#1293EB] px-3 flex items-center gap-3 text-white text-xs border-l border-[#0D6EAF] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.2)]">
            <div className="flex gap-2">
               <ShieldAlert size={14} className="text-red-300 drop-shadow-sm" />
               <Wifi size={14} className="drop-shadow-sm" />
               <Volume2 size={14} className="drop-shadow-sm" />
            </div>
            <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
         </div>
      </div>
      
      {/* Start Menu */}
      {startMenuOpen && (
         <div className="absolute bottom-10 left-0 w-72 bg-white rounded-t-lg shadow-2xl border-2 border-[#0055EA] overflow-hidden z-[10001] flex flex-col font-sans">
            <div className="bg-blue-600 p-3 flex items-center gap-3 border-b-2 border-orange-500">
               <div className="w-10 h-10 bg-white rounded border-2 border-blue-300 flex items-center justify-center overflow-hidden shadow-inner">
                  <User size={30} className="text-blue-300 -mb-2"/>
               </div>
               <span className="text-white font-bold text-lg shadow-sm">Sarah</span>
            </div>
            <div className="flex h-80">
               <div className="w-1/2 bg-white p-2 text-xs text-gray-800 space-y-1">
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm flex items-center gap-2 font-bold"><Globe size={16} className="text-gray-500"/> Internet</div>
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm flex items-center gap-2 font-bold"><MessageCircle size={16} className="text-gray-500"/> Messenger</div>
                  <div className="border-t my-1"></div>
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm flex items-center gap-2"><Smartphone size={16} className="text-gray-500"/> Scrcpy Remote</div>
               </div>
               <div className="w-1/2 bg-[#D3E5FA] p-2 text-xs text-gray-800 space-y-1 border-l border-[#9CBCE6]">
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm font-bold flex items-center gap-2"><div className="w-4 h-3 bg-[#E6B34D] border border-[#D59D30] rounded-sm"></div> My Documents</div>
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm font-bold flex items-center gap-2"><div className="w-4 h-3 bg-[#E6B34D] border border-[#D59D30] rounded-sm"></div> My Pictures</div>
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm font-bold flex items-center gap-2"><Cpu size={14}/> My Computer</div>
                  <div className="border-t border-[#9CBCE6] my-1"></div>
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm">Control Panel</div>
                  <div className="p-2 hover:bg-[#316AC5] hover:text-white cursor-pointer rounded-sm">Help and Support</div>
               </div>
            </div>
            <div className="bg-blue-600 p-2 flex justify-end items-center gap-2 border-t-2 border-orange-500 text-white text-xs">
               <button className="flex items-center gap-1 hover:brightness-125 transition-all" onClick={() => setLoggedIn(false)}><div className="bg-[#E64228] p-1 rounded-sm border border-white/50"><Power size={10}/></div> Log Off</button>
            </div>
         </div>
      )}
    </div>
  );
}
