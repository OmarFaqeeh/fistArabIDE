// src/components/CodeEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
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

const confettiStyle = `
@keyframes fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(120vh) rotate(360deg); opacity: 0.9; }
}
.confetti {
  position: fixed;
  left: 50%;
  top: -10vh;
  pointer-events: none;
  z-index: 9999;
}
.confetti span {
  display: block;
  width: 8px;
  height: 12px;
  margin: 0 4px;
  opacity: 0.95;
  animation: fall 2.2s linear forwards;
  position: absolute;
  top: 0;
  border-radius: 2px;
}
`;

const CodeEditor = () => {
  const [code, setCode] = useState(''); // فارغ عند البداية
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [userId, setUserId] = useState(null);
  const [lang, setLang] = useState('en'); // افتراضي
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    // نستخدم localStorage فقط للحصول على userId (مثل السابق)
    try {
      const ud = JSON.parse(localStorage.getItem('userData') || '{}');
      const id = ud.id || (ud.email ? ud.email.replace(/[@.]/g, '_') : null);
      setUserId(id);

      // جلب لغة المستخدم من الـ API إذا وُجد userId
      if (id) {
        fetch(`${API_URL}/users/${encodeURIComponent(id)}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.success && data.data && data.data.language) {
              setLang(data.data.language);
            }
          })
          .catch(() => {
            // إبقاء اللغة الافتراضية عند الفشل
          });
      }
    } catch {
      setUserId(null);
      setLang('en');
    }

    // تحميل currentChallenge من localStorage ليظهر الوصف إن وُجد
    try {
      const raw = localStorage.getItem('currentChallenge');
      if (raw) {
        const ch = JSON.parse(raw);
        setCurrentChallenge(ch);
      }
    } catch {
      setCurrentChallenge(null);
    }
  }, []);

  const translateError = (errMsg) => {
    if (/ReferenceError/.test(errMsg)) {
      return lang === 'ar' ? 'مرجع غير معرف — تحقق من أسماء المتغيرات/الدوال.' : 'ReferenceError — check variable/function names.';
    }
    if (/SyntaxError/.test(errMsg)) {
      return lang === 'ar' ? 'خطأ بنيوي — تحقق من الأقواس والفواصل.' : 'SyntaxError — check brackets and syntax.';
    }
    if (/TypeError/.test(errMsg)) {
      return lang === 'ar' ? 'خطأ نوعي — تأكد من العمليات على الأنواع الصحيحة.' : 'TypeError — check data types and operations.';
    }
    return lang === 'ar' ? `خطأ: ${errMsg}` : `Error: ${errMsg}`;
  };

  const handleRun = () => {
    setRunning(true);
    setOutput(lang === 'ar' ? 'تشغيل الكود...' : 'Running code...');
    setErrorMsg('');
    setSuccessMsg('');

    setTimeout(() => {
      try {
        const consoleOutput = [];
        const customConsole = {
          log: (...args) => consoleOutput.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a))).join(' ')),
          error: (...args) => consoleOutput.push('❌ Error: ' + args.join(' ')),
          warn: (...args) => consoleOutput.push('⚠️ Warning: ' + args.join(' '))
        };

        const func = new Function('console', code);
        func(customConsole);

        const joined = consoleOutput.join('\n');
        setOutput(joined || (lang === 'ar' ? '✅ تم تنفيذ الكود بنجاح (بدون مخرجات)' : '✅ Code executed successfully (no output)'));

        // تحقق بسيط مع currentChallenge إن وُجد expected
        if (currentChallenge) {
          const expected = String(currentChallenge.expected || '').trim();
          const firstNonEmpty = joined.split('\n').find(Boolean) || '';

          if (expected && firstNonEmpty.trim() === expected) {
            const msg = lang === 'ar'
              ? `🎉 مبروك! تم إتمام التحدي: ${currentChallenge.title}`
              : `🎉 Congratulations! You solved: ${currentChallenge.title}`;
            setSuccessMsg(msg);
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2300);
          } else if (expected) {
            const mismatchMsg = lang === 'ar'
              ? `النتيجة غير صحيحة. المتوقع: "${expected}". أول سطر ناتج: "${firstNonEmpty.trim() || 'لا مخرجات'}".`
              : `Output mismatch. Expected: "${expected}". First output line: "${firstNonEmpty.trim() || 'no output'}".`;
            setErrorMsg(mismatchMsg);
          }
        }
      } catch (err) {
        const em = err && err.message ? err.message : String(err);
        setErrorMsg(translateError(em));
        setOutput(err.stack || String(err));
      } finally {
        setRunning(false);
      }
    }, 120);
  };

  // دوال المحرر: إغلاق تلقائي للأقواس، indent على Enter، اقتراحات Ctrl+Space (لا يوجد Ctrl+S)
  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;

    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'",
      '`': '`'
    };

    // Auto-close pairs
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

    // Auto-indent on Enter after {
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

    // Ctrl/Cmd + Space -> suggestions
    if ((e.ctrlKey || e.metaKey) && e.key === ' ') {
      e.preventDefault();
      const textBefore = code.substring(0, selectionStart);
      const lastWord = textBefore.split(/[\s\(\)\[\]\{\};,]+/).pop();
      if (lastWord) {
        const filtered = SUGGESTIONS.filter(s => s.toLowerCase().startsWith(lastWord.toLowerCase()));
        if (filtered.length > 0) {
          setSuggestions(filtered);
          setShowSuggestions(true);
          setSelectedSuggestion(0);
        }
      }
      return;
    }

    // Suggestions navigation
    if (showSuggestions && (e.key === 'Enter' || e.key === 'Tab')) {
      e.preventDefault();
      insertSuggestion(suggestions[selectedSuggestion]);
      return;
    }
    if (showSuggestions && e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestion((selectedSuggestion + 1) % suggestions.length);
      return;
    }
    if (showSuggestions && e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestion((selectedSuggestion - 1 + suggestions.length) % suggestions.length);
      return;
    }
    if (showSuggestions && e.key === 'Escape') {
      setShowSuggestions(false);
      return;
    }
  };

  const insertSuggestion = (suggestion) => {
    const textarea = textareaRef.current;
    const { selectionStart } = textarea;
    const textBefore = code.substring(0, selectionStart);
    const textAfter = code.substring(selectionStart);
    const lastWord = textBefore.split(/[\s\(\)\[\]\{\};,]+/).pop();
    const newTextBefore = textBefore.substring(0, textBefore.length - (lastWord ? lastWord.length : 0));

    const newCode = newTextBefore + suggestion + textAfter;
    setCode(newCode);
    setShowSuggestions(false);

    setTimeout(() => {
      textarea.focus();
      const cursorPos = newTextBefore.length + suggestion.length;
      textarea.selectionStart = textarea.selectionEnd = cursorPos;
    }, 0);
  };

  // تلوين بسيط للكود (يُعرض في <pre> خلف textarea)
  const highlightCode = (code) => {
    return code.split('\n').map((line, idx) => {
      let result = line || '&nbsp;';

      // comments
      result = result.replace(/(\/\/.*$)/g, '<span style="color:#6A9955">$1</span>');
      // strings
      result = result.replace(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g, '<span style="color:#CE9178">$1</span>');
      // keywords
      result = result.replace(/\b(function|return|const|let|var|if|else|for|while|do|switch|case|break|continue|class|extends|import|export|from|default|async|await|try|catch|finally|throw|new|this|super|typeof|instanceof|delete|void|yield|in|of)\b/g, '<span style="color:#569CD6">$1</span>');
      // builtins
      result = result.replace(/\b(console|Math|Date|String|Number|Boolean|Array|Object|Promise|JSON|parseInt|parseFloat|isNaN|isFinite|Set|Map|WeakMap|WeakSet|Symbol|Error|RegExp)\b/g, '<span style="color:#4EC9B0">$1</span>');
      // numbers
      result = result.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#B5CEA8">$1</span>');
      // function names
      result = result.replace(/\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, '<span style="color:#DCDCAA">$1</span>');

      return (
        <div
          key={idx}
          dangerouslySetInnerHTML={{ __html: result }}
          style={{ color: '#D4D4D4', minHeight: '21px' }}
        />
      );
    });
  };

  const lineCount = Math.max((code.split('\n').length), 20);
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);

  // واجهة التحميل
  if (loading) {
    return (
      <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: 2 }}>
        <CircularProgress />
        <Typography color="text.secondary">{lang === 'ar' ? 'جاري التحميل...' : 'Loading editor...'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, height: '100vh', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'hidden' }}>
      <style>{confettiStyle}</style>

      {showConfetti && (
        <div className="confetti" aria-hidden>
          {Array.from({ length: 40 }).map((_, i) => {
            const left = Math.floor(Math.random() * 100) - 50;
            const delay = (Math.random() * 0.6).toFixed(2);
            const color = ['#ff6b6b', '#ffd166', '#06d6a0', '#4ec5ff', '#b388ff'][i % 5];
            const style = {
              left: `${left}vw`,
              background: color,
              animationDelay: `${delay}s`,
              top: `${-Math.random() * 20}vh`
            };
            return <span key={i} style={style} />;
          })}
        </div>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box>
          <Typography variant="h5">{lang === 'ar' ? 'محرر الكود' : 'Code Editor'}</Typography>
          {currentChallenge && <Chip label={currentChallenge.title} size="small" sx={{ mt: 1 }} />}
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={running ? <CircularProgress size={16} color="inherit" /> : <PlayArrowIcon />}
            onClick={handleRun}
            disabled={running}
            sx={{ bgcolor: '#007FFF', '&:hover': { bgcolor: '#0066CC' } }}
          >
            {running ? (lang === 'ar' ? 'تشغيل...' : 'Running...') : (lang === 'ar' ? 'تشغيل' : 'Run')}
          </Button>
        </Box>
      </Box>

      {successMsg && <Alert severity="success">{successMsg}</Alert>}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {currentChallenge && (
        <Paper elevation={2} sx={{ p: 2, bgcolor: '#0f1724', color: '#fff', fontFamily: 'monospace' }}>
          <Typography variant="subtitle2" sx={{ color: '#93c5fd' }}>{lang === 'ar' ? 'الوصف:' : 'Mission:'}</Typography>
          <Typography sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace' }}>{currentChallenge.description}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#a3e635' }}>{lang === 'ar' ? 'الناتج المتوقع:' : 'Expected Output:'}</Typography>
            <Typography sx={{ fontFamily: 'monospace' }}>{currentChallenge.expected}</Typography>
          </Box>
        </Paper>
      )}

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
              aria-hidden
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
                color: '#D4D4D4'
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
              placeholder={lang === 'ar' ? 'اكتب كودك هنا...' : 'Start typing your code here...'}
              style={{
                width: '100%',
                height: '100%',
                margin: 0,
                padding: '16px',
                position: 'absolute',
                top: 0,
                left: 0,
                background: 'transparent',
                color: 'transparent', // نص مرئي عبر الـ pre الملون، caret مرئي
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
                  left: '120px',
                  maxHeight: '250px',
                  width: '320px',
                  overflow: 'auto',
                  bgcolor: '#252526',
                  border: '1px solid #454545',
                  zIndex: 1000,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                }}
              >
                <List dense sx={{ py: 0 }}>
                  {suggestions.map((s, idx) => (
                    <ListItem
                      key={idx}
                      button
                      selected={idx === selectedSuggestion}
                      onClick={() => insertSuggestion(s)}
                      sx={{
                        bgcolor: idx === selectedSuggestion ? '#094771' : 'transparent',
                        color: '#D4D4D4',
                        fontFamily: 'Consolas, monospace',
                        fontSize: '13px',
                        py: 0.5,
                        '&:hover': { bgcolor: '#2A2D2E' },
                        '&.Mui-selected': { bgcolor: '#094771' }
                      }}
                    >
                      <ListItemText primary={s} />
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
          🖥️ {lang === 'ar' ? 'الطرفية' : 'TERMINAL'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <span style={{ color: '#00E5FF', marginRight: '8px' }}>➜</span>
          <span>node main.js</span>
        </Box>
        <Box sx={{ mt: 1, color: errorMsg ? '#ff6b6b' : '#aaa', whiteSpace: 'pre-wrap', fontSize: 13 }}>
          {output}
        </Box>
      </Box>

      <Typography variant="caption" sx={{ color: '#666', textAlign: 'center', flexShrink: 0, py: 1 }}>
        💡 <strong>Ctrl+Space</strong> {lang === 'ar' ? 'للاقتراحات' : 'for suggestions'} • {lang === 'ar' ? 'إغلاق تلقائي للأقواس' : 'Auto-close pairs'}
      </Typography>
    </Box>
  );
};

export default CodeEditor;