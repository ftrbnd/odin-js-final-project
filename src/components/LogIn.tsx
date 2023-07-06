import { FC, KeyboardEvent, MouseEvent, useState } from 'react';
import { TextField, InputAdornment, FormControl, InputLabel, IconButton, Button, Alert, Stack, OutlinedInput, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { fetchSignInMethodsForEmail, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const LogIn: FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'success'>('error');

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleEmail = () => {
    if (!isValidEmail(emailInput)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);
  };

  const handlePassword = () => {
    if (!passwordInput || passwordInput.length < 5 || passwordInput.length > 20) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleForgotPassword = async () => {
    try {
      setIsForgotLoading(true);
      await sendPasswordResetEmail(auth, emailInput);

      console.log(`email sent to ${emailInput}`);
      setIsForgotLoading(false);
      setAlertSeverity('success');
      setFormValid('Password reset email sent!');
    } catch (e: any) {
      setIsForgotLoading(false);
      console.error(e);

      switch (e.code) {
        case 'auth/missing-email':
          setAlertSeverity('error');
          setFormValid('Please enter your email address.');
          break;
        case 'auth/user-not-found':
          setAlertSeverity('error');
          setFormValid('No account registered with this email.');
          break;
        default:
          setAlertSeverity('error');
          setFormValid(e.code);
      }
    }
  };

  const handleSubmit = async () => {
    if (emailError || !emailInput) {
      setAlertSeverity('error');
      setFormValid('Invalid email!');
      return;
    }

    if (passwordError || !passwordInput) {
      setAlertSeverity('error');
      setFormValid('Password must be 5-20 characters long.');
      return;
    }

    const signInMethods = await fetchSignInMethodsForEmail(auth, emailInput);
    if (signInMethods.includes('google.com')) {
      setAlertSeverity('error');
      setFormValid('Please log in with Google!');
      return;
    }

    try {
      setIsLoginLoading(true);
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);

      setAlertSeverity('error');
      setFormValid('');
      navigate('/play', {
        state: 'LOG_IN'
      });
    } catch (e: any) {
      setIsLoginLoading(false);
      console.error(e);

      switch (e.code) {
        case 'auth/wrong-password':
          setAlertSeverity('error');
          setFormValid('Password is incorrect.');
          break;
        case 'auth/user-not-found':
          setAlertSeverity('error');
          setFormValid('User does not exist.');
          break;
        case 'auth/too-many-requests':
          setAlertSeverity('error');
          setFormValid('Too many log-in attempts. Try again later.');
          break;
        default:
          setAlertSeverity('error');
          setFormValid(e.code);
      }
    }
  };

  return (
    <div>
      <TextField
        value={emailInput}
        label="Email"
        type="email"
        fullWidth
        error={emailError}
        variant="outlined"
        id="outlined-basic-email"
        sx={{ width: '100%', marginTop: '5px' }}
        onBlur={handleEmail}
        onChange={(event) => {
          setEmailInput(event.target.value);
        }}
      />

      <FormControl sx={{ width: '100%', marginTop: '10px' }} variant="outlined">
        <InputLabel error={passwordError} htmlFor="outlined-adornment-password">
          Password
        </InputLabel>
        <OutlinedInput
          value={passwordInput}
          label="Password"
          type={showPassword ? 'text' : 'password'}
          error={passwordError}
          id="outlined-adornment-password"
          onBlur={handlePassword}
          onChange={(event) => {
            setPasswordInput(event.target.value);
          }}
          onKeyDown={(e) => handleEnter(e)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <div style={{ marginTop: '10px' }}>
        <Button variant="contained" fullWidth startIcon={isLoginLoading ? <CircularProgress color="inherit" size={24} /> : <LoginIcon />} onClick={handleSubmit} disabled={isLoginLoading}>
          {isLoginLoading ? 'Logging in...' : 'Log In'}
        </Button>
      </div>

      {formValid && (
        <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
          <Alert severity={alertSeverity}>{formValid}</Alert>
        </Stack>
      )}

      <Button variant="text" size="small" sx={{ marginTop: '10px' }} onClick={handleForgotPassword} disabled={isForgotLoading}>
        Forgot Password?
      </Button>
    </div>
  );
};

export default LogIn;
