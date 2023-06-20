import { FC, MouseEvent, useState } from 'react';
import { TextField, InputAdornment, FormControl, InputLabel, IconButton, Button, Alert, Stack, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const LogIn: FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState('');

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

  const handleSubmit = async () => {
    if (emailError || !emailInput) {
      setFormValid('Invalid email!');
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid('Password must be 5-20 characters long.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      setFormValid('');
      navigate('/play', {
        state: 'LOG_IN'
      });
    } catch (e: any) {
      console.error(e);

      switch (e.code) {
        case 'auth/wrong-password':
          setFormValid('Password is incorrect.');
          break;
        case 'auth/user-not-found':
          setFormValid('User does not exist.');
          break;
        default:
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
        <Button variant="contained" fullWidth startIcon={<LoginIcon />} onClick={handleSubmit}>
          Log In
        </Button>
      </div>

      {formValid && (
        <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
          <Alert severity="error">{formValid}</Alert>
        </Stack>
      )}

      {/* <div style={{ marginTop: '7px', fontSize: '10px' }}>
        <a>Forgot Password?</a>
        <br />
        Do you have an account? <small style={{ textDecoration: 'underline', color: 'blue' }}>Log In</small>
      </div> */}
    </div>
  );
};

export default LogIn;
