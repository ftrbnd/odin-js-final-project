import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { doc, getDoc, onSnapshot, runTransaction } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { CorrectStatus, Song, User, emptyUser } from '../utils/types';

interface ShareTextMutationQuery {
  userId: string;
  correctSquare: CorrectStatus;
}

interface CompleteMutationQuery {
  userId: string;
  complete: boolean;
}

interface ProgressMutationQuery {
  userId: string;
  song: Song;
}

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      async queryFn(userId) {
        try {
          const querySnapshot = await getDoc(doc(db, 'users', userId));

          let userData: User;
          if (querySnapshot.exists()) {
            const data = querySnapshot.data();
            console.log('Initial user snapshot: ', data);

            userData = {
              profile: {
                username: data.profile.username,
                avatar: data.profile.avatar
              },
              statistics: {
                gamesPlayed: data.statistics.gamesPlayed,
                gamesWon: data.statistics.gamesWon,
                currentStreak: data.statistics.currentStreak,
                maxStreak: data.statistics.maxStreak
              },
              daily: {
                shareText: data.daily.shareText,
                complete: data.daily.complete,
                progress: data.daily.progress
              }
            };
          } else {
            userData = emptyUser;
          }

          return { data: userData };
        } catch (error) {
          console.log('error getting user data: ', userId);
          return { error };
        }
      },
      async onCacheEntryAdded(userId, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        let unsubscribe;
        try {
          await cacheDataLoaded;

          const userRef = doc(db, 'users', userId);
          unsubscribe = onSnapshot(userRef, (doc) => {
            updateCachedData(() => {
              console.log('New user snapshot: ', doc.data());
              return doc.data() as User;
            });
          });
        } catch (error) {
          console.log('Error getting user!', error);
          throw new Error('Something went wrong with getting the user.');
        }

        await cacheEntryRemoved;
        unsubscribe();
      },
      providesTags: ['User']
    }),
    updateShareText: builder.mutation<void, ShareTextMutationQuery>({
      async queryFn({ userId, correctSquare }) {
        try {
          const response = await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
              throw 'Document does not exist!';
            }

            const newShareText = [...(userDoc.data().daily.shareText || []), correctSquare];
            transaction.update(userDocRef, { daily: { ...userDoc.data().daily, shareText: newShareText } });
          });
          console.log('Transaction successfully committed! [daily.shareText]');

          return { data: response };
        } catch (error) {
          console.error("Error updating user's share text!", error);
          return { error };
        }
      },
      invalidatesTags: ['User']
    }),
    updateCompleteStatus: builder.mutation<void, CompleteMutationQuery>({
      async queryFn({ userId, complete }) {
        try {
          const response = await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
              throw 'Document does not exist!';
            }

            transaction.update(userDocRef, { daily: { ...userDoc.data().daily, complete } });
          });
          console.log('Transaction successfully committed! [daily.complete]');

          return { data: response };
        } catch (error) {
          console.error("Error updating user's complete status!", error);
          return { error };
        }
      },
      invalidatesTags: ['User']
    }),
    updateProgress: builder.mutation<void, ProgressMutationQuery>({
      async queryFn({ userId, song }) {
        try {
          const response = await runTransaction(db, async (transaction) => {
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
              throw 'Document does not exist!';
            }

            const newProgress = [...(userDoc.data().daily.progress || []), song];
            transaction.update(userDocRef, { daily: { ...userDoc.data().daily, progress: newProgress } });
          });
          console.log('Transaction successfully committed! [daily.progress]');

          return { data: response };
        } catch (error) {
          console.error("Error updating user's daily progress!", error);
          return { error };
        }
      },
      invalidatesTags: ['User']
    })
  })
});

export const { useGetUserQuery, useUpdateShareTextMutation, useUpdateCompleteStatusMutation, useUpdateProgressMutation } = usersApi;
