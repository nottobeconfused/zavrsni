import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
axios.defaults.withCredentials = true;
const Welcome = () => {

  return (
    <div className='login-signup'>
    <div className="header-forma-login-signup">
        <div className="welcome-poruka">
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
                <Link className='gumb-login-signup' to="/signup">Registriraj se!</Link>
            </p>
            <p className='p'>
                <Link className='gumb-login-signup' to="/login">Prijavi se!</Link>
            </p>
        </div>
    </div>
    </div>
  );
};

export default Welcome;