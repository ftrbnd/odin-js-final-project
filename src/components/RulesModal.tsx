import { Divider, List, ListItem, ListItemText, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { SongCard } from './ProgressRows';
import { Song } from '../pages/Game';

interface IProps {
  open: boolean;
  closeModal: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const sampleSong: Song = {
  name: 'Gravity',
  link: 'https://youtu.be/3ieHOFTd-hs',
  cover: 'https://i1.sndcdn.com/artworks-000123341011-uyahoc-t500x500.jpg',
  album: 'End Credits',
  correct: 'WRONG'
};

const anotherSong: Song = {
  name: 'Circles',
  link: 'https://youtu.be/fP8ElyrwtEc',
  cover: 'https://i1.sndcdn.com/artworks-000177424141-vs8frr-t500x500.jpg',
  album: 'i think you think too much of me',
  correct: 'ALBUM'
};

const RulesModal: FC<IProps> = ({ open, closeModal }) => {
  return (
    <div>
      <Dialog open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>How To Play</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{'Guess the song in 6 tries.'}</Typography>
          <List dense>
            <ListItemText>• Each guess must be a valid song.</ListItemText>
            <ListItemText>• The color of the tiles will change if your guess belongs to the same album.</ListItemText>
          </List>
          <Typography variant="h6">Examples</Typography>
          <List>
            <ListItem sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SongCard song={sampleSong} />
              <Typography variant="body1">Gravity does not share the same album.</Typography>
            </ListItem>
            <ListItem sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <SongCard song={anotherSong} />
              <Typography variant="body1">Circles shares the same album!</Typography>
            </ListItem>
          </List>
          <Divider />
          <Typography variant="body1">
            <Link to="/auth">Log in or create an account</Link> to link your stats.
          </Typography>
          <Divider />
          <Typography variant="body1">A new puzzle is released daily at midnight. If you haven't already, you can sign up for our daily reminder email.</Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RulesModal;
