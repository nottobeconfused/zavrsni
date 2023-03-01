import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Routes, Route, Link } from "react-router-dom";
import Login from "./Login";
axios.defaults.withCredentials = true;
const Welcome = () => {

  return (
    <div className='login-signup'>
    <div className="header-forma-login-signup">
        <div>
        <h1>PROPUH</h1>
        <p>Aplikacija za suradnju i repozitorij školskih sadržaja</p>
        <p><i>Na ovoj platformi možeš surađivati s drugima, otvoriti grupe i organizirati svoje zadatke!</i></p>
        </div>
    </div>
    <div className="main-login-signup">
        <div className="pokazatelj">
            <p className='p'>Prijava | Registracija</p>
        </div>
        <div className="glavna-forma">
            <p className='p'>
                <Link id='gumb-login-signup' to="/signup">Registriraj se!</Link>
            </p>
            <p className='p'>
                <Link id='gumb-login-signup' to="/login">Prijavi se!</Link>
            </p>
        </div>
    </div>
    </div>
  );
};

export default Welcome;