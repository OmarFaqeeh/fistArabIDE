import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#1A237E',
        },
        background: {
            default: '#000000',
            paper: '#0a0a0a',
        },
        text: {
            primary: '#ffffff',
            secondary: '#b3b3b3',
        },
    },
    typography: {
        fontFamily: 'Inter, Cairo, sans-serif',
    },
});

export default theme;
