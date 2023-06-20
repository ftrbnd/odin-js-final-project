import { FC } from 'react';
import { Song } from '../pages/Game';
import { Typography } from '@mui/material';

interface IProps {
  guesses: Song[];
}

const ProgressRows: FC<IProps> = ({ guesses }) => {
  return (
    <div>
      {guesses.map((guess) => (
        <Typography variant="subtitle1">{guess.name}</Typography>
      ))}
    </div>
  );
};

export default ProgressRows;
