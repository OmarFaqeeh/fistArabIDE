import React from 'react';
import { Container, Typography, Box, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ = () => {
    const { t } = useLanguage();

    // Map FAQs to an array for easy iteration if keys were array. 
    // Since translation keys are q1, q2... i'll just iterate 1 to 4.
    const faqs = [1, 2, 3, 4];

    return (
        <Box className="py-20 bg-background-paper">
            <Container maxWidth="md">
                <Typography variant="h3" className="text-center font-bold mb-12">
                    FAQ
                </Typography>

                <Box className="space-y-4">
                    {faqs.map((i) => (
                        <Accordion key={i} className="bg-background-default border border-gray-800 before:hidden shadow-none rounded-lg overflow-hidden">
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon className="text-primary-main" />}
                                className="hover:bg-white/5 transition-colors"
                            >
                                <Typography variant="h6" className="font-bold">
                                    {t.faq[`q${i}`]}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails className="bg-black/30">
                                <Typography color="text.secondary">
                                    {t.faq[`a${i}`]}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default FAQ;
