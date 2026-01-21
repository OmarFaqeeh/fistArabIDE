import React from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import PublicIcon from '@mui/icons-material/Public';
import { useLanguage } from '../contexts/LanguageContext';

const Ecosystem = () => {
    const { t } = useLanguage();

    const features = [
        {
            title: t.ecosystem.lab_title,
            desc: t.ecosystem.lab_desc,
            icon: <ScienceIcon fontSize="inherit" />,
            color: "text-blue-400",
            glow: "shadow-[0_0_30px_rgba(59,130,246,0.3)]"
        },
        {
            title: t.ecosystem.arena_title,
            desc: t.ecosystem.arena_desc,
            icon: <EmojiEventsIcon fontSize="inherit" />,
            color: "text-yellow-400",
            glow: "shadow-[0_0_30px_rgba(250,204,21,0.3)]"
        },
        {
            title: t.ecosystem.academy_title,
            desc: t.ecosystem.academy_desc,
            icon: <SchoolIcon fontSize="inherit" />,
            color: "text-green-400",
            glow: "shadow-[0_0_30px_rgba(74,222,128,0.3)]"
        },
        {
            title: t.ecosystem.network_title,
            desc: t.ecosystem.network_desc,
            icon: <PublicIcon fontSize="inherit" />,
            color: "text-purple-400",
            glow: "shadow-[0_0_30px_rgba(192,132,252,0.3)]"
        }
    ];

    return (
        <Box className="py-32 relative overflow-hidden">
            {/* Dark gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a20] to-black" />

            {/* Abstract decorative blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-dark/20 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

            <Container maxWidth="xl" className="relative z-10">
                <Box className="text-center mb-20">
                    <Typography variant="overline" className="text-primary-light font-bold tracking-[0.3em] block mb-4">
                        EXPLORE
                    </Typography>
                    <Typography variant="h2" className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-lg">
                        The Ecosystem
                    </Typography>
                </Box>

                <Grid container spacing={6}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} lg={3} key={index}>
                            <div className="group relative h-full">
                                {/* Glow Effect Layer */}
                                <div className={`absolute -inset-0.5 bg-gradient-to-b from-primary-main to-transparent opacity-0 group-hover:opacity-100 transition duration-500 blur rounded-2xl`}></div>

                                <Card className="relative h-full bg-black/60 backdrop-blur-xl border border-white/10 group-hover:border-primary-main/50 transition-all duration-500 rounded-2xl overflow-visible">
                                    <CardContent className="h-full flex flex-col items-center text-center p-8 z-10">
                                        <div className={`mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 ${feature.color} text-5xl transition-all duration-500 group-hover:scale-110 group-hover:bg-white/10 ${feature.glow}`}>
                                            {feature.icon}
                                        </div>

                                        <Typography variant="h5" className="font-bold mb-4 font-sans tracking-tight text-white group-hover:text-primary-light transition-colors">
                                            {feature.title}
                                        </Typography>

                                        <Typography variant="body1" className="text-gray-400 leading-relaxed group-hover:text-gray-300">
                                            {feature.desc}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Ecosystem;
