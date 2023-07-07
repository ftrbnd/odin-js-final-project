import { Alert, Box, Button, DialogActions, Divider, Link, List, ListItemText, Snackbar, Stack, TextField, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, useState, KeyboardEvent, useEffect, ChangeEvent } from 'react';
import styles from '../styles/SettingsModal.module.scss';
import { sendEmailVerification, signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

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

  const [usernameInput, setUsernameInput] = useState('');
  const [usernameError, setUsernameError] = useState(false);
  const [formValid, setFormValid] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');

  const navigate = useNavigate();

  const logOut = async () => {
    await signOut(auth);
    closeModal();
    navigate('/');
  };

  useEffect(() => {
    console.log(usernameInput);
  }, [usernameInput]);

  const handleUpdateUsername = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUsernameInput(event.target.value);

    if (!usernameInput || event.target.value.length < 3 || event.target.value.length > 10) {
      setUsernameError(true);
      return;
    }

    setUsernameError(false);
  };

  const handleSubmitUsername = async () => {
    if (usernameError || !usernameInput) {
      setAlertSeverity('error');
      setFormValid('Username must be 3-10 characters long.');
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('profile.username', '==', usernameInput));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setIsLoading(false);
      setAlertSeverity('error');
      setFormValid('Username already exists!');
      return;
    }

    try {
      setIsLoading(true);

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: usernameInput
        });

        const userRef = doc(usersRef, auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          throw new Error('User not found in database!');
        }

        await updateDoc(userRef, {
          profile: {
            ...userSnap.data().profile,
            username: usernameInput
          }
        });

        setUsernameInput('');
        setAlertSeverity('success');
        setFormValid('Username successfully updated!');
        setIsLoading(false);
        closeModal();
      }
    } catch (e: any) {
      console.error(e);

      setAlertSeverity('error');
      setFormValid(e.code);
      setIsLoading(false);
    }
  };

  const handleEnter = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleSubmitUsername();
    }
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
      <Dialog fullWidth open={open} TransitionComponent={Transition} onClose={closeModal} aria-describedby="alert-dialog-slide-description">
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
            <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
              <TextField
                value={usernameInput}
                label="Update Username"
                type="text"
                fullWidth
                error={usernameError}
                variant="outlined"
                id="outlined-update-username"
                size="small"
                margin="dense"
                onKeyDown={(e) => handleEnter(e)}
                onChange={(event) => handleUpdateUsername(event)}
              />
              <Button disabled={isLoading} variant="outlined" onClick={handleSubmitUsername}>
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </Box>
            {formValid && (
              <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
                <Alert severity={alertSeverity}>{formValid}</Alert>
              </Stack>
            )}
          </List>

          <Typography variant="subtitle2">© 2023 giosalad</Typography>
        </DialogContent>

        <DialogActions>
          {auth.currentUser && !auth.currentUser?.emailVerified && (
            <Button color="warning" onClick={handleVerifyEmail}>
              Verify your email
            </Button>
          )}

          {auth.currentUser ? <Button onClick={logOut}>Log Out</Button> : <Button onClick={() => navigate('/auth')}>Log In</Button>}
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
