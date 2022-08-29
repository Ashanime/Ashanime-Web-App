import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface notification {
  title: string;
  message: string;
  show: boolean;
}

interface initialStateInterface {
  notification: notification;
}

const initialState: initialStateInterface = {
  notification: {
    title: "",
    message: "",
    show: false,
  },
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    notificationMessage: (state, action: PayloadAction<notification>) => {
      state.notification = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { notificationMessage } = notificationSlice.actions;

export default notificationSlice.reducer;
