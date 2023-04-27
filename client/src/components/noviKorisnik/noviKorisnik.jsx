import React, { useState } from 'react';
import axios from 'axios';

const NewKorisnik = ({ onClose, id }) => {
    const [pretraga, setPretraga] = useState('');
    const [korisnici, setKorisnici] = useState([]);
    const [korisnikId, setKorisnikId] = useState('');
    

    const handleNaziv = (e) => {
        setPretraga(e);
    }
    const handlekorisnik = (e) => {
     setKorisnikId(e);
 }

    const dodaj = async (e) => {
        try {
          const res = await axios.post(
            `http://localhost:5000/api/dodaj-korisnika/${id}`,
            { id: korisnikId },
            { withCredentials: true }
          )
          const data = await res.data;
          return data;
        } catch (error) {
          console.error(error);
          alert('Nismo uspjeli kreirati objavu.');
        }
    };
    const getKorisnici = async (e) => {
     try {
       const res = await axios.get(
         `http://localhost:5000/api/korisnici`,
         { withCredentials: true }
       )
       const data = await res.data;
       return data;
     } catch (error) {
       console.error(error);
       alert('Nismo uspjeli kreirati objavu.');
     }
 };

  return (
    <div className="novaObjavaBackground">
        <div className='ob-modal'>
        <div className='novaObjava-modal'>

            <div className="objava-polje objava-naziv">
                <label className="ob-label" htmlFor="ob-ime">Pretraži</label>
                <input 
                className="ob-input"
                 type="text"
                name="ob-ime" 
                id="ob-ime" 
                placeholder="Naziv objave"
                onChange={(e) => handleNaziv(e.target.value)} 
                />
            </div>

            <div className="objava-polje objava-tekst">
                
            </div>
            <div className="objava-polje objava-tekst odabrano">
                
            </div>
        </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="cancel" onClick={onClose}>Cancel</button>
            <button className="gumb-ob" id="save" onClick={dodaj}>Spremi</button>
        </div>

        </div>
    </div>
  );
};

export default NewKorisnik;