import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import ForumIcon from '@mui/icons-material/Forum'; // Using Forum for Discord
import { useLanguage } from '../contexts/LanguageContext';

const JoinArmy = () => {
    const { t } = useLanguage();

    return (
        <Box className="py-20 bg-primary-main/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

            <Container maxWidth="md" className="text-center relative z-10">
                <Typography variant="h3" className="font-bold mb-8">
                    {t.join.title}
                </Typography>

                <Box className="flex flex-col sm:flex-row gap-6 justify-center">
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<ForumIcon />}
                        className="bg-[#5865F2] hover:bg-[#4752c4] py-4 px-8 text-lg rounded-xl font-bold"
                    >
                        {t.join.discord}
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<FacebookIcon />}
                        className="bg-[#1877F2] hover:bg-[#1569d3] py-4 px-8 text-lg rounded-xl font-bold"
                    >
                        {t.join.facebook}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default JoinArmy;
