import { combineReducers } from '@reduxjs/toolkit';
import countReducer from '../features/countSlice';
import userReducer from '../features/userSlice';

export const rootReducer = combineReducers({
  count: countReducer,
  user: userReducer
});
