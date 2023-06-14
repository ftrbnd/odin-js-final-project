import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { FC } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

const Navbar: FC = () => {
  return (
    <AppBar position="static" sx={{ width: '100%', padding: '1rem' }}>
      <Toolbar variant="dense">
        <IconButton aria-label="menu" edge="start" color="inherit" size="large">
          <MenuIcon />
        </IconButton>
        <Typography variant="h1" sx={{ flexGrow: 1 }} noWrap fontSize="4rem">
          EDEN Heardle
        </Typography>
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
