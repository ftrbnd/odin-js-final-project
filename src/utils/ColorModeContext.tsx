import { FC, PropsWithChildren, createContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

interface IColorModeContext {
  toggleColorMode: () => void;
  mode: 'dark' | 'light';
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ColorModeContext = createContext<IColorModeContext>({ toggleColorMode: () => {}, mode: 'light' });

const ColorModeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
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
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeProvider;
