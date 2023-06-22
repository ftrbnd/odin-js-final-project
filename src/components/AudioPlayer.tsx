import { Box, Card, CircularProgress, IconButton, LinearProgress, LinearProgressProps, Typography } from '@mui/material';
import { FC, useRef, useState, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ReactPlayer from 'react-player/youtube';

interface IProps {
  start: number;
  currentDuration: number;
  totalDuration: number;
  link: string;
  isPlaying: boolean;
  togglePlaying: () => void;
}

const formatTime = (seconds: number, minutes = 0) => {
  return `${String(minutes).padStart(2, '0')}:${String(seconds)[0].padStart(2, '0')}`;
};

const LinearProgressWithLabel = (props: LinearProgressProps & { currentSecond: number; finalSecond: number; progress: number; buffer: number }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {formatTime(props.currentSecond)}
        </Typography>
      </Box>
      <Box sx={{ width: '100%', mr: 1, ml: 1 }}>
        <LinearProgress variant="buffer" value={props.progress} valueBuffer={props.buffer} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">
          {formatTime(props.finalSecond)}
        </Typography>
      </Box>
    </Box>
  );
};

const AudioPlayer: FC<IProps> = ({ start, currentDuration, totalDuration, link, isPlaying, togglePlaying }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [curSecond, setCurSecond] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [buffer, setBuffer] = useState((currentDuration / totalDuration) * 100);

  useEffect(() => {
    if (currentDuration - 1 === totalDuration) {
      setBuffer(100);
      setProgress(100);
    }

    setBuffer((currentDuration / totalDuration) * 100);
  }, [currentDuration, totalDuration]);

  const handleReady = () => {
    console.log('Player ready!');
    setPlayerReady(true);
    playerRef.current?.seekTo(start);
  };

  const handlePlay = () => {
    console.log('onPlay');

    setPlayerReady(true);
  };

  const handlePause = () => {
    if (!playerRef.current) return;

    playerRef.current?.seekTo(start);
    setCurSecond(0);
    setProgress(0);
  };

  const handleProgress = () => {
    if (!playerRef.current || !isPlaying) return;

    setCurSecond(getCurrentSecond());
    setProgress((getCurrentSecond() / totalDuration) * 100);

    if (playerRef.current.getCurrentTime() - start > currentDuration) {
      // limit playback to current level (1-6)
      togglePlaying();

      setCurSecond(0);
      setProgress(0);
    }
  };

  const handleSeek = () => {
    console.log('onSeek');
    setPlayerReady(true);
  };

  const handleError = () => {
    console.log('onError');
  };

  const handleBuffer = () => {
    console.log('Buffering...');

    playerRef.current?.seekTo(start);
  };

  const handleBufferEnd = () => {
    console.log('Buffering ended.');

    setPlayerReady(true);
  };

  function getCurrentSecond(): number {
    if (!playerRef.current) return 0;

    return playerRef.current.getCurrentTime() - start;
  }

  return (
    <Card elevation={12} sx={{ display: 'grid', gridTemplateColumns: '1fr', justifyItems: 'center', padding: '8px', margin: '16px' }}>
      <LinearProgressWithLabel currentSecond={curSecond} finalSecond={totalDuration} progress={progress} buffer={buffer} />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {playerReady ? (
          <IconButton aria-label="play/pause" onClick={togglePlaying}>
            {isPlaying ? <PauseIcon sx={{ height: 38, width: 38 }} /> : <PlayArrowIcon sx={{ height: 38, width: 38 }} />}
          </IconButton>
        ) : (
          <Box sx={{ display: 'flex' }}>
            <CircularProgress sx={{ height: 38, width: 38 }} />
          </Box>
        )}
        <ReactPlayer
          ref={playerRef}
          url={link}
          playing={isPlaying}
          volume={0.5}
          style={{ display: 'none' }}
          progressInterval={200}
          onReady={handleReady}
          onPlay={handlePlay}
          onPause={handlePause}
          onProgress={handleProgress}
          onSeek={handleSeek}
          onError={handleError}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
        />
      </Box>
    </Card>
  );
};

export default AudioPlayer;
