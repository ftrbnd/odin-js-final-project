import { Divider, List, ListItemText, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { FC, forwardRef } from 'react';
import styles from '../styles/SettingsModal.module.scss';

interface IProps {
  open: boolean;
  closeModal: () => void;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SettingsModal: FC<IProps> = ({ open, closeModal }) => {
  return (
    <div>
      <Dialog fullWidth open={open} TransitionComponent={Transition} keepMounted onClose={closeModal} aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <List>
              <ListItemText primary="Feedback" secondary="Email" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
              <Divider />
              <ListItemText primary="Community" secondary="Discord" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
              <Divider />
              <ListItemText primary="Questions?" secondary="FAQ" sx={{ display: 'flex', justifyContent: 'space-between' }} className={styles.listItem} />
              <Divider />
            </List>
            <Typography variant="subtitle2">© 2023 giosalad</Typography>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsModal;
