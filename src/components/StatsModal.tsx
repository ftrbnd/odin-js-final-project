import { Button, Dialog, DialogContent, DialogTitle, Divider, Slide, Stack, Typography } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef } from 'react';
import ShareIcon from '@mui/icons-material/Share';

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

  return (
    <div>
      <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Statistics</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Stack sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', justifyItems: 'center', alignItems: 'center', gap: '1rem' }}>
            {[Statistic.Played, Statistic.WinPercentage, Statistic.CurrentStreak, Statistic.MaxStreak].map((statistic) => (
              <Stack sx={{ display: 'grid', gridTemplateRows: 'auto auto' }}>
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
          <Stack direction="row" justifyContent="center">
            <Button variant="contained" endIcon={<ShareIcon />}>
              Share
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StatsModal;
