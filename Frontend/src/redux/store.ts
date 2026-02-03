import { configureStore } from "@reduxjs/toolkit";
import resourcesReducer from "./resourcesSlice";
import aiReducer from "./aiSlice";

export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    ai: aiReducer,
  },
});

// Types for useSelector & useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
