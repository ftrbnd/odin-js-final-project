import { FC, PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, PaletteMode, ThemeProvider, createTheme } from '@mui/material';

type Theme = 'dark' | 'light';
interface IColorModeContext {
  toggleColorMode: () => void;
  mode: Theme;
}

function getThemePreference(): Theme {
  const preference = localStorage.getItem('theme');
  switch (preference) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    default:
      return 'light';
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ColorModeContext = createContext<IColorModeContext>({ toggleColorMode: () => {}, mode: 'light' });

const ColorModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<Theme>(getThemePreference());

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode
        }
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeProvider;
