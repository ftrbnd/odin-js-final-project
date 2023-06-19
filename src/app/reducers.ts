import { combineReducers } from '@reduxjs/toolkit';
import countReducer from '../features/countSlice';

export const rootReducer = combineReducers({
  count: countReducer
});
