import { Box, Divider, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer } from '@mui/material';
import { FC } from 'react';
import RedditIcon from '@mui/icons-material/Reddit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import YouTubeIcon from '@mui/icons-material/YouTube';

interface IProps {
  open: boolean;
  toggleDrawer: (open: boolean) => void;
}

const LinksDrawer: FC<IProps> = ({ open, toggleDrawer }) => {
  return (
    <SwipeableDrawer anchor="left" open={open} onClose={() => toggleDrawer(false)} onOpen={() => toggleDrawer(true)}>
      <Box sx={{ width: 250 }} role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
        <List>
          <ListItem key="discord">
            <Link target="mynewtab" href="https://discord.gg/futurebound" underline="hover" variant="inherit" color="inherit">
              <ListItemButton>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faDiscord} />
                </ListItemIcon>
                <ListItemText primary={'futurebound'} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key="reddit">
            <Link target="mynewtab" href="https://reddit.com/r/eden" underline="hover" variant="inherit" color="inherit">
              <ListItemButton>
                <ListItemIcon>
                  <RedditIcon />
                </ListItemIcon>
                <ListItemText primary={'r/eden'} />
              </ListItemButton>
            </Link>
          </ListItem>
          <ListItem key="youtube">
            <Link target="mynewtab" href="https://www.youtube.com/c/iameden" underline="hover" variant="inherit" color="inherit">
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
