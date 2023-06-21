import { Divider, List, ListItemText, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef } from 'react';
import { Link } from 'react-router-dom';

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
          <List>TODO: Add visual examples</List>
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
