import { FC, useEffect, useState } from 'react';
import { Paper, Switch, Box, Typography, AppBar, Toolbar, Divider, Button } from '@mui/material';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { auth } from '../utils/firebase';

const Auth: FC = () => {
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      navigate('/play');
    } else {
      console.log('No user detected');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  const signInWithDiscord = () => {
    console.log('TODO: Signing in with Discord...');
  };

  const signInWithGoogle = () => {
    console.log('TODO: Signing in with Google...');
  };

  return (
    <>
      <AppBar position="static" enableColorOnDark>
        <Toolbar sx={{ display: 'grid', justifyItems: 'center' }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              EDEN Heardle
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ margin: '0 auto', padding: '1rem', width: '30rem' }}>
        <Paper elevation={3} style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {checked ? <Typography variant="h5">Create an account</Typography> : <Typography variant="h5">Log in to your account</Typography>}
          <br />
          <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
          <br />
          {checked ? <SignUp /> : <LogIn />}

          <div style={{ marginTop: '10px', width: '100%' }}>
            <Divider>or</Divider>
          </div>

          <div style={{ marginTop: '10px', width: '100%' }}>
            <Button variant="outlined" fullWidth startIcon={<FontAwesomeIcon icon={faDiscord} />} onClick={signInWithDiscord}>
              Continue with Discord
            </Button>
          </div>

          <div style={{ marginTop: '10px', width: '100%' }}>
            <Button variant="outlined" fullWidth startIcon={<GoogleIcon />} onClick={signInWithGoogle}>
              Continue with Google
            </Button>
          </div>
        </Paper>
      </Box>
    </>
  );
};

export default Auth;
