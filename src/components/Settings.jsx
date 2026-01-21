import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Switch, FormControlLabel, Grid, CircularProgress, Alert } from '@mui/material';
import { useApp } from '../contexts/AppContext';
import { themeOptions } from '../theme';

const API_URL = '/api';

const Settings = () => {
    const { language, toggleLanguage, themeMode, changeTheme, t } = useApp();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [success, setSuccess] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserSettings = async () => {
            setInitialLoading(true);
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    setInitialLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                if (!user.email && !user.id) {
                    setInitialLoading(false);
                    return;
                }

                const id = user.id || user.email.replace(/[@.]/g, '_');
                setUserId(id);

                const response = await fetch(`${API_URL}/users/${id}`);
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success && result.data) {
                        const savedLang = result.data.language || 'ar';
                        if (savedLang !== language) {
                            toggleLanguage();
                        }

                        const savedColor = result.data.themeColor;
                        if (savedColor) {
                            const themeMap = {
                                '#007FFF': 'deepBlue',
                                '#FF0055': 'cyberRed',
                                '#00FF99': 'neonGreen',
                                '#B026FF': 'voidPurple',
                                '#FFD700': 'goldenEra',
                            };
                            const mappedTheme = themeMap[savedColor] || 'deepBlue';
                            if (mappedTheme !== themeMode) {
                                changeTheme(mappedTheme);
                            }
                        }

                        console.log('✅ تم جلب الإعدادات من Firebase:', result.data);
                    }
                }
            } catch (err) {
                console.error('❌ خطأ في جلب الإعدادات:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchUserSettings();
    }, []);

    const handleLanguageChange = async () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        
        if (userId) {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ language: newLang })
                });

                if (response.ok) {
                    toggleLanguage();
                    setSuccess(language === 'ar' ? 'Language saved ✅' : 'تم حفظ اللغة ✅');
                    setTimeout(() => setSuccess(''), 2000);
                }
            } catch (err) {
                console.error('خطأ في حفظ اللغة:', err);
            } finally {
                setLoading(false);
            }
        } else {
            toggleLanguage();
        }
    };

    const handleThemeChange = async (themeId) => {
        const selectedTheme = themeOptions.find(t => t.id === themeId);
        
        if (userId && selectedTheme) {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/users/${userId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ themeColor: selectedTheme.primary })
                });

                if (response.ok) {
                    changeTheme(themeId);
                    setSuccess(language === 'ar' ? 'تم حفظ الثيم ✅' : 'Theme saved ✅');
                    setTimeout(() => setSuccess(''), 2000);
                }
            } catch (err) {
                console.error('خطأ في حفظ الثيم:', err);
            } finally {
                setLoading(false);
            }
        } else {
            changeTheme(themeId);
        }
    };

    if (initialLoading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h2" sx={{ mb: 4 }}>{t('settings.title')}</Typography>

            {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {success}
                </Alert>
            )}

            <Paper sx={{ p: 4, mb: 4, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="h6" gutterBottom color="primary">{t('settings.lang')}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={language === 'ar'}
                                onChange={handleLanguageChange}
                                color="primary"
                                disabled={loading}
                            />
                        }
                        label={language === 'en' ? 'English (Default)' : 'العربية (Arabic)'}
                    />
                    {loading && <CircularProgress size={20} />}
                </Box>
            </Paper>

            <Paper sx={{ p: 4, bgcolor: 'background.paper', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Typography variant="h6" gutterBottom color="primary">{t('settings.theme')}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {t('settings.themeDesc')}
                </Typography>

                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}

                <Grid container spacing={3}>
                    {themeOptions.map((theme) => (
                        <Grid item key={theme.id}>
                            <Box
                                onClick={() => !loading && handleThemeChange(theme.id)}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 2,
                                    bgcolor: theme.primary,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1,
                                    border: themeMode === theme.id ? `4px solid #fff` : '4px solid transparent',
                                    outline: themeMode === theme.id ? `4px solid ${theme.primary}` : 'none',
                                    boxShadow: themeMode === theme.id ? `0 0 25px ${theme.primary}` : 'none',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: loading ? 'none' : 'scale(1.1)',
                                    }
                                }}
                            />
                            <Typography 
                                align="center" 
                                variant="caption" 
                                display="block" 
                                sx={{ 
                                    mt: 1, 
                                    color: themeMode === theme.id ? theme.primary : 'text.secondary', 
                                    fontWeight: themeMode === theme.id ? 'bold' : 'normal' 
                                }}
                            >
                                {theme.name}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default Settings;