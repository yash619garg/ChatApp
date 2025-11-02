import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { SocketProvider } from "./context/Socket.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <App />
        <ToastContainer autoClose={3000} />
      </SocketProvider>
    </Provider>
  </React.StrictMode>
);
