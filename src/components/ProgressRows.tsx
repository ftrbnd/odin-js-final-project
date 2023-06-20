import { FC } from 'react';
import { Song } from '../pages/Game';
import { Card, CardContent, Typography } from '@mui/material';

interface IProps {
  guesses: Song[];
}

const ProgressRows: FC<IProps> = ({ guesses }) => {
  return (
    <>
      {guesses.map((guess) => (
        <Card sx={{ minWidth: 275, display: 'grid', justifyItems: 'center' }}>
          <CardContent>
            <Typography variant="subtitle1">{guess.name}</Typography>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ProgressRows;
