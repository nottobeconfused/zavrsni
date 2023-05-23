import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Naslovna from "./scenes/naslovna/Naslovna";
import Grupa from "./scenes/Grupe/Grupa";
import { authActions } from "./store/index.js";

function App() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (storedIsLoggedIn) {
      dispatch(authActions.login());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== "/login" && location.pathname !== "/signup") {
      window.location.href = "/login";
    }
  }, [isLoggedIn, location]);

  return (
    <Routes>
      {isLoggedIn && <Route path="/user/*" element={<Naslovna />} />}
      {isLoggedIn && <Route path="/grupe/:id/*" element={<Grupa />} />}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<Welcome />} />
    </Routes>
  );
}

export default App;
