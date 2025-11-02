import { configureStore } from "@reduxjs/toolkit";
import { createContext } from "react";
import { apiSlice } from "./api/apiSlice";
// import { authSlice } from "./features/authSlice";
import authReducer from "./features/authSlice.js"
import contactReducer from "./features/contactSlice.js"




export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        contact: contactReducer
    },
    middleware: (GetDefaultMiddleware) => {
        return GetDefaultMiddleware().concat(apiSlice.middleware)
    }
})