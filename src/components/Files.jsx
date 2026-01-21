import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const API_URL = '/api';

const SUGGESTIONS = [
    'console.log(', 'console.error(', 'console.warn(',
    'function ', 'const ', 'let ', 'var ',
    'if (', 'else {', 'for (', 'while (',
    'return ', 'this.', '.map(', '.filter(',
    '.forEach(', '.reduce(', '.find(',
    'async ', 'await ', 'try {', 'catch (',
    'import ', 'export ', 'class ', 'extends ',
    'switch (', 'case ', 'break;', 'continue;',
    '.length', '.push(', '.pop(', '.shift(',
    'parseInt(', 'parseFloat(', 'typeof ',
];

const Files = () => {
    const [code, setCode] = useState('// Loading...');
    const [output, setOutput] = useState('Output will appear here...');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [running, setRunning] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(0);
    const textareaRef = useRef(null);

    useEffect(() => {
        const fetchCode = async () => {
            setLoading(true);
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    setCode('// Welcome to LionScript IDE!\n// Start coding...\n\nfunction hello() {\n  console.log("Hello World!");\n}');
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                if (!user.email && !user.id) {
                    setCode('// Welcome to LionScript IDE!\n// Start coding...');
                    setLoading(false);
                    return;
                }

                const id = user.id || user.email.replace(/[@.]/g, '_');
                setUserId(id);

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

    const handleRun = () => {
        setRunning(true);
        setOutput('Running code...\n');
        setError('');

        setTimeout(() => {
            try {
                const consoleOutput = [];
                const customConsole = {
                    log: (...args) => consoleOutput.push(args.map(a => 
                        typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
                    ).join(' ')),
                    error: (...args) => consoleOutput.push('❌ Error: ' + args.join(' ')),
                    warn: (...args) => consoleOutput.push('⚠️  Warning: ' + args.join(' ')),
                };

                const func = new Function('console', code);
                func(customConsole);

                if (consoleOutput.length > 0) {
                    setOutput(consoleOutput.join('\n'));
                } else {
                    setOutput('✅ Code executed successfully (no output)');
                }
            } catch (err) {
                setOutput(`❌ Error: ${err.message}\n\n📍 Line: ${err.lineNumber || 'Unknown'}\n\n📚 Stack:\n${err.stack}`);
                setError('Code execution failed');
            } finally {
                setRunning(false);
            }
        }, 100);
    };

    const handleKeyDown = (e) => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        
        const { selectionStart, selectionEnd } = textarea;

        const pairs = {
            '(': ')',
            '[': ']',
            '{': '}',
            '"': '"',
            "'": "'"
        };

        if (pairs[e.key] && !e.ctrlKey && !e.altKey) {
            e.preventDefault();
            const before = code.substring(0, selectionStart);
            const after = code.substring(selectionEnd);
            const newCode = before + e.key + pairs[e.key] + after;
            setCode(newCode);
            setTimeout(() => {
                textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
            }, 0);
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            const lineStart = code.lastIndexOf('\n', selectionStart - 1) + 1;
            const currentLine = code.substring(lineStart, selectionStart);
            const indent = currentLine.match(/^\s*/)[0];
            
            if (code[selectionStart - 1] === '{') {
                e.preventDefault();
                const newCode = code.substring(0, selectionStart) + 
                               '\n' + indent + '  ' + 
                               '\n' + indent + 
                               code.substring(selectionEnd);
                setCode(newCode);
                setTimeout(() => {
                    textarea.selectionStart = textarea.selectionEnd = selectionStart + indent.length + 3;
                }, 0);
                return;
            }
        }

        if (e.ctrlKey && e.key === ' ') {
            e.preventDefault();
            const textBefore = code.substring(0, selectionStart);
            const lastWord = textBefore.split(/[\s\(\)\[\]\{\}]/).pop();
            
            if (lastWord) {
                const filtered = SUGGESTIONS.filter(s => 
                    s.toLowerCase().startsWith(lastWord.toLowerCase())
                );
                if (filtered.length > 0) {
                    setSuggestions(filtered);
                    setShowSuggestions(true);
                    setSelectedSuggestion(0);
                }
            }
            return;
        }

        if (showSuggestions && (e.key === 'Enter' || e.key === 'Tab')) {
            e.preventDefault();
            insertSuggestion(suggestions[selectedSuggestion]);
            return;
        }

        if (showSuggestions && e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedSuggestion((selectedSuggestion + 1) % suggestions.length);
        }

        if (showSuggestions && e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedSuggestion((selectedSuggestion - 1 + suggestions.length) % suggestions.length);
        }

        if (showSuggestions && e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    const insertSuggestion = (suggestion) => {
        const textarea = textareaRef.current;
        const { selectionStart } = textarea;
        const textBefore = code.substring(0, selectionStart);
        const textAfter = code.substring(selectionStart);
        const lastWord = textBefore.split(/[\s\(\)\[\]\{\}]/).pop();
        const newTextBefore = textBefore.substring(0, textBefore.length - lastWord.length);
        
        setCode(newTextBefore + suggestion + textAfter);
        setShowSuggestions(false);
        
        setTimeout(() => {
            textarea.focus();
            const cursorPos = newTextBefore.length + suggestion.length;
            textarea.selectionStart = textarea.selectionEnd = cursorPos;
        }, 0);
    };

    const highlightCode = (code) => {
        return code.split('\n').map((line, idx) => {
            let result = line;
            
            result = result.replace(/(\/\/.*$)/g, '<span style="color:#6A9955">$1</span>');
            result = result.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, 
                '<span style="color:#CE9178">$1</span>');
            result = result.replace(/\b(function|return|const|let|var|if|else|for|while|do|switch|case|break|continue|class|extends|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|typeof|instanceof|delete|void|yield|in|of)\b/g, 
                '<span style="color:#569CD6">$1</span>');
            result = result.replace(/\b(console|Math|Date|String|Number|Boolean|Array|Object|Promise|JSON|parseInt|parseFloat|isNaN|isFinite|Set|Map|WeakMap|WeakSet|Symbol|Error|RegExp)\b/g, 
                '<span style="color:#4EC9B0">$1</span>');
            result = result.replace(/\b(\d+\.?\d*)\b/g, 
                '<span style="color:#B5CEA8">$1</span>');
            result = result.replace(/\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, 
                '<span style="color:#DCDCAA">$1</span>');
            
            return (
                <div 
                    key={idx} 
                    dangerouslySetInnerHTML={{ __html: result || '&nbsp;' }}
                    style={{ color: '#D4D4D4', minHeight: '21px' }}
                />
            );
        });
    };

    const lineCount = code.split('\n').length;
    const lines = Array.from({ length: Math.max(lineCount, 20) }, (_, i) => i + 1);

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}>
                <CircularProgress />
                <Typography color="text.secondary">Loading your code...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, height: '100vh', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <Typography variant="h2">FILES</Typography>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                        onClick={handleSave}
                        disabled={saving || !userId}
                        sx={{ bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                    
                    <Button
                        variant="contained"
                        startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
                        onClick={handleRun}
                        disabled={running}
                        sx={{ bgcolor: '#007FFF', '&:hover': { bgcolor: '#0066CC' } }}
                    >
                        {running ? 'Running...' : 'Run'}
                    </Button>
                </Box>
            </Box>

            {success && <Alert severity="success" sx={{ flexShrink: 0 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ flexShrink: 0 }}>{error}</Alert>}

            <Paper
                elevation={3}
                sx={{
                    flexGrow: 1,
                    bgcolor: '#1E1E1E',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #333',
                    overflow: 'hidden',
                    minHeight: 0,
                }}
            >
                <Box sx={{ bgcolor: '#252526', px: 2, py: 1, borderBottom: '1px solid #333', color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">📄 main.js</Typography>
                    {saving && <CircularProgress size={12} />}
                </Box>

                <Box sx={{ display: 'flex', flexGrow: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
                    <Box
                        sx={{
                            width: '50px',
                            bgcolor: '#1E1E1E',
                            borderRight: '1px solid #333',
                            color: '#858585',
                            textAlign: 'right',
                            pr: 1.5,
                            pt: 2,
                            userSelect: 'none',
                            fontFamily: 'Consolas, "Courier New", monospace',
                            fontSize: '14px',
                            lineHeight: '21px',
                            overflow: 'hidden',
                        }}
                    >
                        {lines.map(line => <div key={line}>{line}</div>)}
                    </Box>

                    <Box sx={{ flexGrow: 1, position: 'relative', overflow: 'hidden' }}>
                        <pre
                            style={{
                                margin: 0,
                                padding: '16px',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                fontFamily: 'Consolas, "Courier New", monospace',
                                fontSize: '14px',
                                lineHeight: '21px',
                                pointerEvents: 'none',
                                whiteSpace: 'pre',
                                overflow: 'hidden',
                            }}
                        >
                            {highlightCode(code)}
                        </pre>

                        <textarea
                            ref={textareaRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            onKeyDown={handleKeyDown}
                            spellCheck="false"
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
                                fontFamily: 'Consolas, "Courier New", monospace',
                                fontSize: '14px',
                                lineHeight: '21px',
                                whiteSpace: 'pre',
                                overflow: 'auto',
                                tabSize: 2,
                            }}
                        />

                        {showSuggestions && (
                            <Paper
                                elevation={8}
                                sx={{
                                    position: 'absolute',
                                    top: '80px',
                                    left: '100px',
                                    maxHeight: '250px',
                                    width: '280px',
                                    overflow: 'auto',
                                    bgcolor: '#252526',
                                    border: '1px solid #454545',
                                    zIndex: 1000,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                }}
                            >
                                <List dense sx={{ py: 0 }}>
                                    {suggestions.map((suggestion, index) => (
                                        <ListItem
                                            key={index}
                                            button
                                            selected={index === selectedSuggestion}
                                            onClick={() => insertSuggestion(suggestion)}
                                            sx={{
                                                bgcolor: index === selectedSuggestion ? '#094771' : 'transparent',
                                                color: '#D4D4D4',
                                                fontFamily: 'Consolas, monospace',
                                                fontSize: '13px',
                                                py: 0.5,
                                                '&:hover': { bgcolor: '#2A2D2E' },
                                                '&.Mui-selected': { bgcolor: '#094771' }
                                            }}
                                        >
                                            <ListItemText primary={suggestion} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Paper>

            <Box
                sx={{
                    height: '180px',
                    flexShrink: 0,
                    bgcolor: '#000',
                    borderTop: '2px solid #007FFF',
                    p: 2,
                    fontFamily: 'Consolas, monospace',
                    color: '#fff',
                    overflow: 'auto',
                }}
            >
                <Typography variant="caption" sx={{ color: '#007FFF', mb: 1, display: 'block', fontWeight: 'bold' }}>
                    🖥️  TERMINAL
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <span style={{ color: '#00E5FF', marginRight: '8px' }}>➜</span>
                    <span>node main.js</span>
                </Box>
                <Box sx={{ mt: 1, color: error ? '#ff6b6b' : '#aaa', whiteSpace: 'pre-wrap', fontSize: '13px' }}>
                    {output}
                </Box>
            </Box>

            <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', flexShrink: 0, py: 1 }}>
                💡💡 <strong>Ctrl+Space</strong> for suggestions • Auto-close: <strong>( [ &#123; " '</strong> • <strong>Ctrl+S</strong> to save
            </Typography>
        </Box>
    );
};

export default Files;