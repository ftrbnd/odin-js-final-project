import { FC, MouseEvent, useState } from 'react';
import { TextField, InputAdornment, FormControl, InputLabel, IconButton, Button, Alert, Stack, OutlinedInput } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { emptyUser } from '../utils/exports';

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

  const handleUsername = () => {
    if (!usernameInput || usernameInput.length < 3 || usernameInput.length > 10) {
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

  const handleSubmit = async () => {
    if (emailError || !emailInput) {
      setFormValid('Invalid email!');
      return;
    }

    if (usernameError || !usernameInput) {
      setFormValid('Username must be 3-10 characters long.');
      return;
    }

    if (passwordError || !passwordInput) {
      setFormValid('Password must be 5-20 characters long.');
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('profile.username', '==', usernameInput));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setFormValid('Username already exists.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, emailInput, passwordInput);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: usernameInput
        });

        await setDoc(doc(db, 'users', auth.currentUser.uid), {
          ...emptyUser,
          profile: {
            username: auth.currentUser.displayName,
            avatar: auth.currentUser.photoURL
          }
        });
      }

      setFormValid('');
      navigate('/play', {
        state: 'SIGN_UP'
      });
    } catch (e: any) {
      console.error(e);

      switch (e.code) {
        case 'auth/email-already-in-use':
          setFormValid('Email is already in use! Log in instead.');
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

      <TextField
        value={usernameInput}
        label="Username"
        type="text"
        fullWidth
        error={usernameError}
        variant="outlined"
        id="outlined-basic-username"
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
    </div>
  );
};

export default SignUp;
