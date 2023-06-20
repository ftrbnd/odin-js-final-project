import { FC, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import { Alert, Autocomplete, Box, Card, CardMedia, CircularProgress, IconButton, Snackbar, TextField, Typography, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { collection, getDocs } from 'firebase/firestore';
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

  const { state } = useLocation();
  const user = useSelector((state: RootState) => state.user);

  const [guesses, setGuesses] = useState<Song[]>([]);
  const [playing, setPlaying] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    switch (state) {
      case 'LOG_IN':
        setShowSnackbar(true);
        setSnackbarMessage(`Welcome back ${user.profile.username}!`);
        break;
      case 'SIGN_UP':
        setShowSnackbar(true);
        setSnackbarMessage(`Welcome ${user.profile.username}!`);
        break;
    }
  }, [state, user.profile.username]);

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

    song.correct = Math.random() === 0; // temporary until logic for daily song is implemented
    setGuesses((prevGuesses) => [...prevGuesses, song]);
  };

  const togglePlaying = () => {
    setPlaying((prev) => !prev);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100vh' }}>
      <Navbar />
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
              label="Song options"
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
