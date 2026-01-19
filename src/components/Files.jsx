import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const API_URL = 'http://localhost:3001/api';

const Files = () => {
    const [code, setCode] = useState('// Loading...');
    const [output, setOutput] = useState('Output will appear here...');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [running, setRunning] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);

    // جلب الكود من Firebase عند التحميل
    useEffect(() => {
        const fetchCode = async () => {
            setLoading(true);
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    setCode('// Welcome to LionScript IDE!\n// Start coding...');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                if (!user.email) {
                    setCode('// Welcome to LionScript IDE!\n// Start coding...');
                    setLoading(false);
                    return;
                }

                const id = user.email.replace(/[@.]/g, '_');
                setUserId(id);

                // جلب الكود من Firebase
                const response = await fetch(`${API_URL}/users/${id}`);
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success && result.data && result.data.code) {
                        setCode(result.data.code);
                    } else {
                        setCode('// Welcome to LionScript IDE!\n// Start coding...');
                    }
                }
            } catch (err) {
                console.error('خطأ في جلب الكود:', err);
                setCode('// Error loading code. Start fresh!');
            } finally {
                setLoading(false);
            }
        };

        fetchCode();
    }, []);

    // حفظ الكود في Firebase
    const handleSave = async () => {
        if (!userId) {
            setError('Please login first');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`${API_URL}/users/${userId}/code`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });

            const result = await response.json();

            if (result.success) {
                setSuccess('Code saved successfully ✅');
                setTimeout(() => setSuccess(''), 2000);
            } else {
                setError('Failed to save code');
            }
        } catch (err) {
            console.error('خطأ في حفظ الكود:', err);
            setError('Error saving code');
        } finally {
            setSaving(false);
        }
    };

    // تشغيل الكود
    const handleRun = () => {
        setRunning(true);
        setOutput('Running code...\n');
        setError('');

        try {
            // إنشاء console مخصص لالتقاط الناتج
            const consoleOutput = [];
            const customConsole = {
                log: (...args) => consoleOutput.push(args.join(' ')),
                error: (...args) => consoleOutput.push('Error: ' + args.join(' ')),
                warn: (...args) => consoleOutput.push('Warning: ' + args.join(' ')),
            };

            // تشغيل الكود في سياق محدود
            const wrappedCode = `
                (function(console) {
                    ${code}
                })(customConsole);
            `;

            // تنفيذ الكود
            eval(wrappedCode.replace('customConsole', 'customConsole'));

            // عرض الناتج
            if (consoleOutput.length > 0) {
                setOutput(consoleOutput.join('\n'));
            } else {
                setOutput('Code executed successfully (no output)');
            }
        } catch (err) {
            // عرض الأخطاء
            setOutput(`Error: ${err.message}\n\nStack:\n${err.stack}`);
            setError('Code execution failed');
        } finally {
            setRunning(false);
        }
    };

    // Simple syntax highlighter
    const highlightCode = (code) => {
        return code.split(/(\s+)/).map((part, index) => {
            if (['function', 'return', 'const', 'let', 'var', 'class', 'async', 'await'].includes(part)) {
                return <span key={index} style={{ color: '#007FFF' }}>{part}</span>;
            }
            if (['if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue'].includes(part)) {
                return <span key={index} style={{ color: '#00E5FF' }}>{part}</span>;
            }
            if (part.match(/'[^']*'|"[^"]*"/)) {
                return <span key={index} style={{ color: '#CE9178' }}>{part}</span>;
            }
            if (part.match(/\d+/)) {
                return <span key={index} style={{ color: '#B5CEA8' }}>{part}</span>;
            }
            return part;
        });
    };

    const lineCount = code.split('\n').length;
    const lines = Array.from({ length: Math.max(lineCount, 15) }, (_, i) => i + 1);

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h2">FILES</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={saving || !userId}
                        sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                    
                    <Button
                        variant="contained"
                        startIcon={running ? <CircularProgress size={16} /> : <PlayArrowIcon />}
                        onClick={handleRun}
                        disabled={running}
                        sx={{ bgcolor: '#007FFF', '&:hover': { bgcolor: '#0066CC' } }}
                    >
                        {running ? 'Running...' : 'Run'}
                    </Button>
                </Box>
            </Box>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Editor Container */}
            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    bgcolor: '#1E1E1E',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #333',
                    overflow: 'hidden'
                }}
            >
                {/* Tab Bar */}
                <Box sx={{ bgcolor: '#252526', px: 2, py: 1, borderBottom: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <span>main.js</span>
                    {saving && <CircularProgress size={12} />}
                </Box>

                {/* Editor Area */}
                <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                    {/* Line Numbers */}
                    <Box
                        sx={{
                            width: '50px',
                            bgcolor: '#1E1E1E',
                            borderRight: '1px solid #333',
                            color: '#858585',
                            textAlign: 'right',
                            pr: 2,
                            pt: 2,
                            userSelect: 'none',
                            fontFamily: 'Consolas, monospace',
                            fontSize: '14px',
                            lineHeight: '1.5',
                            overflowY: 'hidden',
                        }}
                    >
                        {lines.map(line => (
                            <div key={line}>{line}</div>
                        ))}
                    </Box>

                    {/* Code Input Area */}
                    <Box sx={{ flexGrow: 1, position: 'relative' }}>
                        {/* Syntax Highlight Layer */}
                        <pre
                            style={{
                                margin: 0,
                                padding: '16px',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                fontFamily: 'Consolas, monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                color: '#D4D4D4',
                                pointerEvents: 'none',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word'
                            }}
                        >
                            {highlightCode(code)}
                        </pre>

                        {/* Transparent Textarea */}
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            spellCheck="false"
                            placeholder="Start coding..."
                            style={{
                                width: '100%',
                                height: '100%',
                                margin: 0,
                                padding: '16px',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                background: 'transparent',
                                color: 'transparent',
                                caretColor: '#fff',
                                border: 'none',
                                outline: 'none',
                                resize: 'none',
                                fontFamily: 'Consolas, monospace',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                whiteSpace: 'pre-wrap',
                                wordWrap: 'break-word',
                                overflow: 'auto',
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Terminal Area */}
            <Box
                sx={{
                    height: '200px',
                    bgcolor: '#000',
                    borderTop: '2px solid #007FFF',
                    p: 2,
                    fontFamily: 'Consolas, monospace',
                    color: '#fff',
                    overflow: 'auto',
                }}
            >
                <Typography variant="caption" sx={{ color: '#007FFF', mb: 1, display: 'block' }}>
                    TERMINAL
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <span style={{ color: '#00E5FF', marginRight: '8px' }}>➜</span>
                    <span>node main.js</span>
                </Box>
                <Box sx={{ mt: 1, color: error ? '#ff6b6b' : '#aaa', whiteSpace: 'pre-wrap' }}>
                    {output}
                </Box>
            </Box>
        </Box>
    );
};


export default Files;