import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
    const { t, toggleLanguage, language } = useLanguage();

    return (
        <AppBar position="static" color="transparent" elevation={0} className="border-b border-gray-800">
            <Container maxWidth="xl">
                <Toolbar disableGutters className="justify-between">
                    <Box className="flex items-center gap-2">
                        {/* Logo Logo */}
                        <div style={{width:"60px",height:"60px"}}className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <img src="/assets/lion-logo.jpg" alt="LionScript Logo" className="w-full h-full object-cover" />
                        </div>
                        <Typography variant="h6" className="font-bold tracking-wider">
                            {t.title}
                        </Typography>
                    </Box>

                    <Button
                        color="inherit"
                        onClick={toggleLanguage}
                        startIcon={<LanguageIcon />}
                        className="font-bold"
                        sx={{marginRight:"10px"}}
                    >
                        <h3 style={{marginRight:"10px"}}>{language === 'en' ? 'العربية' : 'English'}</h3>
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
