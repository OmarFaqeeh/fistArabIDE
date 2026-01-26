import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Map, Trophy, Code, ArrowRight, Users } from 'lucide-react';
import { Box, Typography, Button as MuiButton } from '@mui/material';
import { useApp } from '../contexts/AppContext';

export default function Home() {
  const { t, language } = useApp();
  const isRTL = language === 'ar';

  const features = [
    { icon: Map, title: '5 Learning Tracks', titleAr: '5 مسارات تعليمية', desc: '40 challenges from basics to advanced', descAr: '40 تحدي من الأساسيات إلى المتقدم' },
    { icon: Trophy, title: 'Gamified Progress', titleAr: 'تقدم باللعب', desc: 'Earn points and climb the leaderboard', descAr: 'اكسب النقاط وتصدر لوحة المتصدرين' },
    { icon: Code, title: 'Live IDE', titleAr: 'بيئة تطوير حية', desc: 'Write and run JavaScript in real-time', descAr: 'اكتب وشغل جافاسكريبت في الوقت الفعلي' },
    { icon: Users, title: 'Lion-Net Social', titleAr: 'شبكة الأسد الاجتماعية', desc: 'Chat and connect with other learners', descAr: 'تواصل مع المتعلمين الآخرين' },
  ];

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ textAlign: 'center' }}>
        
   

        <Typography variant="h1" sx={{ fontWeight: 800, mb: 2, fontSize: { xs: '2.5rem', md: '4rem' }, background: 'linear-gradient(45deg, #007FFF 30%, #00FF99 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isRTL ? 'مرحباً بك في LionScript' : 'Welcome to LionScript'}
        </Typography>

        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          {isRTL ? 'ابدأ رحلتك في احتراف البرمجة مع أقوى التحديات' : 'Start your journey to master coding with the best challenges'}
        </Typography>

        <Link to="/select-path" style={{ textDecoration: 'none' }}>
          <MuiButton variant="contained" size="large" sx={{ px: 4, py: 1.5, borderRadius: '12px', fontSize: '1.2rem' }}>
            {isRTL ? 'ابدأ التعلم الآن' : 'Start Learning Now'}
            <ArrowRight style={{ marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0, transform: isRTL ? 'rotate(180deg)' : 'none' }} />
          </MuiButton>
        </Link>
      </motion.div>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 3, mt: 8, width: '100%', maxWidth: '1100px' }}>
        {features.map((feature, index) => (
          <motion.div key={index} whileHover={{ y: -10 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 4, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}>
              <feature.icon size={32} color="#007FFF" style={{ marginBottom: '16px' }} />
              <Typography variant="h6" gutterBottom>{isRTL ? feature.titleAr : feature.title}</Typography>
              <Typography variant="body2" color="text.secondary">{isRTL ? feature.descAr : feature.desc}</Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}