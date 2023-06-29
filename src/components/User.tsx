import { FC } from 'react';
import { useGetUserQuery } from '../features/apiSlice';
import { auth } from '../utils/firebase';

const User: FC = () => {
  const { data: user, isLoading } = useGetUserQuery(auth.currentUser?.uid);

  return <div>{isLoading ? <h1>loading...</h1> : <h1>{user?.profile.username}</h1>}</div>;
};

export default User;
