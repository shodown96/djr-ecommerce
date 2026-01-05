import { configureStore } from "@reduxjs/toolkit";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import authReducer from "./store/reducers/auth";
import cartReducer from "./store/reducers/cart";

// ---------------- REDUX STORE ----------------

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: import.meta.env.DEV,
});

// ---------------- REACT 18 ----------------

const container = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
