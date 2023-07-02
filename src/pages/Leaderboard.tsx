import { FC, useEffect, useState } from 'react';
import { AppBar, Box, CircularProgress, Container, Stack, Tab, Tabs, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { CorrectStatus, convertShareText } from '../utils/exports';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

interface DailyScore {
  username: string;
  shareText: CorrectStatus[];
}

interface WinPercentage {
  username: string;
  percentage: number;
}

interface AllStats {
  dailies: DailyScore[];
  percentages: WinPercentage[];
}

const Leaderboard: FC = () => {
  const [dailyScores, setDailyScores] = useState<DailyScore[]>([]);
  const [winPercentages, setWinPercentages] = useState<WinPercentage[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    async function fetchStats() {
      const allStats: AllStats = {
        dailies: [],
        percentages: []
      };

      const querySnapshot = await getDocs(collection(db, 'users'));
      querySnapshot.forEach((doc) => {
        if (doc.data().daily.complete) {
          allStats.dailies.push({ username: doc.data().profile.username, shareText: doc.data().daily.shareText });
        }
        if (doc.data().statistics.gamesPlayed > 0) {
          allStats.percentages.push({ username: doc.data().profile.username, percentage: Math.round((doc.data().statistics.gamesWon / doc.data().statistics.gamesPlayed || 0) * 100) });
        }
      });

      return allStats;
    }

    fetchStats().then((stats) => {
      setDailyScores(
        stats.dailies.sort((a, b) => {
          const aIndex = a.shareText.indexOf('CORRECT');
          const bIndex = b.shareText.indexOf('CORRECT');

          return (aIndex === -1 ? 7 : aIndex) - (bIndex === -1 ? 7 : bIndex); // if they didn't get the song, 'CORRECT' is not in their shareText, so return any number greater than 6 instead of -1
        })
      );
      setWinPercentages(stats.percentages.sort((a, b) => b.percentage - a.percentage));
      setIsLoading(false);
    });
  }, []);

  return (
    <Stack height="100vh" spacing={3} alignItems="center">
      <AppBar position="static" enableColorOnDark>
        <Toolbar sx={{ display: 'grid', justifyItems: 'center' }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            <Link to="/play" style={{ textDecoration: 'none', color: 'inherit' }}>
              EDEN Heardle
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="leaderboard tabs" variant="fullWidth" centered>
            <Tab label="Daily Scores" {...a11yProps(0)} />
            <Tab label="Win Percentages" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Container>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              dailyScores.map((score, index) => (
                <Box key={`${score.username}-daily`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="span">
                    {`${index + 1}. ${score.username}`}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {convertShareText(score.shareText)}
                  </Typography>
                </Box>
              ))
            )}
          </Container>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Container>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              winPercentages.map((percentage, index) => (
                <Box key={`${percentage.username}-percentage`} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" component="span">
                    {`${index + 1}. ${percentage.username}`}
                  </Typography>
                  <Typography variant="body2" component="span">
                    {percentage.percentage}
                  </Typography>
                </Box>
              ))
            )}
          </Container>
        </TabPanel>
      </Box>
    </Stack>
  );
};

export default Leaderboard;
