import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useLanguage } from '../contexts/LanguageContext';

const CodeSnippet = () => {
    const { language } = useLanguage();

    return (
        <Box className="py-10 bg-black flex justify-center overflow-hidden">
            <Container maxWidth="md">
                <Box className="rounded-lg overflow-hidden shadow-2xl border border-gray-800 bg-[#0d1117] font-mono text-sm sm:text-base relative z-10 transform hover:scale-[1.02] transition-transform duration-500">
                    {/* Window Title Bar */}
                    <Box className="bg-[#161b22] px-4 py-3 flex items-center gap-2 border-b border-gray-800">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                    </Box>

                    {/* Code Content */}
                    <Box className="p-6 text-gray-300 overflow-x-auto" dir="ltr">
                        <pre className="m-0 font-mono leading-relaxed">
                            <code>
                                <span className="text-gray-500 italic">// Mission: Infiltrate Mainframe</span>{'\n'}
                                <span className="text-purple-400">const</span> <span className="text-blue-400">BlackFox</span> = <span className="text-yellow-400">require</span>(<span className="text-green-400">'@org/protocols'</span>);{'\n'}
                                {'\n'}
                                <span className="text-purple-400">const</span> <span className="text-blue-400">init</span> = <span className="text-purple-400">async</span> () ={'>'} {'{'}{'\n'}
                                {'  '}<span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span>(<span className="text-green-400">"BlackFox Protocol Initiated..."</span>);{'\n'}
                                {'  '}<span className="text-purple-400">await</span> <span className="text-blue-400">BlackFox</span>.<span className="text-yellow-400">loadMission</span>(<span className="text-green-400">"Cyber_Warfare_101"</span>);{'\n'}
                                {'}'};{'\n'}
                                {'\n'}
                                <span className="text-blue-400">init</span>();
                            </code>
                        </pre>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default CodeSnippet;
