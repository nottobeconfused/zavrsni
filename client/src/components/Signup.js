import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";
import axios from "axios";

function Signup() {
    const history = useNavigate();
    const [inputs, setInputs] = useState({
        korisnickoIme: "",
        email: "",
        password: ""
    });
    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
        [e.target.name]: e.target.value,
        }));
    };
    const sendRequest = async() => {
        const res = await axios.post('https://propuh.onrender.com/api/signup', {
            korisnickoIme: inputs.korisnickoIme,
            email: inputs.email,
            password: inputs.password
        }).catch((err)=>console.log(err));
        const data = await res.data;
        return data;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(() => history("/login"));
    }
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
            <p className='p'>Registracija</p>
        </div>
        <div className="glavna-forma">
            <form onSubmit={handleSubmit}>


            <input 
            className="input-login-signup" 
            value={inputs.korisnickoIme} 
            onChange={handleChange}
            type="text" 
            name="korisnickoIme" 
            id="kor-ime" 
            placeholder="korisničko ime"/>

            <input 
            className="input-login-signup" 
            value={inputs.email} 
            onChange={handleChange}
            type="email" 
            name="email" 
            id="kor-email" 
            placeholder="e-mail adresa"/>
            
            <input 
            className="input-login-signup" 
            value={inputs.password} 
            onChange={handleChange}
            type="password" 
            name="password" 
            id="kor-lozinka" 
            placeholder="lozinka"/>

            <button id="gumb-login-signup" className='gumb' type="submit">Registriraj se</button>
            </form>
            <p className='p'>
                Već imaš račun?
                <Link className='link-signup-login gumb' to="/login">Prijavi se!</Link>
            </p>
        </div>
    </div>
    </div>
  );
}

export default Signup