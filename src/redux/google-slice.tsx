import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface profileObject {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

interface initialStateInterface {
  profileObject: profileObject;
}

const initialState: initialStateInterface = {
  profileObject: {
    uid: "",
    email: "",
    displayName: "",
    photoURL: "",
  },
};

export const googleSlice = createSlice({
  name: "google",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<profileObject>) => {
      state.profileObject = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser } = googleSlice.actions;

export default googleSlice.reducer;
