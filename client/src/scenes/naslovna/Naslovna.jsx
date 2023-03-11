import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';
import { useEffect, useState } from "react";
import axios from "axios";


axios.defaults.withCredentials = true;
const Naslovna = () => {
    const [grupe, setGrupe] = useState();
    const sendRequest = async () => {
        const res = await axios.get('http://localhost:5000/api/grupe', {
            withCredentials: true
        }).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }
    useEffect(() => {
            sendRequest().then((data) => setGrupe(data.user));
    }, [])

  const Objave = [
    { 
        imeGrupe, 
        nazivZadatka,
        tekst,
        od,
    },
  ];
    return (
        <>
        <Navigacija data={grupe.data} />
        <NavTop />
        <div className="main">
        {Objave.map(item => (
            <Objava item={item}/>
          ))}
        </div>
        </>
    )
}

export default Naslovna;