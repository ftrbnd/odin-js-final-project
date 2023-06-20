import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  avatar: string;
}

const initialState = {
  user: {
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
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = initialState.user;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    }
  }
});

export const { logIn, logOut, setLoading } = userSlice.actions;

export default userSlice.reducer;
