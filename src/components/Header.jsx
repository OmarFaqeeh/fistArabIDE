import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import HubIcon from '@mui/icons-material/Hub';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useApp } from '../contexts/AppContext';

const Header = ({ width, setWidth, onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language } = useApp();
    const isRTL = language === 'ar';

    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        const newWidth = isRTL 
            ? Math.max(150, Math.min(window.innerWidth - e.clientX, 500))
            : Math.max(150, Math.min(e.clientX, 500));
        setWidth(newWidth);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const menuItems = [
        { text: t('home') || (isRTL ? 'الرئيسية' : 'Home'), icon: <HomeIcon />, path: '/' },
        { text: t('selectPath'), icon: <CodeIcon />, path: '/select-path' },
        { text: t('network'), icon: <HubIcon />, path: '/network' },
        { text: t('files'), icon: <FolderIcon />, path: '/files' },
        { text: t('profile'), icon: <PersonIcon />, path: '/profile' },
        { text: t('settings'), icon: <SettingsIcon />, path: '/settings' },
    ];

    return (
        <Box sx={{
            width: width,
            height: '100%',
            bgcolor: 'background.paper',
            borderRight: isRTL ? 'none' : '1px solid rgba(0, 127, 255, 0.3)',
            borderLeft: isRTL ? '1px solid rgba(0, 127, 255, 0.3)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            flexShrink: 0,
        }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>LionScript</Typography>
                <Typography variant="caption" color="text.secondary">IDE v1.0</Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <List sx={{ flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    mx: 1,
                                    borderRadius: '8px',
                                    bgcolor: isActive ? 'rgba(0, 127, 255, 0.15)' : 'transparent',
                                    borderLeft: !isRTL && isActive ? '4px solid #007FFF' : '4px solid transparent',
                                    borderRight: isRTL && isActive ? '4px solid #007FFF' : '4px solid transparent',
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: '40px' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} primaryTypographyProps={{ sx: { fontWeight: isActive ? 600 : 400 } }} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            
            <ListItem disablePadding sx={{ mb: 2 }}>
                <ListItemButton onClick={onLogout} sx={{ mx: 1, borderRadius: '8px', color: 'error.main' }}>
                    <ListItemIcon sx={{ color: 'error.main', minWidth: '40px' }}><LogoutIcon /></ListItemIcon>
                    <ListItemText primary={isRTL ? 'تسجيل الخروج' : 'Logout'} />
                </ListItemButton>
            </ListItem>

            <Box onMouseDown={handleMouseDown} sx={{
                position: 'absolute',
                top: 0,
                [isRTL ? 'left' : 'right']: 0,
                width: '5px',
                height: '100%',
                cursor: 'col-resize',
                '&:hover': { bgcolor: 'primary.main' },
            }} />
        </Box>
    );
};

export default Header;