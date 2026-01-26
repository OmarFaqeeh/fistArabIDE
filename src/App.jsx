import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider, CssBaseline, Box } from '@mui/material';

import { getTheme } from './theme';

import { AppProvider, useApp } from './contexts/AppContext';



import Header from './components/Header';

import Home from './components/Home'; // إضافة استيراد صفحة الهومي

import SelectPath from './components/SelectPath';

import Network from './components/Network';

import Files from './components/Files';

import Profile from './components/Profile';

import Settings from './components/Settings';

import Challenges from './components/Challenges';

import Auth from './components/login';

import ChallengeDetail from './components/ChallengeDetail';

import CodeEditor from './CodeEditor';



// شاشة الترحيب

const SplashScreen = () => {

return (

<Box

sx={{

display: 'flex',

alignItems: 'center',

justifyContent: 'center',

minHeight: '100vh',

bgcolor: '#020617',

flexDirection: 'column',

gap: 4,

animation: 'upDown 1s ease-in-out infinite',

'@keyframes upDown': {

'0%, 100%': { transform: 'translateY(0)' },

'50%': { transform: 'translateY(-20px)' }

}

}}

>

<Box

sx={{

width: 170,

height: 170,

borderRadius: '50px',

overflow: 'hidden',

boxShadow: '0 0 40px rgba(59, 130, 246, 0.5)',

border: '3px solid #3b82f6'

}}

>

<img

src="/src/assets/lion-logo.jpg"

alt="LionScript Logo"

style={{

width: '100%',

height: '100%',

objectFit: 'cover'

}}

/>

</Box>



<Box

sx={{

textAlign: 'center',

color: 'white',

fontSize: '2rem',

fontWeight: 600,

letterSpacing: '0.4px',

fontFamily: '"JetBrains Mono", monospace'

}}

>

Welcome to <span style={{ color: '#3b82f6' }}>LionScript</span>

</Box>

</Box>

);

};



const AppContent = () => {

const [sidebarWidth, setSidebarWidth] = useState(250);

const [showSplash, setShowSplash] = useState(true);



const [isLoggedIn, setIsLoggedIn] = useState(() => {

return localStorage.getItem('isLoggedIn') === 'true';

});



const [user, setUser] = useState(() => {

const savedUser = localStorage.getItem('user');

return savedUser ? JSON.parse(savedUser) : null;

});



const { themeMode } = useApp();

const currentTheme = getTheme(themeMode);



// إظهار شاشة الترحيب لمدة ثانيتين

useEffect(() => {

const timer = setTimeout(() => {

setShowSplash(false);

}, 2000);



return () => clearTimeout(timer);

}, []);



const handleLogin = (userData) => {

setUser(userData);

setIsLoggedIn(true);

localStorage.setItem('isLoggedIn', 'true');

localStorage.setItem('user', JSON.stringify(userData));

};



const handleLogout = () => {

setIsLoggedIn(false);

setUser(null);

localStorage.removeItem('isLoggedIn');

localStorage.removeItem('user');

};



// إذا كانت شاشة الترحيب ظاهرة

if (showSplash) {

return (

<ThemeProvider theme={currentTheme}>

<CssBaseline />

<SplashScreen />

</ThemeProvider>

);

}



// إذا لم يكن المستخدم مسجل دخول

if (!isLoggedIn) {

return (

<ThemeProvider theme={currentTheme}>

<CssBaseline />

<Auth onLogin={handleLogin} />

</ThemeProvider>

);

}



// إذا كان مسجل دخول - عرض التطبيق الرئيسي

return (

<ThemeProvider theme={currentTheme}>

<CssBaseline />

<Router>

<Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

<Header width={sidebarWidth} setWidth={setSidebarWidth} onLogout={handleLogout} />

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



<Route path="/" element={<Home />} />

<Route path="/select-path" element={<SelectPath />} />

<Route path="/challenges/:pathId" element={<Challenges />} />

<Route path="/challenges/:pathId/:challengeId" element={<ChallengeDetail />} />

<Route path="/network" element={<Network />} />

<Route path="/files" element={<Files />} />

<Route path="/profile" element={<Profile />} />

<Route path="/settings" element={<Settings />} />

<Route path="/editor" element={<CodeEditor />} /> {/* إضافة الراوت هنا */}


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