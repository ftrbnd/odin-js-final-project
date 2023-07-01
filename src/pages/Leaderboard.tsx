import { FC } from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Leaderboard: FC = () => {
  return (
    <>
      <AppBar position="static" enableColorOnDark>
        <Toolbar sx={{ display: 'grid', justifyItems: 'center' }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link to="/play" style={{ textDecoration: 'none', color: 'inherit' }}>
              EDEN Heardle
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Leaderboard;
