import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { FC, useContext, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { ColorModeContext } from '../utils/ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import RulesModal from './RulesModal';
import LinksDrawer from './LinksDrawer';
import { Link } from 'react-router-dom';

const Navbar: FC = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [showDrawer, setShowDrawer] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setShowDrawer(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="sticky" sx={{ width: '100%', padding: '1rem' }}>
        <Toolbar variant="dense">
          <IconButton aria-label="menu" edge="start" color="inherit" size="large" onClick={() => toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h1" sx={{ flexGrow: 1 }} noWrap fontSize="4rem">
              EDEN Heardle
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex' }}>
            <IconButton aria-label="stats" color="inherit" size="large">
              <ShowChartOutlinedIcon />
            </IconButton>
            <IconButton aria-label="leaderboard" color="inherit" size="large">
              <LeaderboardOutlinedIcon />
            </IconButton>
            <IconButton aria-label="rules" color="inherit" size="large" onClick={() => setShowRules(true)}>
              <HelpOutlineIcon />
            </IconButton>
            <IconButton aria-label="theme" color="inherit" sx={{ ml: 1 }} onClick={colorMode.toggleColorMode}>
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <IconButton aria-label="settings" color="inherit" size="large">
              <SettingsIcon />
            </IconButton>
            <RulesModal open={showRules} closeModal={() => setShowRules(false)} />
          </Box>
        </Toolbar>
      </AppBar>
      <LinksDrawer open={showDrawer} toggleDrawer={toggleDrawer} />
    </Box>
  );
};

export default Navbar;
