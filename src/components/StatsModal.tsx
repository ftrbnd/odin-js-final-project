import { Button, Dialog, DialogContent, DialogTitle, Divider, Slide, Snackbar, Stack, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef, useState } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

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
  const user = useSelector((state: RootState) => state.user);
  const shareText = useSelector((state: RootState) => state.shareText);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const getStat = (field: string) => {
    switch (field) {
      case Statistic.Played:
        break;
      case Statistic.WinPercentage:
        break;
      case Statistic.CurrentStreak:
        break;
      case Statistic.MaxStreak:
        break;
    }
    return 1; // temporary
  };

  const handleClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleShare = () => {
    const shareable = shareText.text;
    navigator.clipboard.writeText(`EDEN Heardle ${shareable.indexOf('🟩') + 1 === 0 ? 'X' : shareable.indexOf('🟩') + 1}/${shareable.length} ${shareable.join('')}`);
    setOpenSnackbar(true);
  };

  return (
    <div>
      <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Statistics{!user.isLoading && ` | ${user.profile.username}`}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Stack sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
            {[Statistic.Played, Statistic.WinPercentage, Statistic.CurrentStreak, Statistic.MaxStreak].map((statistic) => (
              <Stack key={statistic} sx={{ display: 'grid', gridTemplateRows: 'auto auto' }}>
                <Typography variant="h4" textAlign="center">
                  {getStat(statistic)}
                </Typography>
                <Typography variant="subtitle1" textAlign="center">
                  {statistic}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Divider />
          <Stack direction="column" alignItems="center" gap="1rem">
            {shareText.complete && <Typography variant="body1">{shareText.text}</Typography>}
            <Button disabled={!shareText.complete} variant="contained" endIcon={<ShareIcon />} onClick={handleShare}>
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
