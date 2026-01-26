import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, CircularProgress, Avatar, Popover, Divider, alpha } from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import SendIcon from '@mui/icons-material/Send';

const API_URL = '/api';
const LOCAL_KEY = 'chatMessages';
const USER_LOCAL_KEY = 'userData';

const Network = () => {
  const [lang, setLang] = useState("ar");
  const [status, setStatus] = useState("...");
  const [messages, setMessages] = useState([]); // كل الرسائل المحمّلة من DB أو محليًا
  const [userData, setUserData] = useState({
    name: 'Developer',
    description: '',
    profileImage: '',
    themeColor: '#3b82f6',
    language: 'ar'
  });
  const [loading, setLoading] = useState(true);

  // Popover for header avatar
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);

  // Popover for message avatars
  const [msgAnchor, setMsgAnchor] = useState({ anchorEl: null, message: null });
  const isMsgPopoverOpen = Boolean(msgAnchor.anchorEl);

  const textInputRef = useRef(null);
  const wsRef = useRef(null);
  const logRef = useRef(null);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);

  const handleMsgAvatarClick = (event, message) => {
    event.stopPropagation?.();
    setMsgAnchor({ anchorEl: event.currentTarget, message });
  };
  const handleMsgAvatarClose = () => setMsgAnchor({ anchorEl: null, message: null });

  // helper: generate clientId
  const generateClientId = () => `${Date.now()}_${Math.random().toString(36).slice(2,9)}`;

  // helper: format timestamp according to user's language (or message language if present)
  const formatTime = (ts, messageLang) => {
    if (!ts) return "";
    try {
      const locale = messageLang || userData.language || 'en';
      const d = new Date(Number(ts));
      return d.toLocaleString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return new Date(Number(ts)).toLocaleString();
    }
  };

  // Save messages to localStorage (centralized)
  const saveMessagesToLocal = (arr) => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(arr));
    } catch (err) {
      console.error('Failed to save messages to localStorage', err);
    }
  };

  // Load messages from localStorage
  const loadMessagesFromLocal = () => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch (err) {
      console.error('Failed to load messages from localStorage', err);
      return [];
    }
  };

  // عند التركيب: حمّل الرسائل من localStorage فوراً حتى لو السيرفر غير متاح
  useEffect(() => {
    const localMsgs = loadMessagesFromLocal();
    if (localMsgs.length > 0) {
      setMessages(localMsgs);
    }
  }, []);

  // Whenever messages change, persist them
  useEffect(() => {
    saveMessagesToLocal(messages);
  }, [messages]);

  // fetch user data from localStorage and server
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const localData = localStorage.getItem(USER_LOCAL_KEY);
        if (!localData) {
          setLoading(false);
          return;
        }
        const user = JSON.parse(localData);
        const userId = user.id || (user.email ? user.email.replace(/[@.]/g, '_') : 'unknown');

        // fetch from API users endpoint
        try {
          const response = await fetch(`${API_URL}/users/${userId}`);
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              setUserData(prev => ({
                ...prev,
                name: result.data.name || prev.name,
                description: result.data.description || prev.description,
                profileImage: result.data.profileImage || prev.profileImage,
                themeColor: result.data.themeColor || prev.themeColor,
                language: result.data.language || prev.language
              }));
              setLang(result.data.language || user.language || 'ar');
            } else {
              // fallback to local
              setUserData(prev => ({ ...prev, ...user }));
              setLang(user.language || user.lang || prev.language || 'ar');
            }
          } else {
            setUserData(prev => ({ ...prev, ...user }));
            setLang(user.language || user.lang || prev.language || 'ar');
          }
        } catch (err) {
          // in case fetch fails, use local
          setUserData(prev => ({ ...prev, ...user }));
          setLang(user.language || user.lang || prev.language || 'ar');
        }
      } catch (err) {
        console.error('❌ خطأ في جلب بيانات المستخدم:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // load recent messages from DB when userData loaded (merge with local, avoid duplicates)
  useEffect(() => {
    if (loading) return;

    const loadMessagesFromDB = async () => {
      try {
        const res = await fetch(`${API_URL}/chat?limit=200`);
        if (!res.ok) throw new Error('Failed to fetch chat from API');
        const data = await res.json();
        // data could be array or { success, data: [...] }
        const rawArr = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
        if (!rawArr || rawArr.length === 0) return;

        // normalize incoming
        const normalized = rawArr.map(m => ({
          id: m.id || m._id || `${m.timestamp || Date.now()}_${Math.random()}`,
          clientId: m.clientId || null,
          name: m.name || 'Unknown',
          text: m.text || m.content || '',
          timestamp: Number(m.timestamp || m.createdAt || Date.now()),
          profileImage: m.profileImage || '',
          themeColor: m.themeColor || '#64748b',
          description: m.description || '',
          language: m.language || userData.language || 'en'
        }));

        // merge with existing local messages (keep order ascending by timestamp)
        setMessages(prev => {
          // build map keyed by id or clientId or text+name+timestamp
          const map = new Map();
          // add local messages first
          prev.forEach(m => {
            const key = m.id || m.clientId || `${m.name}_${m.text}_${m.timestamp || m.sentAt || 0}`;
            map.set(key, m);
          });
          // add server messages (override duplicates based on id or clientId)
          normalized.forEach(m => {
            const keyById = m.id;
            const keyByClient = m.clientId || null;
            if (keyByClient) {
              // try to find local pending by clientId and replace
              const localKey = [...map.keys()].find(k => {
                const val = map.get(k);
                return val && val.clientId === keyByClient;
              });
              if (localKey) {
                map.delete(localKey);
              }
              map.set(`id_${m.id}`, m);
            } else if (map.has(keyById)) {
              map.set(keyById, m);
            } else {
              const key = `id_${m.id}`;
              map.set(key, m);
            }
          });

          // convert map to array and sort by timestamp
          const merged = Array.from(map.values())
            .map(x => {
              // ensure timestamp field exists
              return {
                ...x,
                timestamp: Number(x.timestamp || x.sentAt || Date.now())
              };
            })
            .sort((a,b) => (a.timestamp || 0) - (b.timestamp || 0));

          // persist to localStorage via effect
          return merged;
        });

      } catch (err) {
        console.warn('Could not load messages from DB, keeping local messages:', err);
        // nothing else — local messages already loaded earlier
      }
    };

    loadMessagesFromDB();
  }, [loading, userData.language]);

  // WebSocket connect and message handling (keeps local store updated)
  useEffect(() => {
    if (loading) return;

    const findPort = async () => {
      const ports = [3001, 3002, 3003, 3004, 3005];
      for (const port of ports) {
        try {
          const res = await fetch(`http://localhost:${port}/api/health`);
          if (res.ok) return port;
        } catch (err) {
          continue;
        }
      }
      return 3003;
    };

    let closed = false;
    const connectWebSocket = async () => {
      try {
        const port = await findPort();
        const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
        const ws = new WebSocket(`${protocol}//localhost:${port}`);
        wsRef.current = ws;

        ws.onopen = () => {
          setStatus("connected");
          if (userData.name) {
            ws.send(JSON.stringify({ type: "set_name", name: userData.name }));
          }
        };

        ws.onclose = () => {
          setStatus("disconnected");
          if (!closed) {
            // try reconnect after short delay
            setTimeout(() => connectWebSocket(), 3000);
          }
        };

        ws.onmessage = (e) => {
          try {
            const raw = JSON.parse(e.data);
            if (raw.type === 'system') return;

            const incoming = {
              id: raw.id || raw._id || `${Date.now()}_${Math.random().toString(36).slice(2,9)}`,
              clientId: raw.clientId || null,
              name: raw.name || 'Unknown',
              text: raw.text || raw.content || '',
              timestamp: Number(raw.timestamp || raw.createdAt || Date.now()),
              profileImage: raw.profileImage || '',
              themeColor: raw.themeColor || '#64748b',
              description: raw.description || '',
              language: raw.language || userData.language || 'en'
            };

            setMessages(prev => {
              // try match pending by clientId
              const arr = [...prev];
              let matchedIndex = -1;
              if (incoming.clientId) {
                matchedIndex = arr.findIndex(m => m.clientId === incoming.clientId && m.pending);
              }
              if (matchedIndex === -1) {
                matchedIndex = arr.findIndex(m =>
                  m.pending &&
                  m.name === incoming.name &&
                  m.text === incoming.text &&
                  (Date.now() - (m.sentAt || m.timestamp || 0) < 10000)
                );
              }
              if (matchedIndex !== -1) {
                arr[matchedIndex] = {
                  id: incoming.id,
                  clientId: incoming.clientId || null,
                  name: incoming.name,
                  text: incoming.text,
                  timestamp: incoming.timestamp,
                  profileImage: incoming.profileImage,
                  themeColor: incoming.themeColor,
                  description: incoming.description,
                  language: incoming.language
                };
                return arr;
              }

              // avoid duplicates
              const exists = arr.find(m => m.id === incoming.id ||
                (m.name === incoming.name && m.text === incoming.text && Math.abs((m.timestamp || m.sentAt || 0) - incoming.timestamp) < 2000)
              );
              if (exists) return arr;

              arr.push({
                id: incoming.id,
                clientId: incoming.clientId || null,
                name: incoming.name,
                text: incoming.text,
                timestamp: incoming.timestamp,
                profileImage: incoming.profileImage,
                themeColor: incoming.themeColor,
                description: incoming.description,
                language: incoming.language
              });
              return arr;
            });
          } catch (err) {
            console.error("WS parse error", err);
          }
        };
      } catch (err) {
        console.warn('WS connection failed (ignored):', err);
      }
    };

    connectWebSocket();

    return () => {
      closed = true;
      wsRef.current?.close();
    };
  }, [userData.name, loading]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  // send message: optimistic local save + try WS + persist to DB
  const handleSend = async () => {
    const text = textInputRef.current?.value.trim();
    if (!text) return;

    const clientId = generateClientId();
    const now = Date.now();
    const language = userData.language || lang || 'en';

    const optimistic = {
      clientId,
      pending: true,
      name: userData.name,
      text,
      timestamp: now,
      sentAt: now,
      profileImage: userData.profileImage || '',
      themeColor: userData.themeColor || '#3b82f6',
      description: userData.description || '',
      language
    };

    // add locally and save to localStorage (immediate)
    setMessages(prev => {
      const next = [...prev, optimistic];
      saveMessagesToLocal(next);
      return next;
    });
    textInputRef.current.value = "";

    // broadcast through websocket (if available)
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: "chat",
          text,
          clientId,
          name: userData.name,
          profileImage: userData.profileImage,
          themeColor: userData.themeColor,
          description: userData.description,
          language
        }));
      }
    } catch (err) {
      console.warn("WS send failed", err);
    }

    // persist to DB via REST API
    try {
      const payload = {
        clientId,
        name: userData.name,
        text,
        timestamp: now,
        language,
        profileImage: userData.profileImage || '',
        themeColor: userData.themeColor || '#3b82f6',
        description: userData.description || ''
      };

      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const saved = await res.json();
        const serverMsg = (saved && saved.data) ? saved.data : (saved && saved.id ? saved : saved);

        const normalized = {
          id: serverMsg.id || serverMsg._id || `${serverMsg.timestamp || Date.now()}_${Math.random()}`,
          clientId: serverMsg.clientId || clientId,
          name: serverMsg.name || payload.name,
          text: serverMsg.text || payload.text,
          timestamp: Number(serverMsg.timestamp || serverMsg.createdAt || payload.timestamp),
          profileImage: serverMsg.profileImage || payload.profileImage,
          themeColor: serverMsg.themeColor || payload.themeColor,
          description: serverMsg.description || payload.description,
          language: serverMsg.language || payload.language
        };

        // replace pending local by matching clientId
        setMessages(prev => {
          const arr = [...prev];
          const idx = arr.findIndex(m => m.clientId === clientId && m.pending);
          if (idx !== -1) {
            arr[idx] = normalized;
            saveMessagesToLocal(arr);
            return arr;
          }
          // if not found, append if not duplicate
          const exists = arr.find(m => m.id === normalized.id || (m.name === normalized.name && m.text === normalized.text && Math.abs((m.timestamp||0) - normalized.timestamp) < 2000));
          if (!exists) arr.push(normalized);
          saveMessagesToLocal(arr);
          return arr;
        });
      } else {
        // mark failed
        setMessages(prev => {
          const arr = prev.map(m => m.clientId === clientId ? { ...m, pending: false, failed: true } : m);
          saveMessagesToLocal(arr);
          return arr;
        });
      }
    } catch (err) {
      console.error('Failed to persist message to API', err);
      setMessages(prev => {
        const arr = prev.map(m => m.clientId === clientId ? { ...m, pending: false, failed: true } : m);
        saveMessagesToLocal(arr);
        return arr;
      });
    }
  };

  // clear messages both locally (and optionally DB)
  const handleClearMessages = async () => {
    setMessages([]);
    saveMessagesToLocal([]);
    localStorage.removeItem(LOCAL_KEY);
    // optional: call API to clear DB if you have endpoint
  };

  if (loading) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#020617' }}>
        <CircularProgress sx={{ color: userData.themeColor }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      height: "100vh",
      bgcolor: "#020617",
      display: "flex",
      flexDirection: "column",
      color: "#f8fafc",
      direction: lang === 'ar' ? 'rtl' : 'ltr',
      overflow: "hidden",
      position: 'relative'
    }}>

      <Box sx={{
        p: 2, px: 4, display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.05)", bgcolor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(10px)", zIndex: 1
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CodeIcon sx={{ color: userData.themeColor, fontSize: 30 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: -0.5 }}>LIONSCRIPT</Typography>
        </Box>

        <Box
          onClick={handleAvatarClick}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 0.8,
            bgcolor: '#0f172a', borderRadius: '12px', border: `1px solid ${alpha(userData.themeColor, 0.3)}`,
            cursor: 'pointer', transition: '0.2s', '&:hover': { bgcolor: '#1e293b' }
          }}
        >
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>{userData.name}</Typography>
          <Avatar
            src={userData.profileImage}
            sx={{ width: 32, height: 32, border: `2px solid ${userData.themeColor}` }}
          />
        </Box>

        <Popover
          open={isPopoverOpen}
          anchorEl={anchorEl}
          onClose={handleAvatarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          PaperProps={{
            sx: {
              mt: 1.5, width: 280, bgcolor: '#0f172a', color: 'white',
              border: '1px solid #1e293b', borderRadius: '16px', p: 3,
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)', backgroundImage: 'none'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Avatar
              src={userData.profileImage}
              sx={{ width: 80, height: 80, mb: 2, border: `3px solid ${userData.themeColor}`, boxShadow: `0 0 20px ${alpha(userData.themeColor, 0.2)}` }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{userData.name}</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mt: 1, fontStyle: 'italic' }}>
              {userData.description}
            </Typography>
            <Divider sx={{ width: '100%', my: 2, bgcolor: '#1e293b' }} />
            <Typography variant="caption" sx={{ color: userData.themeColor, mb: 2 }}>
              {status === "connected" ? "متصل بالشبكة" : "منقطع"}
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearMessages}
              size="small"
              sx={{
                color: '#ef4444',
                borderColor: '#ef4444',
                '&:hover': {
                  bgcolor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: '#dc2626'
                }
              }}
            >
              Delete all messages
            </Button>
          </Box>
        </Popover>
      </Box>

      <Box
        ref={logRef}
        sx={{
          flex: 1, overflowY: "auto", p: { xs: 2, md: 4 }, display: "flex", flexDirection: "column", gap: 2,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#1e293b', borderRadius: '10px' }
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: '#475569'
          }}>
            <Typography variant="body2">There are no messages yet...</Typography>
          </Box>
        ) : (
          messages.map((m, i) => {
            const isMe = m.name === userData.name;

            // avatar display: use profileImage if exists else initial with theme color
            const avatarSx = {
              width: 40,
              height: 40,
              fontWeight: 700,
              bgcolor: (isMe ? (userData.themeColor || '#3b82f6') : (m.themeColor || '#0f172a')),
              border: isMe ? `2px solid ${alpha(userData.themeColor, 1)}` : '1px solid rgba(255,255,255,0.03)'
            };

            return (
              <Box key={m.id || m.clientId || i} sx={{
                display: "flex",
                flexDirection: isMe ? "row-reverse" : "row",
                alignItems: "flex-start",
                maxWidth: "80%",
                alignSelf: isMe ? "flex-end" : "flex-start",
                gap: 1
              }}>
                {/* Avatar column */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                  <Box
                    onClick={(e) => handleMsgAvatarClick(e, m)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {m.profileImage ? (
                      <Avatar src={m.profileImage} sx={avatarSx} />
                    ) : (
                      <Avatar sx={avatarSx}>
                        {(m.name || userData.name || 'U').charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                  </Box>
                </Box>

                {/* Message bubble + meta */}
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="caption" sx={{ color: "#475569", mb: 0.5 }}>
                      {isMe ? (lang === 'ar' ? 'you' : 'You') : m.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#475569", mb: 0.5 }}>
                      • {formatTime(m.timestamp || m.sentAt || m.sentAt, m.language)}
                    </Typography>
                  </Box>
                  <Box sx={{
                    p: 2, borderRadius: isMe ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                    bgcolor: isMe ? userData.themeColor : "#0f172a",
                    border: isMe ? "none" : "1px solid #1e293b",
                    boxShadow: isMe ? `0 4px 15px ${alpha(userData.themeColor, 0.2)}` : "none",
                    maxWidth: '720px',
                    wordBreak: 'break-word',
                    opacity: m.pending ? 0.85 : 1 // slight visual cue for pending messages
                  }}>
                    <Typography variant="body2" sx={{ color: "#fff", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                      {m.text}
                    </Typography>
                    {m.failed && <Typography variant="caption" sx={{ color: '#f87171', mt: 1 }}>Failed to save</Typography>}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>

      {/* Popover for message avatars */}
      <Popover
        open={isMsgPopoverOpen}
        anchorEl={msgAnchor.anchorEl}
        onClose={handleMsgAvatarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{
          sx: {
            mt: 1.5, width: 260, bgcolor: '#0f172a', color: 'white',
            border: '1px solid #1e293b', borderRadius: '14px', p: 2
          }
        }}
      >
        {msgAnchor.message && (() => {
          const m = msgAnchor.message;
          const isMsgFromMe = m.name === userData.name;
          const displayName = isMsgFromMe ? userData.name : (m.name || 'Unknown');
          const displayDesc = isMsgFromMe ? (userData.description || '') : (m.description || 'No description');
          const displayProfile = isMsgFromMe ? userData.profileImage : m.profileImage;
          const displayColor = isMsgFromMe ? userData.themeColor : (m.themeColor || '#64748b');

          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Avatar
                src={displayProfile}
                sx={{ width: 64, height: 64, mb: 1.5, border: `3px solid ${displayColor}`, bgcolor: displayProfile ? undefined : displayColor }}
              >
                {!displayProfile && (displayName.charAt(0) || 'U').toUpperCase()}
              </Avatar>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{displayName}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5, fontStyle: 'italic' }}>
                {displayDesc}
              </Typography>
              <Divider sx={{ width: '100%', my: 1.5, bgcolor: '#1e293b' }} />
              <Typography variant="caption" sx={{ color: displayColor }}>
                {isMsgFromMe ? 'This is you' : 'View user info'}
              </Typography>
            </Box>
          );
        })()}
      </Popover>

      <Box sx={{ p: 3, bgcolor: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{
          maxWidth: "1000px", margin: "0 auto", display: "flex", gap: 2, alignItems: "center",
          bgcolor: "#0f172a", p: 1, borderRadius: "16px", border: "1px solid #1e293b"
        }}>
          <input
            ref={textInputRef}
            placeholder="Write a letter..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={{
              flex: 1, background: "transparent", border: "none", color: "white",
              padding: "12px 16px", outline: "none", fontSize: "1rem"
            }}
          />
          <Button
            variant="contained" onClick={handleSend}
            sx={{
              borderRadius: "12px", minWidth: "50px", height: "50px",
              bgcolor: userData.themeColor, '&:hover': { opacity: 0.9 }
            }}
          >
            <SendIcon sx={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }} />
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Network;