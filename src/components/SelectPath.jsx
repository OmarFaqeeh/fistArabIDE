import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import TerminalIcon from '@mui/icons-material/Terminal';
import PsychologyIcon from '@mui/icons-material/Psychology';
import StorageIcon from '@mui/icons-material/Storage';
import FunctionsIcon from '@mui/icons-material/Functions';
import { useApp } from '../contexts/AppContext';

const SelectPath = () => {
    const { t } = useApp();
    const navigate = useNavigate();

    const levels = [
        { title: t('path.intro_js.title'), desc: t('path.intro_js.desc'), icon: <TerminalIcon fontSize="large" />, missions: '0/5', slug: 'Introduction-to-JS' },
        { title: t('path.control_flow.title'), desc: t('path.control_flow.desc'), icon: <PsychologyIcon fontSize="large" />, missions: '0/8', slug: 'Control-Flow' },
        { title: t('path.data_structures.title'), desc: t('path.data_structures.desc'), icon: <StorageIcon fontSize="large" />, missions: '0/6', slug: 'Data-Structures' },
        { title: t('path.functions_scope.title'), desc: t('path.functions_scope.desc'), icon: <FunctionsIcon fontSize="large" />, missions: '0/4', slug: 'Functions-&-Scope' },
    ];

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ mb: 1 }}>
                {t('path.title')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6 }}>
                {t('path.subtitle')}
            </Typography>

            <Grid container spacing={4} justifyContent="center">
                {levels.map((level, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 0 25px rgba(0, 127, 255, 0.2)',
                                    border: '1px solid #007FFF',
                                },
                            }}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', p: 4 }}>
                                <Box sx={{
                                    mb: 3,
                                    p: 2,
                                    borderRadius: '50%',
                                    bgcolor: 'rgba(0, 127, 255, 0.1)',
                                    color: 'primary.main'
                                }}>
                                    {level.icon}
                                </Box>
                                <Typography variant="h6" gutterBottom color="white">
                                    {level.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                                    {level.desc}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    endIcon={<KeyboardArrowRightIcon />}
                                    onClick={() => navigate(`/challenges/${level.slug}`)}
                                    sx={{
                                        borderColor: 'rgba(0, 127, 255, 0.5)',
                                        color: '#fff',
                                        '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(0, 127, 255, 0.1)' }
                                    }}
                                >
                                    {t('path.missions')}
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default SelectPath;
