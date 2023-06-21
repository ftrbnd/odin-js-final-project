import { FC } from 'react';
import { Song } from '../pages/Game';
import { Box, Card, CardContent, Typography } from '@mui/material';

interface IProps {
  guesses: Song[];
  limit: number;
}

const ProgressRows: FC<IProps> = ({ guesses, limit }) => {
  return (
    <Box sx={{ padding: '2rem', display: 'grid', gridTemplateRows: `repeat(${limit}, 1fr)`, justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
      {guesses.map((guess) => (
        <Card elevation={6} sx={{ minWidth: 275, display: 'grid', justifyItems: 'center', padding: '1rem' }}>
          <Typography variant="subtitle1" sx={{ textAlign: 'center' }} fontSize="1rem">
            {guess.name}
          </Typography>
        </Card>
      ))}
    </Box>
  );
};

export default ProgressRows;
