import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';
import { useEffect, useState } from "react";
import axios from "axios";


axios.defaults.withCredentials = true;
const Naslovna = () => {
    const [objave, setObjave] = useState(null);
  const Objave = [{...objave}];
    return (
        <>
        <Navigacija />
        <NavTop />
        <div className="main">
        {Objave?.lenght > 0 ? (
          Objave.map(item => (
            <Objava item={item}/>
          ))) : (
            <div className="karticaZadatka">
            <div className="ikona_ime_kartica">
                  <i className="uil uil-polygon" id="uil">
                    Još nemate objava!
                  </i>
            <p></p>
            </div>
        </div>
          )}
        </div>
        </>
    )
}

export default Naslovna;