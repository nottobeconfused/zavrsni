import React, { useState } from 'react';
import axios from 'axios';

const ObjavaOtvoreno = ({ onClose, objavaId, tekst, naziv, grupaId}) => {
    const [objavaIme, setObjavaIme] = useState(naziv);
    const [objavaTekst, setObjavaTekst] = useState(tekst);
    

    const handleNaziv = (e) => {
        setObjavaIme(e);
    }
    
    const handleTekst = (e) => {
        setObjavaTekst(e);
    }

    const uredi = async (e) => {
        try {
          const res = await axios.post(
            `http://localhost:5000/api/objava/${objavaId}`,
            { naslov: objavaIme, sadrzaj: objavaTekst, grupaId: grupaId },
            { withCredentials: true }
          )
          const data = await res.data;
          return data;
        } catch (error) {
          console.error(error);
          alert('Nismo uspjeli kreirati objavu.');
        }
    // else{
    //     try {
    //         const res = await axios.post('http://localhost:5000/api/novi-zadatak', { nazivObjave: objavaIme, tekst: objavaTekst, od: objavaDatumOd, do: objavaDatumDo,  ocjena: objavaOcjena  }, { withCredentials: true });
    
    //         const data = await res.data;
    //         return data;
    //         } catch (error) {
    //         console.error(error);
    //         alert('Nismo uspjeli kreirati zadatak.');
    //      }
    //     }
    };

  return (
     <div className='objavaIznad'>
    <div className="novaObjavaBackground">
        <div className='ob-modal'>
            <div className="ob-funkcije ob-zad">
        </div>
        <div className='novaObjava-modal'>

            <div className="objava-polje objava-naziv">
                <label className="ob-label" htmlFor="ob-ime">Naziv objave</label>
                <input 
                className="ob-input"
                 type="text"
                name="ob-ime" 
                id="ob-ime" 
                placeholder="Naziv objave"
                defaultValue={naziv}
                onChange={(e) => handleNaziv(e.target.value)} 
                />
            </div>

            <div className="objava-polje objava-tekst">
                <label className="ob-label" htmlFor="ob-txt">Tekst objave</label>
                <textarea 
                className="ob-input" 
                name="ob-txt" 
                id="ob-txt" 
                cols="auto" 
                rows="7" 
                placeholder="Tekst objave..."
                defaultValue={tekst}
                onChange={(e) => handleTekst(e.target.value)} 
                />
            </div>

            <div className="objava-polje objava-datoteke">
                <label className="ob-label" htmlFor="ob-file">Datoteke</label>
                <input className="ob-input" type="file" name="ob-file" id="ob-file" multiple/>
            </div>

        </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="delete" onClick={onClose}>Obriši</button>
            <button className="gumb-ob" id="cancel" onClick={onClose}>Zatvori</button>
            <button className="gumb-ob" id="save" onClick={uredi}>Spremi</button>
        </div>

        </div>
    </div>
    </div>
  );
};

export default ObjavaOtvoreno;