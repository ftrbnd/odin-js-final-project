import { useDispatch, useSelector } from 'react-redux';
import styles from './styles/App.module.scss';
import { RootState } from './app/store';
import { incrementCount } from './features/countSlice';

const App = () => {
  const dispatch = useDispatch();

  const countValue = useSelector((state: RootState) => state.count.value);

  const handleIncrementCount = () => {
    dispatch(incrementCount({ value: 1 }));
  };

  return (
    <div className={styles.App}>
      <h1>React + TypeScript + Vite + Redux Toolkit + Sass</h1>
      <h2>Count: {countValue}</h2>
      <button onClick={handleIncrementCount}>Increment</button>
    </div>
  );
};

export default App;
