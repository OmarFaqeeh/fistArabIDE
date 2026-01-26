// src/pages/ChallengeDetail.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const ChallengeDetail = () => {
  const { pathId, challengeId } = useParams();
  const navigate = useNavigate();

  // يمكنك هنا استدعاء نفس لوجيك بناء تفاصيل التحدي أو جلب من API
  const title = `${pathId ? pathId.replace(/-/g, ' ') : 'Training'}: Module ${challengeId}`;
  const description = `This is a detailed description for ${title}. Follow the instructions and press Start to load the starter code into the editor.`;

  const handleStart = () => {
    // إعادة استعمال نفس بنية starter كما في Challenges.jsx
    const starter = {
      starterCode: `// Starter for ${title}\nfunction main(){\n  console.log("${title}");\n}\nmain();`,
      expected: `${title}`,
      checkType: 'stdout',
      description,
    };

    const currentChallenge = {
      pathId: pathId || 'training',
      challengeId: Number(challengeId),
      title,
      desc: description,
      difficulty: 'Medium',
      starterCode: starter.starterCode,
      expected: starter.expected,
      checkType: starter.checkType,
      description: starter.description,
    };

    localStorage.setItem('currentChallenge', JSON.stringify(currentChallenge));
    navigate('/files');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>← Back</Button>
      <Typography variant="h3" sx={{ mb: 2 }}>{title}</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>{description}</Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleStart}>Start this mission</Button>
        <Button variant="outlined" onClick={() => alert('More info...')}>More info</Button>
      </Box>
    </Box>
  );
};

export default ChallengeDetail;