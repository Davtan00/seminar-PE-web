import { createTheme } from '@mui/material';

const primaryColor = '#2563eb';
const secondaryColor = '#7c3aed';

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: '#60a5fa',
      dark: '#1e40af',
    },
    secondary: {
      main: secondaryColor,
      light: '#a78bfa',
      dark: '#5b21b6',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
          border: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: primaryColor,
          height: 6,
        },
        thumb: {
          width: 16,
          height: 16,
          '&:hover': {
            boxShadow: `0 0 0 8px ${primaryColor}20`,
          },
        },
        track: {
          height: 6,
          borderRadius: 3,
        },
        rail: {
          height: 6,
          borderRadius: 3,
          backgroundColor: '#e2e8f0',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
        },
      },
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      color: '#1e293b',
    },
    h6: {
      fontWeight: 600,
      color: '#1e293b',
      marginBottom: '1rem',
    },
    subtitle1: {
      color: '#64748b',
    },
    subtitle2: {
      fontWeight: 600,
      color: '#1e293b',
      marginBottom: '0.5rem',
    },
  },
}); 