import { FC, useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Autocomplete, Box, Snackbar, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import ProgressRows from '../components/ProgressRows';
import AudioPlayer from '../components/AudioPlayer';

export type CorrectStatus = 'CORRECT' | 'WRONG' | 'ALBUM';
export interface Song {
  name: string;
  link: string;
  cover: string;
  album?: string;
  correct?: CorrectStatus;
}

const GUESS_LIMIT = 6;

const emptySong: Song = {
  name: 'ㅤ',
  link: '',
  cover: '',
  album: ''
};

const initialGuessState = [emptySong, emptySong, emptySong, emptySong, emptySong, emptySong];

const Game: FC = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const [options, setOptions] = useState<readonly Song[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const [guesses, setGuesses] = useState<Song[]>(initialGuessState);
  const guessCount = useRef<number>(0);
  const [dailySong, setDailySong] = useState<Song>({
    name: '',
    link: '',
    cover: ''
  });

  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    // if today is same day as song's day, set it to state
    // else if today is day after the song's date, choose a new one from collection/songs

    async function fetchDailySong() {
      console.log('Fetching daily song...');

      const docRef = doc(db, 'daily_song', 'song');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const song = docSnap.data();
        setDailySong({
          name: song.name,
          link: song.link,
          cover: song.cover,
          album: song.album
        });
        console.log('Found daily song: ', song.name);
      } else {
        console.log('No daily song found in database!');
      }
    }

    async function fetchSongs() {
      const songs: Song[] = [];
      console.log('Fetching songs...');

      const querySnapshot = await getDocs(collection(db, 'songs'));
      querySnapshot.forEach((doc) => {
        songs.push({
          name: doc.id,
          link: doc.data().link,
          cover: doc.data().cover,
          album: doc.data().album
        });
      });

      return songs;
    }

    fetchDailySong();
    fetchSongs().then((songs) => setOptions(songs));
  }, []);

  useEffect(() => {
    switch (location.state) {
      case 'LOG_IN':
        setShowSnackbar(true);
        setSnackbarMessage(`Welcome back ${user.profile.username}!`);
        navigate(location.pathname, { replace: true });
        break;
      case 'SIGN_UP':
        setShowSnackbar(true);
        setSnackbarMessage(`Welcome ${user.profile.username}!`);
        navigate(location.pathname, { replace: true });
        break;
      case 'SHOW_RULES':
        setShowRules(true);
        navigate(location.pathname, { replace: true });
        break;
    }
  }, [location.pathname, location.state, navigate, user.profile.username]);

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handleAutocompleteChange = (song: Song | null) => {
    if (!song) return;
    console.log('Chosen song: ', song?.name);

    guessCount.current++;

    if (song.name === dailySong.name) {
      song.correct = 'CORRECT';
      guessCount.current = GUESS_LIMIT;
    } else if (song.album === dailySong.album) {
      song.correct = 'ALBUM';
    } else {
      song.correct = 'WRONG';
    }

    setGuesses((prevGuesses) => {
      const newGuesses = [];

      for (let i = 0; i < prevGuesses.length; i++) {
        if (prevGuesses[i] !== emptySong) {
          newGuesses.push(prevGuesses[i]);
        } else {
          // found the first empty song
          newGuesses.push(song);
          const remainingGuesses = new Array(GUESS_LIMIT - guessCount.current).fill(emptySong);
          newGuesses.push(...remainingGuesses);
          break;
        }
      }

      return newGuesses;
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
      <Navbar showRules={showRules} setShowRules={setShowRules} />
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={handleSnackbarClose} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <ProgressRows guesses={guesses} limit={GUESS_LIMIT} />

      <Box sx={{ display: 'grid', gridTemplateRows: 'auto auto', alignItems: 'center' }}>
        <AudioPlayer start={15} currentDuration={guessCount.current + 1} totalDuration={GUESS_LIMIT} link={dailySong.link} />

        <Autocomplete
          id="song-options"
          sx={{ width: '100%', padding: '1rem', justifySelf: 'center' }}
          onChange={(_event, value) => handleAutocompleteChange(value)}
          isOptionEqualToValue={(option: Song, value: Song) => option.name === value.name}
          getOptionLabel={(option: Song) => option.name}
          options={options}
          getOptionDisabled={(option) => guesses.some((song) => song.name === option.name) || guessCount.current === GUESS_LIMIT}
          renderInput={(params) => <TextField {...params} label="Choose a song" />}
        />
      </Box>
    </Box>
  );
};

export default Game;

// 🟥🟧🟩
