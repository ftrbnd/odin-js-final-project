import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  avatar: string;
}

const initialState = {
  profile: {
    username: '',
    avatar: ''
  },
  isLoading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
    },
    logOut: (state) => {
      state.profile = initialState.profile;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { logIn, logOut, setLoading } = userSlice.actions;

export default userSlice.reducer;
