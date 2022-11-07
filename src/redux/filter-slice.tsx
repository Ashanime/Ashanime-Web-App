import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateInterface {
  type: string;
  format: {
    value: string;
    name: string;
  };
  sort: {
    name: string;
    value: string;
  };
  genres: string[];
  submit: boolean;
  year: number | null;
  status: {
    name: string;
    value: string;
  };
  statusInSearch: {
    name: string;
    value: string;
  };
}

const initialState: initialStateInterface = {
  type: "",
  format: {
    value: "",
    name: "",
  },
  sort: {
    name: "",
    value: "",
  },
  genres: [],
  submit: false,
  year: null,
  status: {
    name: "",
    value: "",
  },
  statusInSearch: {
    name: "",
    value: "",
  },
};

export const filterSlice = createSlice({
  name: "filter",
  initialState: initialState,
  reducers: {
    setType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setFormat: (
      state,
      action: PayloadAction<{
        value: string;
        name: string;
      }>
    ) => {
      state.format = action.payload;
    },
    setSort: (
      state,
      action: PayloadAction<{
        name: string;
        value: string;
      }>
    ) => {
      state.sort = action.payload;
    },
    setGenres: (state, action: PayloadAction<string[]>) => {
      state.genres = action.payload;
    },
    setSubmit: (state, action: PayloadAction<boolean>) => {
      state.submit = action.payload;
    },
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
    setStatus: (
      state,
      action: PayloadAction<{
        name: string;
        value: string;
      }>
    ) => {
      state.status = action.payload;
    },
    setStatusInSearch: (
      state,
      action: PayloadAction<{
        name: string;
        value: string;
      }>
    ) => {
      state.statusInSearch = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setType,
  setFormat,
  setSort,
  setGenres,
  setSubmit,
  setYear,
  setStatus,
  setStatusInSearch,
} = filterSlice.actions;

export default filterSlice.reducer;
