import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { streamModal, streamSearch } from "../types/type";
import { streamDataState } from "../types/initialDataState";
import { animeApi } from "../backend/anime_api";

interface initialStateInterface {
  searchResults: streamSearch[];
  searchQuery: string;
  searchQueryView: string;
  searchLoading: boolean;
  pageLoading: boolean;
  hasNextPage: boolean;
  lastPage: number | null;
  type: string;
  recentReleases: boolean;
  bookmarks: streamModal[];
  currentPage: number;
  modalData: streamModal;
  stream: any;
  streamEpisode: {
    id: string;
    number: number;
    title: string;
    description: string;
    image: string;
  };
  episodeSelected: boolean;
  // below is length of recent releases
  recentReleasesLength: number;
}

const isMobile = () => {
  return window.innerWidth < 768;
};

export const fetchTopAnimes = createAsyncThunk(
  "anime/fetchTopAnimes",
  async (currentPage: number, thunkApi) => {
    const state = thunkApi.getState() as any;
    const data = await animeApi.advancedSearch({
      page: currentPage,
      perPage: isMobile() ? 26 : 25,
      sort: '["SCORE_DESC"]',
      ...(state?.filter?.format?.value && {
        format: state?.filter?.format?.value,
      }),
      ...(state?.filter?.status?.value && {
        status: state?.filter?.status?.value,
      }),
    });
    thunkApi.dispatch(animeSearch(data.results));
    thunkApi.dispatch(setHasNextPage(data.hasNextPage));
    thunkApi.dispatch(setLastPage(data.totalPages));
  }
);

const initialState: initialStateInterface = {
  searchResults: [],
  searchQuery: "",
  searchQueryView: "",
  searchLoading: false,
  pageLoading: false,
  hasNextPage: false,
  lastPage: null,
  type: "",
  recentReleases: true,
  bookmarks: [],
  currentPage: 1,
  modalData: {
    ...streamDataState,
  },
  stream: {},
  streamEpisode: {
    id: "",
    number: 0,
    title: "",
    description: "",
    image: "",
  },
  episodeSelected: false,
  recentReleasesLength: 0,
};

export const animeSlice = createSlice({
  name: "anime",
  initialState: initialState,
  reducers: {
    animeSearch: (state, action: PayloadAction<[]>) => {
      state.searchResults = action.payload;
    },
    setPageLoadingAction: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    // searchQueryView is used to store what the user is searching for without filling the search input bar
    setSearchQueryView: (state, action: PayloadAction<string>) => {
      state.searchQueryView = action.payload;
    },
    setHasNextPage: (state, action: PayloadAction<boolean>) => {
      state.hasNextPage = action.payload;
    },
    searchLoadingAction: (state, action: PayloadAction<boolean>) => {
      state.searchLoading = action.payload;
    },
    setLastPage: (state, action: PayloadAction<number>) => {
      state.lastPage = action.payload;
    },
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setRecentReleases: (state, action: PayloadAction<boolean>) => {
      state.recentReleases = action.payload;
    },
    setBookmarks: (state, action: PayloadAction<streamModal[]>) => {
      state.bookmarks = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setModalData: (state, action: PayloadAction<streamModal>) => {
      state.modalData = action.payload;
    },
    setStream: (state, action: PayloadAction<any>) => {
      state.stream = action.payload;
    },
    setStreamEpisode: (
      state,
      action: PayloadAction<{
        id: string;
        number: number;
        title: string;
        description: string;
        image: string;
      }>
    ) => {
      state.streamEpisode = action.payload;
    },
    setEpisodeSelected: (state, action: PayloadAction<boolean>) => {
      state.episodeSelected = action.payload;
    },
    setRecentReleasesLength: (state, action: PayloadAction<number>) => {
      state.recentReleasesLength = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  animeSearch,
  setSearchQuery,
  setSearchQueryView,
  setHasNextPage,
  setLastPage,
  searchLoadingAction,
  setPageLoadingAction,
  setType,
  setRecentReleases,
  setBookmarks,
  setCurrentPage,
  setModalData,
  setStream,
  setStreamEpisode,
  setEpisodeSelected,
  setRecentReleasesLength,
} = animeSlice.actions;

export default animeSlice.reducer;
