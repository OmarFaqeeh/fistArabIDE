import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CodeIcon from '@mui/icons-material/Code';
import { Link } from 'react-router-dom';

const Challenges = () => {
    const { pathId } = useParams();
    const navigate = useNavigate();

    // Mock data generator for 8 challenges
    const getChallenges = (id) => {
        const baseTitle = id.replace(/-/g, ' ').toUpperCase();
        return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            title: `${baseTitle}: Module ${i + 1}`,
            desc: 'Complete the objective to advance your clearance level.',
            difficulty: i < 3 ? 'Easy' : i < 6 ? 'Medium' : 'Hard',
        }));
    };

    const challenges = getChallenges(pathId || 'training');

    const getDifficultyColor = (diff) => {
        if (diff === 'Easy') return 'success';
        if (diff === 'Medium') return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ p: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/select-path')}
                sx={{ mb: 4, color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
                Return to Path Selection
            </Button>

            <Typography variant="h2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                {pathId.replace(/-/g, ' ')} Challenges
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                Complete all 8 modules to master this sector.
            </Typography>

            <Grid container spacing={3}>
                {challenges.map((challenge) => (
                    <Grid item xs={12} sm={6} md={3} key={challenge.id}>
                        <Card
                            sx={{
                                height: '100%',
                                bgcolor: 'background.paper',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                transition: 'all 0.3s',
                                '&:hover': {
                                    transform: 'translateY(-5px)',
                                    boxShadow: '0 0 20px rgba(0, 127, 255, 0.15)',
                                    borderColor: 'primary.main'
                                }
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <CodeIcon color="primary" />
                                    <Chip
                                        label={challenge.difficulty}
                                        size="small"
                                        color={getDifficultyColor(challenge.difficulty)}
                                        variant="outlined"
                                    />
                                </Box>
                                <Typography variant="h6" gutterBottom>
                                    {challenge.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {challenge.desc}
                                </Typography>
                               <Button
  component={Link}
  to="/files"
  variant="outlined"
  fullWidth
  size="small"
>
  Initialize
</Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Challenges;
