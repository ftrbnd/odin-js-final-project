import { Box, Divider, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, styled, IconButton } from '@mui/material';
import { FC } from 'react';
import RedditIcon from '@mui/icons-material/Reddit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

interface IProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}));

const LinksDrawer: FC<IProps> = ({ open, toggleDrawer }) => {
  return (
    <SwipeableDrawer anchor="left" open={open} onClose={() => toggleDrawer(false)} onOpen={() => toggleDrawer(true)}>
      <DrawerHeader>
        <IconButton onClick={() => toggleDrawer(false)}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
        <List>
          <ListItem key="discord">
            <Link rel="noopener" target="mynewtab" href="https://discord.gg/futurebound" underline="hover" variant="inherit" color="inherit">
              <ListItemButton>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faDiscord} />
                </ListItemIcon>
                <ListItemText primary={'futurebound'} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key="reddit">
            <Link rel="noopener" target="mynewtab" href="https://reddit.com/r/eden" underline="hover" variant="inherit" color="inherit">
              <ListItemButton>
                <ListItemIcon>
                  <RedditIcon />
                </ListItemIcon>
                <ListItemText primary={'r/eden'} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key="youtube">
            <Link rel="noopener" target="mynewtab" href="https://www.youtube.com/c/iameden" underline="hover" variant="inherit" color="inherit">
              <ListItemButton>
                <ListItemIcon>
                  <YouTubeIcon />
                </ListItemIcon>
                <ListItemText primary={'Songs'} />
              </ListItemButton>
            </Link>
          </ListItem>
        </List>
      </Box>
    </SwipeableDrawer>
  );
};

export default LinksDrawer;
