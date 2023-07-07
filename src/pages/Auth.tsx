import { FC, useEffect, useState } from 'react';
import { Paper, Switch, Box, Typography, AppBar, Toolbar, Divider, Button, Stack, CircularProgress, Alert } from '@mui/material';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
// import { faDiscord } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth, db, googleProvider } from '../utils/firebase';
import { onAuthStateChanged, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { emptyUser } from '../utils/exports';

const Auth: FC = () => {
  const [checked, setChecked] = useState(false);
  const [formValid, setFormValid] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.displayName) {
        navigate('/play');
      }
    });

    return unsubscribe;
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  // const signInWithDiscord = () => {
  //   console.log('Signing in with Discord...');
  // };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);

      const userAlreadyRegistered = userSnap.exists();

      if (!userAlreadyRegistered) {
        await setDoc(doc(db, 'users', result.user.uid), {
          ...emptyUser,
          profile: {
            username: result.user.displayName,
            avatar: result.user.photoURL
          }
        });
      }

      setFormValid('');
      navigate('/play', {
        state: userAlreadyRegistered ? 'GOOGLE_RETURNING_USER' : 'GOOGLE_FIRST_TIME_USER'
      });
    } catch (e: any) {
      setIsLoading(false);
      console.error(e);

      switch (e.code) {
        case 'auth/popup-blocked':
          setFormValid('Pop-up was blocked, try again.');
          break;
        case 'auth/popup-closed-by-user':
          setFormValid('Pop-up was closed.');
          break;
        default:
          setFormValid(e.code);
      }
    }
  };

  return (
    <Stack height="100vh" spacing={3} alignItems="center">
      <AppBar position="static" enableColorOnDark>
        <Toolbar sx={{ display: 'grid', justifyItems: 'center' }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              EDEN Heardle
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ margin: '0 auto', padding: '1rem', width: { xs: '100%', sm: '30rem', md: '30rem' } }}>
        <Paper elevation={3} style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {checked ? <Typography variant="h5">Create an account</Typography> : <Typography variant="h5">Log in to your account</Typography>}
          <div style={{ marginTop: '10px', width: '100%' }}>
            <Divider>{checked ? 'or Log In' : 'or Sign Up'}</Divider>
          </div>
          <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
          {checked ? <SignUp /> : <LogIn />}

          {formValid && (
            <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
              <Alert severity="error">{formValid}</Alert>
            </Stack>
          )}

          <div style={{ width: '100%' }}>
            <Divider>or</Divider>
          </div>

          {/* <div style={{ marginTop: '10px', width: '100%' }}>
            <Button variant="outlined" fullWidth startIcon={<FontAwesomeIcon icon={faDiscord} />} onClick={signInWithDiscord}>
              Continue with Discord
            </Button>
          </div> */}

          <div style={{ marginTop: '10px', width: '100%' }}>
            <Button variant="outlined" fullWidth startIcon={isLoading ? <CircularProgress color="inherit" size={24} /> : <GoogleIcon />} onClick={signInWithGoogle} disabled={isLoading}>
              Continue with Google
            </Button>
          </div>
        </Paper>
      </Box>
    </Stack>
  );
};

export default Auth;
