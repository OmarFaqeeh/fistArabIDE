import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Button, CircularProgress, Avatar, Popover, Divider, alpha } from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import SendIcon from '@mui/icons-material/Send';

const API_URL = '/api';

const Network = () => {
  const [lang, setLang] = useState("ar");
  const [status, setStatus] = useState("...");
  const [messages, setMessages] = useState([]); 
  const [userData, setUserData] = useState({ 
    name: 'Developer', 
    description: '', 
    profileImage: '', 
    themeColor: '#3b82f6' 
  });
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const isPopoverOpen = Boolean(anchorEl);

  const textInputRef = useRef(null);
  const wsRef = useRef(null);
  const logRef = useRef(null);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const localData = localStorage.getItem('userData');
        if (!localData) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(localData);
        const userId = user.id || user.email.replace(/[@.]/g, '_');

        const response = await fetch(`${API_URL}/users/${userId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setUserData({
              name: result.data.name || 'Developer',
              description: result.data.description || 'LionScript Developer',
              profileImage: result.data.profileImage || '',
              themeColor: result.data.themeColor || '#3b82f6'
            });
            setLang(result.data.language || 'ar');
          }
        }
      } catch (err) {
        console.error('❌ خطأ في جلب البيانات:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (loading) return;

    // البحث عن البورت من health API
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
      return 3003; // افتراضي
    };

    const connectWebSocket = async () => {
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

      ws.onclose = () => setStatus("disconnected");

      ws.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          if (msg.type !== "system") {
            setMessages((prev) => [...prev, msg]);
          }
        } catch (err) {
          console.error("Parse Error", err);
        }
      };
    };

    connectWebSocket();

    return () => wsRef.current?.close();
  }, [userData.name, loading]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    const text = textInputRef.current?.value.trim();
    if (!text || !wsRef.current) return;
    
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "chat", text }));
      textInputRef.current.value = "";
    }
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
            <Typography variant="caption" sx={{ color: userData.themeColor }}>
              {status === "connected" ? "متصل بالشبكة" : "منقطع"}
            </Typography>
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
        {messages.map((m, i) => {
          const isMe = m.name === userData.name;
          return (
            <Box key={i} sx={{ 
              display: "flex", flexDirection: "column", 
              alignItems: isMe ? "flex-end" : "flex-start",
              maxWidth: "80%", alignSelf: isMe ? "flex-end" : "flex-start"
            }}>
              <Typography variant="caption" sx={{ color: "#475569", mb: 0.5, mx: 1 }}>
                {isMe ? (lang === 'ar' ? 'أنت' : 'You') : m.name}
              </Typography>
              <Box sx={{ 
                p: 2, borderRadius: isMe ? "20px 4px 20px 20px" : "4px 20px 20px 20px",
                bgcolor: isMe ? userData.themeColor : "#0f172a",
                border: isMe ? "none" : "1px solid #1e293b",
                boxShadow: isMe ? `0 4px 15px ${alpha(userData.themeColor, 0.2)}` : "none"
              }}>
                <Typography variant="body2" sx={{ color: "#fff", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {m.text}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ p: 3, bgcolor: "rgba(2, 6, 23, 0.8)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Box sx={{ 
          maxWidth: "1000px", margin: "0 auto", display: "flex", gap: 2, alignItems: "center",
          bgcolor: "#0f172a", p: 1, borderRadius: "16px", border: "1px solid #1e293b"
        }}>
          <input
            ref={textInputRef}
            placeholder="اكتب رسالة..."
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