import { createTheme } from '@mui/material/styles';

const themes = [
    { id: 'deepBlue', primary: '#007FFF', secondary: '#00E5FF', name: 'Deep Blue' },
    { id: 'cyberRed', primary: '#FF0055', secondary: '#FF5588', name: 'Cyber Red' },
    { id: 'neonGreen', primary: '#00FF99', secondary: '#66FFCC', name: 'Neon Green' },
    { id: 'voidPurple', primary: '#B026FF', secondary: '#D488FF', name: 'Void Purple' },
    { id: 'goldenEra', primary: '#FFD700', secondary: '#FFE44D', name: 'Golden Era' },
];

export const getTheme = (modeId) => {
    // البحث بالـ id النصي
    const selected = themes.find(t => t.id === modeId) || themes[0];

    return createTheme({
        palette: {
            mode: 'dark',
            background: {
                default: '#000000',
                paper: '#050510',
            },
            primary: {
                main: selected.primary,
                contrastText: '#ffffff',
            },
            secondary: {
                main: selected.secondary,
            },
            text: {
                primary: '#E0E0E0',
                secondary: '#B0B0B0',
            },
        },
        typography: {
            fontFamily: '"Consolas", "Roboto", "Helvetica", "Arial", sans-serif',
            h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '2px', color: selected.primary, textShadow: `0 0 10px ${selected.primary}80` },
            h2: { fontSize: '2rem', fontWeight: 600, color: '#E0E0E0' },
            body1: { fontSize: '1rem' },
        },
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    body: {
                        backgroundColor: '#000000',
                        scrollbarColor: `${selected.primary} #000000`,
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#000000',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: selected.primary,
                            borderRadius: '4px',
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            boxShadow: `0 0 15px ${selected.primary}99`,
                        },
                    },
                    containedPrimary: {
                        background: `linear-gradient(45deg, ${selected.primary}DD 30%, ${selected.primary} 90%)`,
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: 'none',
                    },
                },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        '&.Mui-selected': {
                            borderLeft: `4px solid ${selected.primary}`,
                            backgroundColor: `${selected.primary}26`,
                            '&:hover': {
                                backgroundColor: `${selected.primary}33`,
                            }
                        }
                    }
                }
            }
        },
    });
};

export const themeOptions = themes;