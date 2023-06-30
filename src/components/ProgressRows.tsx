import { FC } from 'react';
import { Song } from '../pages/Game';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { CorrectStatus } from '../utils/types';
interface IProps {
  guesses: Song[];
  limit: number;
}

const guessStatusIcon = (status: CorrectStatus | undefined) => {
  switch (status) {
    case 'WRONG':
      return <ClearIcon sx={{ height: { xs: 25, sm: 50 }, width: { xs: 25, sm: 50 } }} color="error" />;
    case 'ALBUM':
      return <ClearIcon sx={{ height: { xs: 25, sm: 50 }, width: { xs: 25, sm: 50 } }} color="warning" />;
    case 'CORRECT':
      return <CheckIcon sx={{ height: { xs: 25, sm: 50 }, width: { xs: 25, sm: 50 } }} color="success" />;
    default:
      return <></>;
  }
};

interface CardProps {
  children?: React.ReactNode;
  song: Song;
}

export const SongCard: FC<CardProps> = ({ song }) => {
  return (
    <Card
      elevation={6}
      sx={{
        width: '100%',
        minWidth: { sx: 250, sm: 350 },
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: '1rem',
        justifyItems: 'center',
        alignItems: 'center',
        padding: { xs: '8px', sm: '1rem' }
      }}
    >
      {song.cover ? (
        <CardMedia component="img" sx={{ width: { xs: 25, sm: 50 }, height: { xs: 25, sm: 50 } }} image={song.cover} alt="EDEN logo" />
      ) : (
        <Box sx={{ width: { xs: 25, sm: 50 }, height: { xs: 25, sm: 50 } }}></Box>
      )}
      <Typography variant="subtitle1" sx={{ textAlign: 'center' }} fontWeight={'bold'}>
        {song.name}
      </Typography>
      {guessStatusIcon(song.correct)}
    </Card>
  );
};

const ProgressRows: FC<IProps> = ({ guesses, limit }) => {
  return (
    <Box sx={{ alignSelf: 'center', padding: '1rem', display: 'grid', gridTemplateRows: `repeat(${limit}, 1fr)`, justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
      {guesses.map((song, index) => (
        <SongCard key={`${song.name}-${index}`} song={song} />
      ))}
    </Box>
  );
};

export default ProgressRows;
