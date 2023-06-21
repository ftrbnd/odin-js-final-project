import { Button, DialogActions, Divider, List, ListItemText, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef } from 'react';
import styles from '../styles/SettingsModal.module.scss';
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

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

const SettingsModal: FC<IProps> = ({ open, closeModal }) => {
  const navigate = useNavigate();

  const logOut = async () => {
    await signOut(auth);
    closeModal();
    navigate('/');
  };

  return (
    <div>
      <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <List>
            <ListItemText primary="Feedback" secondary="Email" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
            <Divider />
            <ListItemText primary="Community" secondary="Discord" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
            <Divider />
            <ListItemText primary="Questions?" secondary="FAQ" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
            <Divider />
          </List>
          <div>© 2023 giosalad</div>
        </DialogContent>
        <DialogActions>
          {auth.currentUser ? (
            <Button autoFocus onClick={logOut}>
              Log Out
            </Button>
          ) : (
            <Button autoFocus onClick={() => navigate('/auth')}>
              Log In
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SettingsModal;
