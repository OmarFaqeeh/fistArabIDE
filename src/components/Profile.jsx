import React, { useState, useEffect } from 'react';
import { Box, Typography, Avatar, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import avatarImage from '../assets/avatar.png';

const API_URL = '/api';

const Profile = () => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    setError('يرجى تسجيل الدخول أولاً');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                const id = user.id || user.email.replace(/[@.]/g, '_');
                setUserId(id);

                const response = await fetch(`${API_URL}/users/${id}`);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        setName(result.data.name || "Developer");
                        setBio(result.data.description || "LionScript Developer");
                    }
                }
            } catch (err) {
                console.error('خطأ في جلب بيانات البروفايل:', err);
                setError('فشل في تحميل بيانات الملف الشخصي');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSaveProfile = async () => {
        if (!userId) return;

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: name,
                    description: bio 
                })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('تم حفظ الملف الشخصي بنجاح ✅');
                const userData = JSON.parse(localStorage.getItem('userData'));
                localStorage.setItem('userData', JSON.stringify({ ...userData, name }));
                
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError('حدث خطأ أثناء الحفظ');
            }
        } catch (err) {
            console.error('خطأ في الحفظ:', err);
            setError('فشل الاتصال بالسيرفر');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2" sx={{ mb: 4, alignSelf: 'flex-start' }}>PROFILE</Typography>

            {success && <Alert severity="success" sx={{ mb: 2, width: '100%', maxWidth: '600px' }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2, width: '100%', maxWidth: '600px' }}>{error}</Alert>}

            <Paper
                elevation={4}
                sx={{
                    p: 6,
                    maxWidth: '600px',
                    width: '100%',
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(0, 127, 255, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    <Avatar
                        src={avatarImage}
                        sx={{
                            width: 120,
                            height: 120,
                            bgcolor: 'primary.main',
                            boxShadow: '0 0 20px rgba(0, 127, 255, 0.5)'
                        }}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Codename (Name)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="Bio / Status"
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    variant="outlined"
                />

                <Button 
                    variant="contained" 
                    size="large" 
                    fullWidth
                    startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                >
                    {saving ? 'Saving...' : 'Save Profile'}
                </Button>
            </Paper>
        </Box>
    );
};

export default Profile;