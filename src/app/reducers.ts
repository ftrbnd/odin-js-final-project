import { combineReducers } from '@reduxjs/toolkit';
import localUserReducer from '../features/localUserSlice';
import { usersApi } from '../features/apiSlice';

export const rootReducer = combineReducers({
  localUser: localUserReducer,
  [usersApi.reducerPath]: usersApi.reducer
});
