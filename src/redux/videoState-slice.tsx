import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { streamModal } from "../types/type";

export type savedEpisode = {
  id: string;
  number: number;
  title: string;
  description: string;
  image: string;
};

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
  streamProvider: string | null;
  streamEpisodeObject: savedEpisode;
  streamEpisodeLinkObject: any;
}

const initialState: initialStateInterface = {
  savedCurrentTime: 0,
  savedStartTime: 0,
  savedEpisode: {
    id: "",
    number: 0,
    title: "",
    description: "",
    image: "",
  },
  savedEpisodes: {},
  savedAnimeTitle: "",
  continueWatching: [],
  videoLink: "",
  streamProvider: null,
  streamEpisodeObject: {
    id: "",
    number: 0,
    title: "",
    description: "",
    image: "",
  },
  streamEpisodeLinkObject: {},
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
    setStreamProvider: (state, action: PayloadAction<string>) => {
      state.streamProvider = action.payload;
    },
    setStreamEpisodeObject: (state, action: PayloadAction<savedEpisode>) => {
      state.streamEpisodeObject = action.payload;
    },
    setStreamEpisodeLinkObject: (state, action: PayloadAction<any>) => {
      state.streamEpisodeLinkObject = action.payload;
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
  setStreamProvider,
  setStreamEpisodeObject,
  setStreamEpisodeLinkObject,
} = videoSlice.actions;

export default videoSlice.reducer;
