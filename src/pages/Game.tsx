import { FC, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Autocomplete, Box, Snackbar, TextField, Typography } from '@mui/material';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';
import ProgressRows from '../components/ProgressRows';
import AudioPlayer from '../components/AudioPlayer';
import { useGetUserQuery, useUpdateCompleteStatusMutation, useUpdateProgressMutation, useUpdateShareTextMutation, useUpdateStatsMutation } from '../features/apiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { updateLocalComplete, updateLocalShareText } from '../features/localUserSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { GUESS_LIMIT, Song, emptySong } from '../utils/exports';
import { RootState } from '../app/store';
import useCountdown from '../utils/useCountdown';

const initialGuessState = [emptySong, emptySong, emptySong, emptySong, emptySong, emptySong];

const Game: FC = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const [options, setOptions] = useState<readonly Song[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  const { data: user } = useGetUserQuery(auth.currentUser?.uid ?? skipToken);
  const [updateShareText] = useUpdateShareTextMutation();
  const [updateComplete] = useUpdateCompleteStatusMutation();
  const [updateProgress] = useUpdateProgressMutation();
  const [updateStats] = useUpdateStatsMutation();

  const localUser = useSelector((state: RootState) => state.localUser);
  const { hours, minutes, seconds } = useCountdown();
  const dispatch = useDispatch();

  const [dailySong, setDailySong] = useState<Song>({
    name: '',
    link: '',
    cover: ''
  });
  const [guesses, setGuesses] = useState<Song[]>(initialGuessState);
  const [guessCount, setGuessCount] = useState<number>(0);

  const [showRules, setShowRules] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    // on mount: fetch daily song and song options
    async function fetchDailySong() {
      // console.log('Fetching daily song...');

      const docRef = doc(db, 'daily_song', 'song');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const song = docSnap.data();
        setDailySong({
          name: song.name,
          link: song.link,
          cover: song.cover,
          album: song.album,
          start: song.start
        });
        // console.log('Found daily song: ', song.name);
      } else {
        console.log('No daily song found in database!');
      }
    }

    async function fetchSongs() {
      const songs: Song[] = [];
      // console.log('Fetching songs...');

      const querySnapshot = await getDocs(collection(db, 'songs'));
      querySnapshot.forEach((doc) => {
        const regex = /--/g; // for vertigo songs; ex. start//end stored in database as start--end
        songs.push({
          name: doc.id.replace(regex, '//'),
          link: doc.data().link,
          cover: doc.data().cover,
          album: doc.data().album || ''
        });
      });

      return songs;
    }

    fetchDailySong();
    fetchSongs().then((songs) => setOptions(songs));
  }, []);

  useEffect(() => {
    if (auth.currentUser && user) {
      if (user.daily.complete) setShowStats(true);
    }
  }, [user]);

  useEffect(() => {
    switch (location.state) {
      case 'LOG_IN':
        setShowSnackbar(true);
        setSnackbarMessage(`Welcome back ${auth.currentUser?.displayName}!`);
        navigate(location.pathname, { replace: true });
        break;
      case 'SIGN_UP':
        setShowSnackbar(true);
        setSnackbarMessage(`Welcome ${auth.currentUser?.displayName}!`);
        navigate(location.pathname, { replace: true });
        break;
      case 'SHOW_RULES':
        setShowRules(true);
        navigate(location.pathname, { replace: true });
        break;
    }
  }, [location.pathname, location.state, navigate, user, user?.profile.username]);

  useEffect(() => {
    if (guessCount === GUESS_LIMIT) {
      if (auth.currentUser) {
        updateComplete({ userId: auth.currentUser.uid, complete: true });
        updateStats({ userId: auth.currentUser.uid, gameWon: localUser.daily.shareText.at(-1) === 'CORRECT' });
      } else {
        dispatch(updateLocalComplete(true));
      }

      setShowStats(true); // pull up stats modal
    }
  }, [guessCount]);

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handleAutocompleteChange = async (song: Song | null) => {
    if (!song) return;

    setGuessCount((prevCount) => prevCount + 1);

    if (song.name === dailySong.name) {
      song.correct = 'CORRECT'; // sets song's card to check icon
      setGuessCount(GUESS_LIMIT); // disable more autocomplete selections

      if (auth.currentUser) {
        updateShareText({ userId: auth.currentUser.uid, correctSquare: 'CORRECT' });
        updateProgress({ userId: auth.currentUser.uid, song: song });
      }
      dispatch(updateLocalShareText('CORRECT'));
    } else if (song.album && song.album === dailySong.album) {
      song.correct = 'ALBUM';

      if (auth.currentUser) {
        updateShareText({ userId: auth.currentUser.uid, correctSquare: 'ALBUM' });
        updateProgress({ userId: auth.currentUser.uid, song: song });
      }
      dispatch(updateLocalShareText('ALBUM'));
    } else {
      song.correct = 'WRONG';

      if (auth.currentUser) {
        updateShareText({ userId: auth.currentUser.uid, correctSquare: 'WRONG' });
        updateProgress({ userId: auth.currentUser.uid, song: song });
      }
      dispatch(updateLocalShareText('WRONG'));
    }

    setGuesses((prevGuesses) => {
      const newGuesses = [];

      for (let i = 0; i < prevGuesses.length; i++) {
        if (prevGuesses[i] !== emptySong) {
          newGuesses.push(prevGuesses[i]);
        } else {
          // found the first empty song
          newGuesses.push(song);
          const remainingGuesses = new Array(GUESS_LIMIT - guessCount).fill(emptySong);
          newGuesses.push(...remainingGuesses);
          break;
        }
      }

      return newGuesses;
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
      <Navbar showRules={showRules} setShowRules={setShowRules} showStats={showStats} setShowStats={setShowStats} />
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={handleSnackbarClose} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}>
        {auth.currentUser && user ? <ProgressRows guesses={user?.daily.progress || initialGuessState} limit={GUESS_LIMIT} /> : <ProgressRows guesses={guesses} limit={GUESS_LIMIT} />}

        {auth.currentUser && user && user.daily.complete && (
          <Typography variant="h6" textAlign="center">
            {user.daily.progress?.at(-1)?.correct === 'CORRECT' ? "Great job on today's puzzle! Check back tomorrow for a new song." : `The song was "${dailySong.name}", try again tomorrow!`}
          </Typography>
        )}
        {localUser && localUser.daily.complete && (
          <Typography variant="h6" textAlign="center">
            {localUser.daily.shareText?.at(-1) === 'CORRECT' ? "Great job on today's puzzle! Check back tomorrow for a new song." : `The song was "${dailySong.name}", try again tomorrow!`}
          </Typography>
        )}

        {(user?.daily.complete || localUser.daily.complete) && (
          <Typography variant="subtitle1">
            Next song in: {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateRows: 'auto auto', alignItems: 'center' }}>
        <AudioPlayer start={dailySong.start || 0} currentDuration={auth.currentUser && user && user.daily.complete ? GUESS_LIMIT : guessCount + 1} totalDuration={GUESS_LIMIT} link={dailySong.link} />

        <Autocomplete
          id="song-options"
          sx={{ width: '100%', padding: '1rem', justifySelf: 'center' }}
          onChange={(_event, value) => handleAutocompleteChange(value)}
          isOptionEqualToValue={(option: Song, value: Song) => option.name === value.name}
          getOptionLabel={(option: Song) => option.name}
          options={options}
          getOptionDisabled={(option) => {
            if (auth.currentUser && user) {
              return user.daily.progress?.some((song) => song.name === option.name) || user.daily.complete;
            }
            return guesses.some((song) => song.name === option.name) || guessCount === GUESS_LIMIT;
          }}
          renderInput={(params) => <TextField {...params} label="Choose a song" />}
        />
      </Box>
    </Box>
  );
};

export default Game;
