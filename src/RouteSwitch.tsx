import { FC, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Game from './pages/Game';
import Auth from './pages/Auth';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './utils/firebase';
import { logIn, logOut, setLoading } from './features/userSlice';

const RouteSwitch: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        dispatch(
          logIn({
            username: authUser.displayName || '',
            avatar: authUser.photoURL || ''
          })
        );
        dispatch(setLoading(false));
        console.log(`Signed in user ${authUser.displayName}!`);
      } else {
        logOut();
        dispatch(setLoading(true));
        console.log('Signed out user.');
      }
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Game />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouteSwitch;
