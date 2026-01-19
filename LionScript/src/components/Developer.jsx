import React from 'react';
import { Container, Typography, Box, Avatar } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const Developer = () => {
    const { t } = useLanguage();

    return (
        <Box className="py-20 bg-black">
            <Container maxWidth="lg">
                <Box className="flex flex-col md:flex-row items-center gap-12 border border-gray-800 p-12 rounded-3xl bg-background-paper/50 backdrop-blur-sm">
                    {/* Image Placeholder */}
                    <div className="shrink-0 relative group">
                        <div className="absolute inset-0 bg-primary-main rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <Avatar
                            sx={{ width: 200, height: 200 }}
                            className="relative z-10 border-4 border-black"
                            src="" // Placeholder: Leave empty or use generic
                            alt={t.developer.name}
                        >
                            <span className="text-6xl font-bold text-primary-main"> <img src="/assets/WhatsApp Image 2025-12-28 at 7.53.42 PM.jpeg" alt="my photo"/></span>
                           
                        </Avatar>
                    </div>

                    <div className="text-center md:text-start flex-1">
                        <Typography variant="overline" className="text-primary-light font-bold text-lg tracking-widest block mb-2">
                            MET THE DEVELOPER
                        </Typography>
                        <Typography variant="h4" className="font-bold mb-4">
                            {t.developer.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" className="leading-relaxed font-light">
                            "{t.developer.bio}"
                        </Typography>
                    </div>
                </Box>
            </Container>
        </Box>
    );
};

export default Developer;
