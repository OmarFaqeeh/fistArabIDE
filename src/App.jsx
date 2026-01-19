import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { getTheme } from './theme';
import { AppProvider, useApp } from './contexts/AppContext';

import Header from './components/Header';
import SelectPath from './components/SelectPath';
import Network from './components/Network';
import Files from './components/Files';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Challenges from './components/Challenges';
import Auth from './components/login';

const AppContent = () => {

  const [sidebarWidth, setSidebarWidth] = useState(250);
  
  // 1. قراءة حالة تسجيل الدخول من localStorage عند بداية التشغيل
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const { themeMode } = useApp();
  const currentTheme = getTheme(themeMode);

  // 2. دالة تسجيل الدخول وحفظ البيانات في المتصفح
  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); // حفظ الحالة
    localStorage.setItem('user', JSON.stringify(userData)); // حفظ بيانات المستخدم
  };

  // 3. دالة تسجيل الخروج (اختياري إذا أردت إضافتها لاحقاً في الإعدادات)
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Auth onLogin={handleLogin} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Header width={sidebarWidth} setWidth={setSidebarWidth} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: `calc(100% - ${sidebarWidth}px)`,
              height: '100vh',
              overflow: 'auto',
              bgcolor: 'background.default',
              transition: 'width 0.1s ease',
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/select-path" replace />} />
              <Route path="/select-path" element={<SelectPath />} />
              <Route path="/challenges/:pathId" element={<Challenges />} />
              <Route path="/network" element={<Network />} />
              <Route path="/files" element={<Files />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;