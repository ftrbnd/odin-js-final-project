import { FC, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, Autocomplete, Box, Card, CardMedia, CircularProgress, IconButton, Snackbar, TextField, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import ProgressRows from '../components/ProgressRows';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export interface Song {
  name: string;
  link: string;
  album?: string;
  correct?: boolean;
}

const GUESS_LIMIT = 6;

const Game: FC = () => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false);
  const [options, setOptions] = useState<readonly Song[]>([]);
  const loading = openAutocomplete && options.length === 0;

  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const [guesses, setGuesses] = useState<Song[]>([]);
  const [playing, setPlaying] = useState(false);
  const [dailySong, setDailySong] = useState<Song>({
    name: '',
    link: ''
  });

  const theme = useTheme();
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
          album: song.album
        });
        console.log('Found daily song: ', song.name);
      } else {
        console.log('No daily song found in database!');
      }
    }

    fetchDailySong();
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

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    async function fetchSongs() {
      const songs: Song[] = [];
      console.log('Fetching songs...');

      const querySnapshot = await getDocs(collection(db, 'songs'));
      querySnapshot.forEach((doc) => {
        songs.push({
          name: doc.id,
          link: doc.data().link,
          album: doc.data().album
        });
      });

      return songs;
    }

    (async () => {
      const songs = await fetchSongs();

      if (active) {
        setOptions(songs);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!openAutocomplete) {
      setOptions([]);
    }
  }, [openAutocomplete]);

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  const handleAutocompleteChange = (song: Song | null) => {
    if (!song) return;
    console.log('Chosen song: ', song?.name);

    //TODO: determine if song is correct
    // - then show snackbar according to guess

    song.correct = Math.random() === 0; // temporary until logic for daily song is implemented
    setGuesses((prevGuesses) => [...prevGuesses, song]);
  };

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
      <Navbar showRules={showRules} setShowRules={setShowRules} />
      <Snackbar open={showSnackbar} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" onClose={handleClose} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Box sx={{ padding: '2rem', display: 'grid', gridTemplateRows: `repeat(${GUESS_LIMIT + 1}, 1fr)`, justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
        <ProgressRows guesses={guesses} />
        <Autocomplete
          id="song-options"
          sx={{ width: 300, gridRow: 7, padding: '1rem' }}
          open={openAutocomplete}
          onOpen={() => setOpenAutocomplete(true)}
          onChange={(_event, value) => handleAutocompleteChange(value)}
          onClose={() => setOpenAutocomplete(false)}
          isOptionEqualToValue={(option: Song, value: Song) => option.name === value.name}
          getOptionLabel={(option: Song) => option.name}
          options={options}
          getOptionDisabled={(option) => guesses.some((song) => song.name === option.name) || guesses.length === GUESS_LIMIT}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a song"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                )
              }}
            />
          )}
        />
      </Box>

      <Card elevation={12} sx={{ display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center', padding: '8px', margin: '16px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
          <IconButton aria-label="play/pause" onClick={togglePlaying}>
            {playing ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
          </IconButton>
        </Box>
        <CardMedia component="img" sx={{ width: 35, height: 35 }} image={theme.palette.mode === 'dark' ? 'https://i.imgur.com/tjACJH3.png' : 'https://i.imgur.com/NwRNjlK.png'} alt="EDEN logo" />
      </Card>
    </Box>
  );
};

export default Game;
