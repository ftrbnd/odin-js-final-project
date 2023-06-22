import { combineReducers } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import shareTextReducer from '../features/shareTextSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  shareText: shareTextReducer
});
