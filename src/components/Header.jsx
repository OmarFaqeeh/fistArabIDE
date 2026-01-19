import React, { useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import HubIcon from '@mui/icons-material/Hub';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useApp } from '../contexts/AppContext';

const Header = ({ width, setWidth }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useApp();

    // Resizing Logic
    const handleMouseDown = (e) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        // Limit width between 150px and 500px
        const newWidth = Math.max(150, Math.min(e.clientX, 500));
        setWidth(newWidth);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

   const menuItems = [
    { text: t('selectPath'), icon: <CodeIcon />, path: '/select-path' },
    { text: t('network'), icon: <HubIcon />, path: '/network' },
    { text: t('files'), icon: <FolderIcon />, path: '/files' },
    { text: t('profile'), icon: <PersonIcon />, path: '/profile' },
    { text: t('settings'), icon: <SettingsIcon />, path: '/settings' },
];

    return (
        <Box
            sx={{
                width: width,
                height: '100%',
                bgcolor: 'background.paper',
                borderRight: '1px solid rgba(0, 127, 255, 0.3)',
                boxShadow: '4px 0 20px rgba(0, 127, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                flexShrink: 0,
            }}
        >
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold', textShadow: '0 0 10px rgba(0, 127, 255, 0.6)' }}>
                    LionScript
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    IDE v1.0
                </Typography>
            </Box>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    mx: 1,
                                    borderRadius: '8px',
                                    bgcolor: isActive ? 'rgba(0, 127, 255, 0.15)' : 'transparent',
                                    borderLeft: isActive ? '4px solid #007FFF' : '4px solid transparent',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 127, 255, 0.1)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? '#007FFF' : 'text.secondary', minWidth: '40px' }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        sx: {
                                            color: isActive ? '#fff' : 'text.secondary',
                                            fontWeight: isActive ? 600 : 400
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Resizer Handle */}
            <Box
                onMouseDown={handleMouseDown}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '5px',
                    height: '100%',
                    cursor: 'col-resize',
                    '&:hover': {
                        bgcolor: 'primary.main',
                    },
                }}
            />
        </Box>
    );
};

export default Header;
