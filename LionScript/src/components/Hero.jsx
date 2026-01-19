import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useLanguage } from '../contexts/LanguageContext';


const Hero = () => {
    const { t } = useLanguage();

    return (
        <Box className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-background-default">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-main opacity-20 blur-[120px] rounded-full pointer-events-none" />

            <Container maxWidth="lg" className="relative z-10 text-center">
                <Box className="mb-6 flex justify-center">
                    <div className="px-4 py-1 border border-primary-light rounded-full bg-primary-dark/30 text-primary-light text-sm font-semibold animate-pulse">
                        v1.0 Community Edition
                    </div>
                </Box>

                <Typography
                    variant="h2"
                    component="h1"
                    className="font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent sm:text-6xl text-4xl"
                >
                    {t.hero.headline}
                </Typography>

                <Typography
                    variant="h5"
                    color="text.secondary"
                    className="font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent sm:text-6xl text-4xl"
                    style={{marginBottom:"20px"}}
                >
                    {t.hero.description}
                </Typography>

                <Box className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        
                        className="px-8 py-3 text-lg font-bold rounded-xl shadow-lg shadow-primary-main/50 hover:shadow-primary-main/80 transition-all"
                    >
                        {t.hero.cta_download}  <RocketLaunchIcon />
                    </Button>
                    <Button
                    
                        variant="outlined"
                        size="large"
                        color="inherit"
                       
                        className="px-8 py-3 text-lg font-bold rounded-xl border-gray-700 hover:bg-white/5 transition-all"
                    >
                         {t.hero.cta_explore}  <CodeIcon />
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default Hero;
