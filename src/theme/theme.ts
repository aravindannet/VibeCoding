import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#0000FF', // Bright blue like in the image
      light: '#3333FF',
      dark: '#0000CC',
      // @ts-ignore - Adding custom lighter shade
      lighter: '#F0F8FF',
    },
    secondary: {
      main: '#00B8D9',
      light: '#00D5FF',
      dark: '#0077B6',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    subtitle1: {
      fontSize: '1.125rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      letterSpacing: '-0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      letterSpacing: '-0.01em',
    },
    button: {
      fontWeight: 500,
      letterSpacing: '-0.01em',
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          fontWeight: 500,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          boxShadow: 'none',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px 24px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px 24px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
          },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
          },
        },
      },
    },
  },
});
