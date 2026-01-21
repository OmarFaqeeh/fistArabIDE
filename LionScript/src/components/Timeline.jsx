import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import CodeIcon from '@mui/icons-material/Code';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import CloudIcon from '@mui/icons-material/Cloud';
import { useLanguage } from '../contexts/LanguageContext';

const Timeline = () => {
    const { t } = useLanguage();

    const phases = [
        {
            title: t.timeline.phase1_title,
            desc: t.timeline.phase1_desc,
            icon: <GroupsIcon />,
            date: "Q3 2026"
        },
        {
            title: t.timeline.phase2_title,
            desc: t.timeline.phase2_desc,
            icon: <CodeIcon />,
            date: "Q4 2026"
        },
        {
            title: t.timeline.phase3_title,
            desc: t.timeline.phase3_desc,
            icon: <SportsEsportsIcon />,
            date: "Q1 2027"
        },
        {
            title: t.timeline.phase4_title,
            desc: t.timeline.phase4_desc,
            icon: <CloudIcon />,
            date: "Q2 2027"
        }
    ];

    return (
        <Box className="py-20 overflow-hidden relative">
            {/* Background decorative line */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-primary-main to-transparent opacity-30 transform -translate-x-1/2 hidden md:block" />

            <Container maxWidth="lg">
                <Typography variant="h3" className="text-center font-bold mb-20">
                    Future Operations
                </Typography>

                <div className="relative">
                    {phases.map((phase, index) => (
                        <div key={index} className={`flex flex-col md:flex-row items-center justify-center mb-16 relative z-10 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                            {/* Content Side */}
                            <div className="md:w-5/12 w-full px-4 text-center md:text-right flex flex-col items-center md:items-end">
                                {/* For RTL, we need to handle alignment logic or rely on 'dir' attribute CSS. 
                     Wait, flex-row-reverse in RTL mode might behave differently. 
                     In LTR: md:flex-row => Left content, Right Empty.
                     In RTL: md:flex-row => Right content, Left Empty (since flex start is right).
                     Actually flex direction 'row' starts from 'start'. In RTL 'start' is right.
                     So 'row' = Right -> Left.
                     'row-reverse' = Left -> Right.
                     We want the content to alternate.
                     If index % 2 == 0: Row.
                     LTR: Left box, Center circle, Right empty.
                     RTL: Right box, Center circle, Left empty.
                     This works perfectly for alternation!
                     But text alignment needs to be 'end' relative to the center.
                     In LTR: Item 0 (Left box) should align text right (towards center).
                     In RTL: Item 0 (Right box) should align text left (towards center)? No, usually towards center.
                     Let's just center text on mobile, and align towards center on desktop.
                 */}
                                <Box className={`mb-4 md:mb-0 w-full p-6 rounded-2xl bg-background-paper border border-gray-800 hover:border-primary-main transition-all`}>
                                    <Typography variant="h5" className="font-bold text-primary-light mb-2">
                                        {phase.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {phase.desc}
                                    </Typography>
                                    <div className="mt-4 px-3 py-1 bg-white/5 rounded-full inline-block text-sm font-mono">
                                        {phase.date}
                                    </div>
                                </Box>
                            </div>

                            {/* Center Circle */}
                            <div className="md:w-2/12 flex justify-center py-4 md:py-0">
                                <div className="w-16 h-16 rounded-full bg-primary-dark border-4 border-black flex items-center justify-center text-white text-2xl shadow-[0_0_20px_rgba(26,35,126,0.5)] z-10 relative">
                                    {phase.icon}
                                </div>
                            </div>

                            {/* Empty Side */}
                            <div className="md:w-5/12 hidden md:block" />

                        </div>
                    ))}
                </div>
            </Container>
        </Box>
    );
};

export default Timeline;
