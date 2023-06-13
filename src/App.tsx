import { useDispatch, useSelector } from 'react-redux';
import styles from './styles/App.module.scss';
import { RootState } from './app/store';
import { incrementCount } from './features/countSlice';
import { Button, Typography } from '@mui/material';

const App = () => {
  const dispatch = useDispatch();

  const countValue = useSelector((state: RootState) => state.count.value);

  const handleIncrementCount = () => {
    dispatch(incrementCount({ value: 1 }));
  };

  return (
    <div className={styles.App}>
      <Typography variant="h1">React + TypeScript + Vite + Redux Toolkit + Sass + Firebase + React Router</Typography>
      <Typography variant="h2">Count: {countValue}</Typography>
      <Button variant="contained" onClick={handleIncrementCount}>
        Increment
      </Button>
    </div>
  );
};

export default App;
