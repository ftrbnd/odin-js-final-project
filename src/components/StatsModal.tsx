import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, Slide, Snackbar, Stack, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { NavLink } from 'react-router-dom';
import { useGetUserQuery } from '../features/apiSlice';
import { auth } from '../utils/firebase';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { CorrectStatus, GUESS_LIMIT } from '../utils/types';

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

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const getStat = (field: string) => {
    if (isLoading) return 0;

    switch (field) {
      case Statistic.Played:
        return 1;
      case Statistic.WinPercentage:
        return 1;
      case Statistic.CurrentStreak:
        return 1;
      case Statistic.MaxStreak:
        return 1;
    }
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const convertShareText = (shareText: CorrectStatus[]) => {
    const squareMap = new Map<CorrectStatus, string>([
      ['ALBUM', '🟧'],
      ['CORRECT', '🟩'],
      ['DEFAULT', '⬜'],
      ['WRONG', '🟥']
    ]);

    return shareText
      .map((status) => {
        return squareMap.get(status);
      })
      .join('');
  };

  const handleShare = () => {
    let shareable;
    if (auth.currentUser) {
      shareable = user?.daily.shareText || [];
    } else {
      shareable = localUser.daily.shareText;
    }

    navigator.clipboard.writeText(`EDEN Heardle ${shareable.indexOf('CORRECT') + 1 === 0 ? 'X' : shareable.indexOf('CORRECT') + 1}/${GUESS_LIMIT} ${convertShareText(shareable)}`);

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
              <Typography variant="body1">
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
            <Button disabled={!user?.daily.complete && !localUser.daily.complete} variant="contained" endIcon={<ShareIcon />} onClick={handleShare}>
              Share
            </Button>
          </Stack>
        </DialogContent>
        <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleClose} message="Copied result!" anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
      </Dialog>
    </div>
  );
};

export default StatsModal;
