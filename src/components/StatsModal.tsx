import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Slide, Snackbar, Stack, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, useState, useEffect } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { Link, NavLink } from 'react-router-dom';
import { useGetUserQuery } from '../features/apiSlice';
import { auth, db } from '../utils/firebase';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { convertShareText } from '../utils/exports';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import { doc, getDoc } from 'firebase/firestore';

interface IProps {
  open: boolean;
  closeModal: () => void;
}

enum Statistic {
  Played = 'Played',
  WinPercentage = 'Win %',
  CurrentStreak = 'Current Streak',
  MaxStreak = 'Max Streak'
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StatsModal: FC<IProps> = ({ open, closeModal }) => {
  const { data: user, isLoading } = useGetUserQuery(auth.currentUser?.uid ?? skipToken);
  const localUser = useSelector((state: RootState) => state.localUser);

  const [heardleNumber, setHeardleNumber] = useState(0);

  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    async function fetchHeardleNumber() {
      const docRef = doc(db, 'daily_song', 'midnight');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) return docSnap.data().number;
      return 0;
    }

    fetchHeardleNumber().then((num) => setHeardleNumber(num));
  }, []);

  const getStat = (field: string) => {
    if (isLoading || !user) return 0;

    switch (field) {
      case Statistic.Played:
        return user?.statistics.gamesPlayed;
      case Statistic.WinPercentage:
        return Math.round((user?.statistics.gamesWon / user?.statistics.gamesPlayed || 0) * 100);
      case Statistic.CurrentStreak:
        return user?.statistics.currentStreak;
      case Statistic.MaxStreak:
        return user?.statistics.maxStreak;
    }
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleShare = () => {
    let shareable;
    if (auth.currentUser) {
      shareable = user?.daily.shareText || [];
    } else {
      shareable = localUser.daily.shareText;
    }

    navigator.clipboard.writeText(`EDEN Heardle #${heardleNumber} ${convertShareText(shareable)}`);

    setOpenSnackbar(true);
  };

  return (
    <div>
      <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Statistics{auth.currentUser && ` | ${user?.profile.username}`}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Stack sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
            {[Statistic.Played, Statistic.WinPercentage, Statistic.CurrentStreak, Statistic.MaxStreak].map((statistic) => (
              <Stack key={statistic} sx={{ display: 'grid', gridTemplateRows: '1fr 1fr', justifyItems: 'center', width: '100%', height: '100%' }}>
                <Typography variant="h4" textAlign="center">
                  {getStat(statistic)}
                </Typography>
                <Typography variant="subtitle1" textAlign="center">
                  {statistic}
                </Typography>
              </Stack>
            ))}
          </Stack>
          {!auth.currentUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Divider />
              <Typography variant="body1" textAlign="center">
                Stats are not tracked without an account!
                <br />
                <NavLink to="/auth" style={{ color: 'inherit' }}>
                  Log in or create an account
                </NavLink>{' '}
                to link your stats.
              </Typography>
              <Divider />
            </Box>
          )}
          <Stack direction="column" alignItems="center" gap="1rem">
            <Typography variant="body1">
              {auth.currentUser && user?.daily.complete ? user.daily.shareText && convertShareText(user.daily.shareText) : localUser.daily.shareText && convertShareText(localUser.daily.shareText)}
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Button variant="outlined" endIcon={<LeaderboardOutlinedIcon />}>
                <Link to="/leaderboard" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Leaderboard
                </Link>
              </Button>
              <Button disabled={!user?.daily.complete && !localUser.daily.complete} variant="contained" endIcon={<ShareIcon />} onClick={handleShare}>
                Share
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleClose} message="Copied result!" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      </Dialog>
    </div>
  );
};

export default StatsModal;
