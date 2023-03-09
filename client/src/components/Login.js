import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from '../store';
function Login() {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [errorM, seterrorM] = useState("");
    function handleErrorM(){
        seterrorM("Netočni podaci!");
    };
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    const handleChange = (e) => {
        setInputs((prev) => ({
            ...prev,
        [e.target.name]: e.target.value,
        }));
        seterrorM("");
    };
    const sendRequest = async() => {
        const res = await axios.post("http://localhost:5000/api/login", {
            email: inputs.email,
            password: inputs.password,
        })
        .catch (err => {
            console.log(err);
            handleErrorM();
        });
        const data = await res.data;
        return data;
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then(()=> dispatch(authActions.login())).then(() => history("/user"));
    }
  return (
    <div className='login-signup'>
    <div className="header-forma-login-signup">
        <h1>PROPUH</h1>
    </div>
    <div className="main-login-signup">
        <div className="pokazatelj">
            <p className='p'>Prijava</p>
        </div>
        <div className="glavna-forma">
            <form onSubmit={handleSubmit}>
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
                {errorM && <section className='errorM'>{errorM}</section>}

                <button id="gumb-login-signup" className='gumb' type="submit">Prijavi se</button>
            </form>
            <p className='p'>
                Još nemaš račun?
                <Link className='link-signup-login gumb' to="/signup">Registriraj se!</Link>
            </p>
        </div>
    </div>
    </div>
  );
}

export default Login