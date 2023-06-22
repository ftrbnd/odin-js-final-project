import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
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
import SettingsModal from './SettingsModal';
import MoreIcon from '@mui/icons-material/MoreVert';
import StatsModal from './StatsModal';

interface IProps {
  showRules: boolean;
  setShowRules: React.Dispatch<React.SetStateAction<boolean>>;
  showStats: boolean;
  setShowStats: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: FC<IProps> = ({ showRules, setShowRules, showStats, setShowStats }) => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [showDrawer, setShowDrawer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState<null | HTMLElement>(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const toggleDrawer = (open: boolean) => {
    setShowDrawer(open);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          setShowStats(true);
          handleMobileMenuClose();
        }}
      >
        <IconButton aria-label="statistics" color="inherit" size="large">
          <ShowChartOutlinedIcon />
        </IconButton>
        <p>Statistics</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="leaderboard" color="inherit" size="large">
          <LeaderboardOutlinedIcon />
        </IconButton>
        <p>Leaderboard</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setShowRules(true);
          handleMobileMenuClose();
        }}
      >
        <IconButton aria-label="rules" color="inherit" size="large">
          <HelpOutlineIcon />
        </IconButton>
        <p>Rules</p>
      </MenuItem>
      <MenuItem onClick={colorMode.toggleColorMode}>
        <IconButton aria-label="theme" color="inherit" sx={{ ml: 1 }}>
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <p>Theme</p>
      </MenuItem>
      <MenuItem
        onClick={() => {
          setShowSettings(true);
          handleMobileMenuClose();
        }}
      >
        <IconButton aria-label="settings" color="inherit" size="large">
          <SettingsIcon />
        </IconButton>
        <p>Settings</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="sticky" enableColorOnDark>
        <Toolbar>
          <IconButton aria-label="menu" edge="start" color="inherit" size="large" onClick={() => toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }} noWrap>
              EDEN Heardle
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', sm: 'flex', md: 'flex' } }}>
            <IconButton aria-label="statistics" color="inherit" size="large" onClick={() => setShowStats(true)}>
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
            <IconButton aria-label="settings" color="inherit" size="large" onClick={() => setShowSettings(true)}>
              <SettingsIcon />
            </IconButton>
            <RulesModal open={showRules} closeModal={() => setShowRules(false)} />
            <SettingsModal open={showSettings} closeModal={() => setShowSettings(false)} />
            <StatsModal open={showStats} closeModal={() => setShowStats(false)} />
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none', md: 'none' } }}>
            <IconButton aria-label="mobile menu" color="inherit" size="large" aria-haspopup="true" onClick={handleMobileMenuOpen}>
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      <LinksDrawer open={showDrawer} toggleDrawer={toggleDrawer} />
    </Box>
  );
};

export default Navbar;
