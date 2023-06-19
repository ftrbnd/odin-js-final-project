import { FC, useState } from 'react';
import { Paper, Switch, Box, Typography } from '@mui/material';
import SignUp from '../components/SignUp';
import LogIn from '../components/LogIn';

const Auth: FC = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  return (
    <Box sx={{ margin: '0 auto', padding: '1rem', width: '30rem' }}>
      <Paper elevation={3} style={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {checked ? <Typography variant="h5">Create an account</Typography> : <Typography variant="h5">Log in to your account</Typography>}
        <br />
        <Switch checked={checked} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
        <br />
        {checked ? <SignUp /> : <LogIn />}
      </Paper>
    </Box>
  );
};

export default Auth;
