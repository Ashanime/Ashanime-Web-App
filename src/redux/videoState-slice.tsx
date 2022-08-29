import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { streamModal } from "../types/type";

export type savedEpisode = string;

interface savedEpisodes {
  [key: string]: savedEpisode;
}

interface initialStateInterface {
  savedCurrentTime: number;
  savedStartTime: number;
  savedEpisode: savedEpisode;
  savedEpisodes: savedEpisodes;
  savedAnimeTitle: string;
  continueWatching: streamModal[];
  videoLink: string;
}

const initialState: initialStateInterface = {
  savedCurrentTime: 0,
  savedStartTime: 0,
  savedEpisode: "",
  savedEpisodes: {},
  savedAnimeTitle: "",
  continueWatching: [],
  videoLink: "",
};

export const videoSlice = createSlice({
  name: "videoState",
  initialState: initialState,
  reducers: {
    setSavedCurrentTime: (state, action: PayloadAction<number>) => {
      state.savedCurrentTime = action.payload;
    },
    setSavedStartTime: (state, action: PayloadAction<number>) => {
      state.savedStartTime = action.payload;
    },
    setSavedEpisode: (state, action: PayloadAction<savedEpisode>) => {
      state.savedEpisode = action.payload;
    },
    setSavedEpisodes: (state, action: PayloadAction<savedEpisodes>) => {
      state.savedEpisodes = action.payload;
    },
    setSavedAnimeTitle: (state, action: PayloadAction<string>) => {
      state.savedAnimeTitle = action.payload;
    },
    setContinueWatching: (state, action: PayloadAction<streamModal[]>) => {
      state.continueWatching = action.payload;
    },
    setVideoLink: (state, action: PayloadAction<string>) => {
      state.videoLink = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSavedCurrentTime,
  setSavedStartTime,
  setSavedEpisode,
  setSavedAnimeTitle,
  setContinueWatching,
  setSavedEpisodes,
  setVideoLink,
} = videoSlice.actions;

export default videoSlice.reducer;
