import { FC } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth } from '../utils/firebase';

const Home: FC = () => {
  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" spacing={3} padding="2rem">
      <Typography variant="h2" align="center" fontWeight="bold">
        EDEN Heardle
      </Typography>
      <Typography variant="h4" align="center">
        Get 6 chances to guess an EDEN song.
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        {!auth.currentUser ? (
          <>
            {' '}
            <Link to="/play" state={'SHOW_RULES'}>
              <Button variant="outlined">How to play</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outlined">Log in</Button>
            </Link>
          </>
        ) : (
          <Typography variant="h6">Welcome back, {auth.currentUser?.displayName}</Typography>
        )}
        <Link to="/play">
          <Button variant="contained">Play</Button>
        </Link>
      </Stack>
      <Stack>
        <Typography variant="subtitle2" align="center">
          {new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </Typography>
        <Typography variant="subtitle1" align="center">
          Created by giosalad
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Home;
