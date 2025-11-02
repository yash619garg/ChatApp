import React from "react";
import { Button } from "./components/ui/button";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRoute from "./components/app/userRoute";
import { SocketProvider } from "./context/Socket";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/private" element={<UserRoute />}>
          <Route path="chat" element={<Chat />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
