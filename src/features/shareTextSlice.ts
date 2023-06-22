import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ShareText {
  text: Square[];
  complete: boolean;
}

const initialState: ShareText = {
  text: [],
  complete: false
};

type Square = '🟥' | '🟧' | '🟩' | '⬜';

export const shareTextSlice = createSlice({
  name: 'shareText',
  initialState,
  reducers: {
    addSquare: (state, action: PayloadAction<Square>) => {
      state.text.push(action.payload);
    },
    setComplete: (state, action: PayloadAction<boolean>) => {
      state.complete = action.payload;
      while (state.complete && state.text.length < 6) {
        state.text.push('⬜');
      }
    }
  }
});

export const { addSquare, setComplete } = shareTextSlice.actions;

export default shareTextSlice.reducer;
