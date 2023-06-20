import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Count {
  value: number;
}

const initialState: Count = {
  value: 0
};

export const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    incrementCount: (state, action: PayloadAction<Count>) => {
      state.value += action.payload.value;
    }
  }
});

export const { incrementCount } = countSlice.actions;

export default countSlice.reducer;
