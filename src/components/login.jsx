import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  IconButton,
  InputAdornment,
  alpha,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  CircularProgress,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CodeIcon from '@mui/icons-material/Code';

const API_URL = 'http://localhost:3001/api';

const Auth = ({ onLogin }) => {
  const [mode, setMode] = useState('login');
  const [lang, setLang] = useState('ar');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [createData, setCreateData] = useState({ 
    name: '', 
    email: '', 
    password: '' 
  });

  const content = {
    en: {
      title: 'Lion',
      titleSuffix: 'Script',
      subtitle: 'NEXT GEN IDE FOR DEVELOPERS',
      welcome: 'Welcome Back',
      welcomeSub: 'Please enter your details to sign in.',
      emailLabel: 'Email Address',
      passLabel: 'Password',
      nameLabel: 'Full Name',
      signInBtn: 'Sign In',
      noAccount: "Don't have an account?",
      createLink: 'Create one',
      createTitle: 'Join LionScript',
      createBtn: 'Create Account',
      footer: '© 2026 LIONSCRIPT CLOUD ENVIRONMENT',
      dir: 'ltr'
    },
    ar: {
      title: 'أسد',
      titleSuffix: 'الكود',
      subtitle: 'الجيل القادم من بيئات التطوير',
      welcome: 'مرحباً بك مجدداً',
      welcomeSub: 'أدخل بياناتك لتسجيل الدخول للمنصة',
      emailLabel: 'البريد الإلكتروني',
      passLabel: 'كلمة المرور',
      nameLabel: 'الاسم الكامل',
      signInBtn: 'تسجيل الدخول',
      noAccount: 'لا تملك حساباً؟',
      createLink: 'إنشاء حساب جديد',
      createTitle: 'انضم إلى أسود الكود',
      createBtn: 'تأكيد الحساب',
      footer: '© 2026 بيئة أسد الكود السحابية',
      dir: 'rtl'
    }
  };

  const t = content[lang];

  // تسجيل الدخول
  const handleLoginSubmit = async (e) => {
  e.preventDefault();
  if (!loginData.email || !loginData.password) return;
  
  setLoading(true);
  setError('');
  
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // إضافة email للبيانات
      const userData = {
        ...result.data,
        email: loginData.email
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      onLogin(userData);
    } else {
      setError(result.error || 'فشل تسجيل الدخول');
    }
  } catch (err) {
    setError('خطأ في الاتصال بالسيرفر');
  } finally {
    setLoading(false);
  }
};
  // إنشاء حساب جديد
 const handleCreateSubmit = async (e) => {
  e.preventDefault();
  if (!createData.name || !createData.email || !createData.password) return;
  
  setLoading(true);
  setError('');
  
  try {
    const userId = createData.email.replace(/[@.]/g, '_');
    
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: createData.name,
        description: 'LionScript Developer',
        email: createData.email,
        password: createData.password,
        themeColor: '#3b82f6',
        language: lang,
        code: 'console.log("Welcome to Lionscript !");'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // إضافة email للبيانات
      const userData = {
        ...result.data,
        email: createData.email
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      onLogin(userData);
    } else {
      setError(result.error || 'فشل إنشاء الحساب');
    }
  } catch (err) {
    setError('خطأ في الاتصال بالسيرفر');
  } finally {
    setLoading(false);
  }
};

  const textFieldSx = {
    mb: 2,
    direction: t.dir,
    '& label': { 
        color: '#64748b', 
        fontSize: '0.85rem',
        left: t.dir === 'rtl' ? 'auto' : 0,
        right: t.dir === 'rtl' ? 0 : 'auto',
        transformOrigin: t.dir === 'rtl' ? 'right' : 'left'
    },
    '& label.Mui-focused': { color: '#3b82f6' },
    '& .MuiOutlinedInput-root': {
      color: 'white',
      backgroundColor: alpha('#0f172a', 0.5),
      '& fieldset': { borderColor: '#1e293b', borderRadius: '12px', textAlign: t.dir === 'rtl' ? 'right' : 'left' },
      '&:hover fieldset': { borderColor: '#334155' },
      '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '1px' },
    },
    '& input': { textAlign: t.dir === 'rtl' ? 'right' : 'left' }
  };

  return (
    <Box sx={{
      height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', position: 'relative', backgroundColor: '#020617', direction: t.dir
    }}>
      {/* Background Glows */}
      <Box sx={{ position: 'absolute', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(30, 64, 175, 0.15) 0%, rgba(2, 6, 23, 0) 70%)', top: '-15%', right: '-10%', filter: 'blur(100px)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(2, 6, 23, 0) 70%)', bottom: '-10%', left: '-5%', filter: 'blur(80px)', zIndex: 0 }} />

      {/* Language Switcher */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <ToggleButtonGroup
          value={lang}
          exclusive
          onChange={(e, newLang) => newLang && setLang(newLang)}
          sx={{ border: '1px solid #1e293b', bgcolor: 'rgba(15, 23, 42, 0.5)' }}
        >
          <ToggleButton value="en" sx={{ color: 'white', px: 2, py: 0.5, '&.Mui-selected': { bgcolor: '#3b82f6', color: 'white' } }}>EN</ToggleButton>
          <ToggleButton value="ar" sx={{ color: 'white', px: 2, py: 0.5, '&.Mui-selected': { bgcolor: '#3b82f6', color: 'white' } }}>AR</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
             <CodeIcon sx={{ fontSize: 36, color: '#3b82f6' }} />
             <Typography variant="h4" sx={{ fontWeight: 800, color: '#f8fafc', fontFamily: lang === 'en' ? '"JetBrains Mono", monospace' : 'inherit' }}>
               {t.title}<span style={{ color: '#3b82f6' }}>{t.titleSuffix}</span>
             </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#475569', mt: 1, letterSpacing: lang === 'en' ? 1 : 0 }}>
            {t.subtitle}
          </Typography>
        </Box>

        <Paper elevation={0} sx={{
          p: 4, borderRadius: '24px', background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5' }}>
              {error}
            </Alert>
          )}

          {mode === 'login' ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc', mb: 1, textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.welcome}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 4, textAlign: t.dir === 'rtl' ? 'right' : 'left' }}>{t.welcomeSub}</Typography>

              <form onSubmit={handleLoginSubmit}>
                <TextField 
                  fullWidth 
                  label={t.emailLabel} 
                  required 
                  type="email" 
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} 
                  disabled={loading}
                  sx={textFieldSx} 
                />
                
                <TextField 
                  fullWidth 
                  label={t.passLabel} 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={loginData.password} 
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)} sx={{ color: '#475569' }}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }} 
                  sx={textFieldSx} 
                />

                <Button 
                  fullWidth 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                  sx={{
                    mt: 2, py: 1.5, borderRadius: '12px', bgcolor: '#3b82f6', fontWeight: 700,
                    '&:hover': { bgcolor: '#2563eb' }, boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.5)'
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t.signInBtn}
                </Button>

                <Button 
                  fullWidth 
                  variant="text" 
                  onClick={() => {
                    setMode('create');
                    setError('');
                  }} 
                  disabled={loading}
                  sx={{ mt: 2, color: '#64748b', textTransform: 'none' }}
                >
                  {t.noAccount} <span style={{ color: '#3b82f6', margin: '0 5px', fontWeight: 600 }}>{t.createLink}</span>
                </Button>
              </form>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexDirection: t.dir === 'rtl' ? 'row' : 'row' }}>
                <IconButton 
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }} 
                  disabled={loading}
                  sx={{ color: '#3b82f6', p: 0, mr: lang === 'en' ? 2 : 0, ml: lang === 'ar' ? 2 : 0 }}
                >
                  {lang === 'en' ? <ArrowBackIcon fontSize="small" /> : <ArrowForwardIcon fontSize="small" />}
                </IconButton>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#f8fafc' }}>{t.createTitle}</Typography>
              </Box>

              <form onSubmit={handleCreateSubmit}>
                <TextField 
                  fullWidth 
                  label={t.nameLabel} 
                  required 
                  value={createData.name}
                  onChange={(e) => setCreateData({...createData, name: e.target.value})}
                  disabled={loading}
                  sx={textFieldSx} 
                />
                <TextField 
                  fullWidth 
                  label={t.emailLabel} 
                  required 
                  type="email" 
                  value={createData.email}
                  onChange={(e) => setCreateData({...createData, email: e.target.value})}
                  disabled={loading}
                  sx={textFieldSx} 
                />
                <TextField 
                  fullWidth 
                  label={t.passLabel} 
                  required 
                  type={showPassword ? 'text' : 'password'}
                  value={createData.password}
                  onChange={(e) => setCreateData({...createData, password: e.target.value})}
                  disabled={loading}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)} sx={{ color: '#475569' }}>
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldSx} 
                />

                <Button 
                  fullWidth 
                  type="submit" 
                  variant="contained" 
                  startIcon={loading ? null : <PersonAddIcon />} 
                  disabled={loading}
                  sx={{
                    mt: 2, py: 1.5, borderRadius: '12px', bgcolor: '#3b82f6', fontWeight: 700, 
                    '&:hover': { bgcolor: '#2563eb' }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t.createBtn}
                </Button>
              </form>
            </>
          )}
        </Paper>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 4, color: '#334155' }}>{t.footer}</Typography>
      </Container>
    </Box>
  );
};

export default Auth;