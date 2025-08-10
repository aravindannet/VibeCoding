import { createTheme } from '@mui/material/styles';

export const createAppTheme = (isDark: boolean) => createTheme({
  palette: {
    mode: isDark ? 'dark' : 'light',
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
      primary: isDark ? '#ffffff' : '#1A1A1A',
      secondary: isDark ? '#a1a1aa' : '#666666',
    },
    background: {
      default: isDark ? '#18181b' : '#FFFFFF',
      paper: isDark ? '#27272a' : '#FFFFFF',
    },
    divider: isDark ? '#3f3f46' : '#e4e4e7',
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
          backgroundColor: isDark ? '#27272a' : '#FFFFFF',
          color: isDark ? '#ffffff' : '#1A1A1A',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: isDark 
            ? '0px 4px 20px rgba(0, 0, 0, 0.4)' 
            : '0px 4px 20px rgba(0, 0, 0, 0.08)',
          backgroundColor: isDark ? '#27272a' : '#FFFFFF',
          color: isDark ? '#ffffff' : '#1A1A1A',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: '24px 24px 16px 24px',
          backgroundColor: isDark ? '#27272a' : '#FFFFFF',
          color: isDark ? '#ffffff' : '#1A1A1A',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          backgroundColor: isDark ? '#27272a' : '#FFFFFF',
          color: isDark ? '#ffffff' : '#1A1A1A',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 24px 24px',
          backgroundColor: isDark ? '#27272a' : '#FFFFFF',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          fontWeight: 500,
        },
        outlined: {
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
          color: isDark ? '#a1a1aa' : '#666666',
          '&.MuiChip-colorPrimary': {
            borderColor: '#0000FF',
            color: '#0000FF',
          },
        },
        filled: {
          backgroundColor: isDark ? '#3f3f46' : '#f4f4f5',
          color: isDark ? '#ffffff' : '#1A1A1A',
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#0000FF',
            color: '#ffffff',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            backgroundColor: isDark ? '#18181b' : '#FFFFFF',
            color: isDark ? '#ffffff' : '#1A1A1A',
            '& fieldset': {
              borderColor: isDark ? '#3f3f46' : '#e4e4e7',
            },
            '&:hover fieldset': {
              borderColor: isDark ? '#52525b' : '#d4d4d8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0000FF',
            },
          },
          '& .MuiInputLabel-root': {
            color: isDark ? '#a1a1aa' : '#666666',
          },
          '& .MuiOutlinedInput-input': {
            color: isDark ? '#ffffff' : '#1A1A1A',
            '&::placeholder': {
              color: isDark ? '#71717a' : '#9ca3af',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: isDark ? '#3f3f46' : '#e4e4e7',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: isDark ? '#ffffff' : '#1A1A1A',
        },
        body2: {
          color: isDark ? '#a1a1aa' : '#666666',
        },
        caption: {
          color: isDark ? '#71717a' : '#9ca3af',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
            color: isDark ? '#a1a1aa' : '#666666',
            borderColor: isDark ? '#3f3f46' : '#e4e4e7',
            '&.Mui-selected': {
              backgroundColor: '#0000FF',
              color: '#ffffff',
            },
            '&:hover': {
              backgroundColor: isDark ? '#3f3f46' : '#f4f4f5',
            },
          },
        },
      },
    },
  },
});

// For backward compatibility, export the light theme as default
export const theme = createAppTheme(false);
