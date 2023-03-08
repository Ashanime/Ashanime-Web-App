import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";
import animeReducer, { setStreamEpisode } from "./search-slice";
import { useDispatch } from "react-redux";
import { Buffer } from "buffer";
import notificationReducer from "./notification-slice";
import googleReducer from "./google-slice";
import videoReducer, {
  setContinueWatching,
  setSavedEpisodes,
  setSavedEpisode,
} from "./videoState-slice";
import filterReducer from "./filter-slice";
import {
  getUserDataById,
  saveCurrentWatchEpisode,
  updateWatchHistory,
} from "../backend/users";

const encodeBase64 = (data: string) => {
  if (!data) return "undefined";
  return Buffer.from(data).toString("base64");
};

const decodeBase64 = (data: string) => {
  return Buffer.from(data, "base64").toString("ascii");
};

export const store = configureStore({
  reducer: {
    anime: animeReducer,
    notification: notificationReducer,
    google: googleReducer,
    videoState: videoReducer,
    filter: filterReducer,
  },
});

export const fetchUserDataById = createAsyncThunk(
  "users/fetchById",
  async (userId: string, thunkAPI) => {
    /**
     * Read the user database
     */
    const userData = await getUserDataById(userId);
    thunkAPI.dispatch(setSavedEpisodes(userData.savedEpisodes || []));
    thunkAPI.dispatch(
      setSavedEpisode(
        userData.savedEpisode || {
          title: "",
          id: "",
          number: 0,
          image: "",
          description: "",
        }
      )
    );
  }
);

async function writeContinueWatching(userId: string, newContinueWatching: any) {
  return await saveCurrentWatchEpisode(userId, newContinueWatching);
}

async function updateBackendSavedEpisodes(
  userId: string,
  updateBackendSavedEpisodes: any
) {
  return await updateWatchHistory(userId, updateBackendSavedEpisodes);
}

export const episodeSelected = createAsyncThunk(
  "episode/selected",
  async (
    {
      selectedEpisode,
      cleanModalData,
      uid,
    }: {
      selectedEpisode: {
        title: string;
        id: string;
        number: number;
        image: string;
        description: string;
      };
      cleanModalData: any;
      uid: string;
    },
    thunkAPI
  ) => {
    const state = thunkAPI.getState() as RootState;
    const { videoState } = state;
    const backendSyncPromises = [];
    //Do everything related to selecting an episode.
    if (selectedEpisode) {
      thunkAPI.dispatch(setStreamEpisode(selectedEpisode));
      thunkAPI.dispatch(setSavedEpisode(selectedEpisode));
      /**
       * Set saved episodes
       */
      const updatedSelectedEpisodes = {
        ...videoState.savedEpisodes,
        [encodeBase64(cleanModalData.title.romaji)]: selectedEpisode,
      };
      thunkAPI.dispatch(setSavedEpisodes(updatedSelectedEpisodes));

      backendSyncPromises.push(
        updateBackendSavedEpisodes(uid, updatedSelectedEpisodes)
      );
      //check if episode is already in continue watching
      const InContinueWatching = videoState.continueWatching.find(
        (anime: any) => anime.title.romaji === cleanModalData.title.romaji
      );
      if (!InContinueWatching) {
        const newContinueWatching = [
          ...(videoState.continueWatching || []),
          cleanModalData,
        ];
        thunkAPI.dispatch(setContinueWatching(newContinueWatching));
        backendSyncPromises.push(
          writeContinueWatching(uid, newContinueWatching)
        );
        /**
         * Set saved episode
         */
      }
      await Promise.all(backendSyncPromises);
    }
  }
);

export const watchViewOpened = createAsyncThunk(
  "watch/opened",
  async (modalData: any, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const { videoState, anime } = state;
    const currentAnimeTitle = anime.modalData.title.romaji;
    const currentAnimeTitleB64 = encodeBase64(currentAnimeTitle) as string;
    if (videoState.savedEpisodes[currentAnimeTitleB64]) {
      const savedEpisode = videoState.savedEpisodes[currentAnimeTitleB64];
      thunkAPI.dispatch(setStreamEpisode(savedEpisode));
      thunkAPI.dispatch(setSavedEpisode(savedEpisode));
    }
  }
);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Export a hook that can be reused to resolve types
