export const GUESS_LIMIT = 6;

export type CorrectStatus = 'CORRECT' | 'WRONG' | 'ALBUM' | 'DEFAULT';

export interface Song {
  name: string;
  link: string;
  cover: string;
  album?: string;
  correct?: CorrectStatus;
  start?: number;
}

export interface User {
  profile: {
    username: string;
    avatar: string;
  };
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
  };
  daily: {
    shareText: CorrectStatus[];
    complete: boolean;
    progress: Song[];
  };
}

export const emptyUser: User = {
  profile: {
    username: '',
    avatar: ''
  },
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0
  },
  daily: {
    shareText: [],
    complete: false,
    progress: []
  }
};

export const convertShareText = (shareText: CorrectStatus[]) => {
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
