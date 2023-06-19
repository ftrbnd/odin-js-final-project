import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  avatar: string;
  isLoading: boolean;
}

const initialState: User = {
  username: '',
  avatar: '',
  isLoading: true
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logIn: (state, action: PayloadAction<User>) => {
      state.username = action.payload.username;
      state.avatar = action.payload.avatar;
    },
    logOut: (state) => {
      state.username = '';
      state.avatar = '';
    },
    setLoading: (state, action: PayloadAction<User>) => {
      state.isLoading = action.payload.isLoading;
    }
  }
});

export const { logIn, logOut, setLoading } = userSlice.actions;

export default userSlice.reducer;
