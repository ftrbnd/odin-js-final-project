import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from './firebase';

const useCountdown = () => {
  const [countDownDate, setCountDownDate] = useState(0);
  const [countDown, setCountDown] = useState(0);

  useEffect(() => {
    async function fetchMidnight() {
      const docRef = doc(db, 'daily_song', 'midnight');
      const docSnap = await getDoc(docRef);

      return docSnap.exists() ? docSnap.data().next.seconds : 0;
    }

    fetchMidnight().then((midnight) => setCountDownDate(midnight));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime() / 1000);
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return {
    hours: new Date(countDown * 1000).getHours(),
    minutes: new Date(countDown * 1000).getMinutes(),
    seconds: new Date(countDown * 1000).getSeconds()
  };
};

export default useCountdown;
