import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { store } from "./app/store";
import { Provider } from "react-redux";
import Homepage from "./components/Homepage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Invitations from "./components/Invitations";
import Messages from "./components/Messages";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import MessagesHome from "./components/MessagesHome";

export const userContext = React.createContext({ user: {} });
const App = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    const _user = localStorage.getItem("user");
    if (_user) setUser(JSON.parse(_user));
  }, []);
  return (
    <userContext.Provider value={user}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Header />}>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <Homepage />{" "}
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<Login setUser={setUser} />} />
              <Route
                path="profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="profile/:userId"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="invitations"
                element={
                  <ProtectedRoute>
                    <Invitations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages"
                element={
                  <ProtectedRoute>
                    <MessagesHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="messages/:receiverID"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </userContext.Provider>
  );
};
export const useAuth = () => {
  return useContext(userContext);
};
export default App;
