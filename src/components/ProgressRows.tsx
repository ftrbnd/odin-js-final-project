import { FC } from 'react';
import { CorrectStatus, Song } from '../pages/Game';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
interface IProps {
  guesses: Song[];
  limit: number;
}

const guessStatusIcon = (status: CorrectStatus | undefined) => {
  switch (status) {
    case 'WRONG':
      return <ClearIcon sx={{ height: 50, width: 50 }} color="error" />;
    case 'ALBUM':
      return <ClearIcon sx={{ height: 50, width: 50 }} color="warning" />;
    case 'CORRECT':
      return <CheckIcon sx={{ height: 50, width: 50 }} color="success" />;
    default:
      return <></>;
  }
};

const ProgressRows: FC<IProps> = ({ guesses, limit }) => {
  return (
    <Box sx={{ padding: '2rem', display: 'grid', gridTemplateRows: `repeat(${limit}, 1fr)`, justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
      {guesses.map((song, index) => (
        <Card key={`${song.name}-${index}`} elevation={6} sx={{ minWidth: 275, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', justifyItems: 'center', alignItems: 'center', padding: '1rem' }}>
          {song.cover && <CardMedia component="img" sx={{ width: 50, height: 50 }} image={song.cover} alt="EDEN logo" />}
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }} fontSize="1rem" fontWeight={'bold'}>
            {song.name}
          </Typography>
          {guessStatusIcon(song.correct)}
        </Card>
      ))}
    </Box>
  );
};

export default ProgressRows;
