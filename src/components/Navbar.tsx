import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { FC, useContext } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../utils/ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navbar: FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  return (
    <AppBar position="sticky" sx={{ width: '100%', padding: '1rem' }}>
      <Toolbar variant="dense">
        <IconButton aria-label="menu" edge="start" color="inherit" size="large">
          <MenuIcon />
        </IconButton>
        <Typography variant="h1" sx={{ flexGrow: 1 }} noWrap fontSize="4rem">
          EDEN Heardle
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton aria-label="rules" color="inherit" size="large">
          <HelpOutlineIcon />
        </IconButton>
        <IconButton aria-label="stats" color="inherit" size="large">
          <ShowChartOutlinedIcon />
        </IconButton>
        <IconButton aria-label="leaderboard" color="inherit" size="large">
          <LeaderboardOutlinedIcon />
        </IconButton>
        <IconButton aria-label="settings" color="inherit" size="large">
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
