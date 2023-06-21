import { Box, Card, IconButton } from '@mui/material';
import { FC } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

interface IProps {
  start: number;
  currentDuration: number;
  totalDuration: number;
  link: string;
  isPlaying: boolean;
  togglePlaying: () => void;
}

const AudioPlayer: FC<IProps> = ({ start, currentDuration, totalDuration, link, isPlaying, togglePlaying }) => {
  return (
    <Card elevation={12} sx={{ display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center', padding: '8px', margin: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
        <IconButton aria-label="play/pause" onClick={togglePlaying}>
          {isPlaying ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
        </IconButton>
      </Box>
    </Card>
  );
};

export default AudioPlayer;

/* <CardMedia component="img" sx={{ width: 35, height: 35 }} image={theme.palette.mode === 'dark' ? 'https://i.imgur.com/tjACJH3.png' : 'https://i.imgur.com/NwRNjlK.png'} alt="EDEN logo" />; */
