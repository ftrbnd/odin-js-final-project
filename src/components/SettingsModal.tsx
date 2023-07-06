import { Alert, Button, DialogActions, Divider, Link, List, ListItemText, Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, useState } from 'react';
import styles from '../styles/SettingsModal.module.scss';
import { sendEmailVerification, signOut } from 'firebase/auth';
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
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const navigate = useNavigate();

  const logOut = async () => {
    await signOut(auth);
    closeModal();
    navigate('/');
  };

  const handleVerifyEmail = async () => {
    if (!auth.currentUser) return;

    try {
      await sendEmailVerification(auth.currentUser);

      setShowSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Email verification sent!');
    } catch (e: any) {
      console.error(e);

      setShowSnackbar(true);
      setSnackbarSeverity('error');

      switch (e.code) {
        case 'auth/too-many-requests':
          setSnackbarMessage('Too many requests, try again later.');
          break;
        default:
          setSnackbarMessage(e.code);
      }
    }
  };

  const handleSnackbarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setShowSnackbar(false);
  };

  return (
    <div>
      <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <List>
            <Link rel="noopener" target="mynewtab" href={`mailto:giosalas25@gmail.com?subject=EDEN Heardle Feedback`} underline="hover" variant="inherit" color="inherit">
              <ListItemText primary="Feedback" secondary="Email" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
            </Link>
            <Divider />
            <Link rel="noopener" target="mynewtab" href="https://discord.gg/futurebound" underline="hover" variant="inherit" color="inherit">
              <ListItemText primary="Community" secondary="Discord" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
            </Link>
            <Divider />
            <Link rel="noopener" target="mynewtab" href="https://twitter.com/finalcali" underline="hover" variant="inherit" color="inherit">
              <ListItemText primary="Questions?" secondary="Direct Message" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
            </Link>
            <Divider />
          </List>
          <div>© 2023 giosalad</div>
        </DialogContent>
        <DialogActions>
          {auth.currentUser && !auth.currentUser?.emailVerified && (
            <Button color="warning" onClick={handleVerifyEmail}>
              Verify your email
            </Button>
          )}

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
        <Snackbar open={showSnackbar} autoHideDuration={5000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert severity={snackbarSeverity} onClose={handleSnackbarClose} variant="filled">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Dialog>
    </div>
  );
};

export default SettingsModal;
