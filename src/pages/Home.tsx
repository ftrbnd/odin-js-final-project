import { FC, useEffect, useState } from 'react';
import { Avatar, Button, Stack, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { auth, db } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { resetLocalUser } from '../features/localUserSlice';
import { GUESS_LIMIT } from '../utils/exports';
import { useGetUserQuery } from '../features/apiSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import edenLogoLight from '../assets/eden-logo-light.png';
import edenLogoDark from '../assets/eden-logo-dark.png';
import { doc, getDoc } from 'firebase/firestore';

const Home: FC = () => {
  const [username, setUsername] = useState('');
  const { data: user } = useGetUserQuery(auth.currentUser?.uid ?? skipToken);
  const [heardleNumber, setHeardleNumber] = useState(0);

  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        setUsername(user.displayName);
        dispatch(resetLocalUser());
      } else {
        setUsername('');
      }
    });

    async function fetchHeardleNumber() {
      const docRef = doc(db, 'daily_song', 'midnight');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) return docSnap.data().number;
      return 0;
    }

    fetchHeardleNumber().then((num) => setHeardleNumber(num));

    return unsubscribe;
  }, []);

  const homePageText = () => {
    if (!auth.currentUser || !user) return 'Get 6 chances to guess an EDEN song.';

    if (user.daily.shareText.at(-1) == 'CORRECT') {
      return "Great job on today's puzzle! Check out your progress.";
    }
    if (user.daily.complete && user.daily.shareText.at(-1) !== 'CORRECT') {
      return "Tomorrow's a new day, with a new puzzle. See you then.";
    }
    if (!user.daily.complete && user.daily.shareText.length > 0) {
      return `You're on attempt ${user.daily.progress.length + 1} out of ${GUESS_LIMIT}. Keep it up!`;
    }
    if (!user.daily.complete && user.daily.shareText.length === 0) {
      return "Get started on today's puzzle!";
    }
  };

  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" spacing={3} padding="2rem">
      <Stack sx={{ flexDirection: { xs: 'column', sm: 'row' } }} alignItems="center" gap="1rem">
        <Avatar alt="eden logo" src={theme.palette.mode === 'dark' ? edenLogoDark : edenLogoLight} />
        <Typography variant={!auth.currentUser ? 'h3' : 'h4'} align="center" fontWeight="bold">
          EDEN Heardle
        </Typography>
      </Stack>

      {auth.currentUser && user && (
        <Typography variant="h3" fontWeight="bold" textAlign="center">
          Welcome back, {username}
        </Typography>
      )}

      <Typography variant="h4" align="center">
        {homePageText()}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={2}>
        {!username && (
          <>
            {' '}
            <Link to="/play" state={'SHOW_RULES'}>
              <Button variant="outlined">How to play</Button>
            </Link>
            <Link to="/auth">
              <Button variant="outlined">Log in</Button>
            </Link>
          </>
        )}
        <Link to="/play">
          <Button variant="contained">{user?.daily.complete ? 'Stats' : 'Play'}</Button>
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
          No. {heardleNumber}
        </Typography>
        <Typography variant="subtitle1" align="center">
          Created by giosalad
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Home;
