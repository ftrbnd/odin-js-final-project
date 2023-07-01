import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { emptyUser, CorrectStatus } from '../utils/exports';

export const localUserSlice = createSlice({
  name: 'localUser',
  initialState: emptyUser,
  reducers: {
    updateLocalShareText: (state, action: PayloadAction<CorrectStatus>) => {
      state.daily.shareText.push(action.payload);
    },
    updateLocalComplete: (state, action: PayloadAction<boolean>) => {
      state.daily.complete = action.payload;
    },
    resetLocalUser: (state) => {
      state.daily = emptyUser.daily;
      state.profile = emptyUser.profile;
      state.statistics = emptyUser.statistics;
    }
  }
});

export const { updateLocalShareText, updateLocalComplete, resetLocalUser } = localUserSlice.actions;

export default localUserSlice.reducer;
