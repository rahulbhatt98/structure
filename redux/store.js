import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { encryptTransform } from "redux-persist-transform-encrypt";
import rootReducer from "./rootReducer";
import { createWrapper } from "next-redux-wrapper";

const persistConfig = {
  key: "jobr",
  transforms: [
    encryptTransform({
      secretKey: "4226452948404D635166546A576D5A7134743777217A25432A462D4A614E6452",
      onError: function (error) {
        // Handle the error.
      },
    }),
  ],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export const wrapper = createWrapper(() => store, { debug: true });
