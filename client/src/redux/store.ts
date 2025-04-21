import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import boardReducer from "./features/boardSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        board: boardReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
