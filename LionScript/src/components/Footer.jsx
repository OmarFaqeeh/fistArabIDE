import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();

    return (
        <Box className="py-8 bg-black border-t border-gray-900">
            <Container maxWidth="xl" className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Box className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            <img src="/assets/lion-logo.jpg" alt="LionScript Logo" className="w-full h-full object-cover" />
                        </div>
                    <Typography variant="h6" className="font-bold text-sm tracking-wider">
                        {t.title}
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" className="text-center md:text-right">
                    © {new Date().getFullYear()} LionScript. All rights reserved. <br />
                    Designed by Omar Alfaqeeh.
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;
