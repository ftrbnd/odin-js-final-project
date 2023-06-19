import { FC, MouseEvent, useState } from 'react';
import { TextField, InputAdornment, FormControl, InputLabel, IconButton, Button, Alert, Stack, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';

const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const SignUp: FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [formValid, setFormValid] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleUsername = () => {
    if (!usernameInput) {
      setUsernameError(true);
      return;
    }

    setUsernameError(false);
  };

  const handlePassword = () => {
    if (!passwordInput || passwordInput.length < 5 || passwordInput.length > 20) {
      setPasswordError(true);
      return;
    }

    setPasswordError(false);
  };

  const handleSubmit = () => {
    setSuccess('Submitting...');
    if (usernameError || !usernameInput) {
      setFormValid('Username is set btw 5 - 15 characters long. Please Re-Enter');
      return;
    }

    if (emailError || !emailInput) {
      setFormValid('Email is Invalid. Please Re-Enter');
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid('Password is set btw 5 - 20 characters long. Please Re-Enter');
      return;
    }
    setFormValid('');

    setSuccess('Form Submitted Successfully');
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
        id="outlined-basic"
        sx={{ width: '100%', marginTop: '5px' }}
        onBlur={handleEmail}
        onChange={(event) => {
          setEmailInput(event.target.value);
        }}
      />

      <TextField
        value={usernameInput}
        label="Username"
        type="text"
        fullWidth
        error={usernameError}
        variant="outlined"
        id="outlined-basic"
        sx={{ width: '100%', marginTop: '10px' }}
        onChange={(event) => {
          setUsernameInput(event.target.value);
        }}
        onBlur={handleUsername}
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
          Sign Up
        </Button>
      </div>

      {formValid && (
        <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
          <Alert severity="error">{formValid}</Alert>
        </Stack>
      )}

      {success && (
        <Stack sx={{ width: '100%', paddingTop: '10px' }} spacing={2}>
          <Alert severity="success">{success}</Alert>
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

export default SignUp;
