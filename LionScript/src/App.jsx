import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LanguageProvider } from './contexts/LanguageContext';
import theme from './theme/theme';
import Header from './components/Header';
import Hero from './components/Hero';
import CodeSnippet from './components/CodeSnippet';
import Ecosystem from './components/Ecosystem';
import Timeline from './components/Timeline';
import JoinArmy from './components/JoinArmy';
import Developer from './components/Developer';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const Content = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-primary-main selection:text-white">
      <Header />
      <Hero />
      <CodeSnippet />
      <Ecosystem />
      <Timeline />
      <JoinArmy />
      <Developer />
      <FAQ />
      <Footer />
    </div>
  );
};

const SplashMessage = () => {
 return (
  <div className="splash-message flex items-center justify-center min-h-screen flex-col gap-4">
    <div style={{ width: 170, height: 170 }}>
      <img
        style={{ borderRadius: 50 }}
        src="/assets/lion-logo.jpg"
        alt="LionScript Logo"
        className="w-full h-full object-cover"
      />
    </div>

    <div className="splash-text text-center text-white text-2xl font-semibold">
      Welcome to LionScript
    </div>

    <style>{`
      .splash-message {
        animation: upDown 1s ease-in-out infinite;
        color: white;
      }

      @keyframes upDown {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
      }

      /* optional: ضبط المسافة والحجم للنص */
      .splash-text {
        letter-spacing: 0.4px;
      }
    `}</style>
  </div>
);
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showSplash ? <SplashMessage /> : <Content />}
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;