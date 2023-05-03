import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ObjavaOtvoreno = ({ onClose, objavaId, tekst, naziv, grupaId, user, grupa, edit}) => {
    const [objavaIme, setObjavaIme] = useState(naziv);
    const [objavaTekst, setObjavaTekst] = useState(tekst);
    const [ifAdmin, setIfAdmin] = useState();

    
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
    
    const obrisi = async (e) => {
        try {
            await axios.post(
            `http://localhost:5000/api/objava-brisanje/${objavaId}`,
            { withCredentials: true }
          )
        } catch (error) {
          console.error(error);
          alert('Nemate ovlasti za brisanje.');
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
    useEffect(() => {
        if(edit){
        if (grupa.admin === user._id) {
          setIfAdmin(true);
        } else {
          setIfAdmin(false);
        }
    }
      },[]);
      

  return (
     <div className='objavaIznad'>
    <div className="novaObjavaBackground">
        <div className='ob-modal'>
            <div className="ob-funkcije ob-zad">
        </div>
        <div className='novaObjava-modal'>

            <div className="objava-polje objava-naziv">
                <label className="ob-label" htmlFor="ob-ime">Naziv objave</label>
                {edit && ifAdmin ? (
                <input 
                className="ob-input"
                 type="text"
                name="ob-ime" 
                id="ob-ime" 
                placeholder="Naziv objave"
                defaultValue={naziv}
                onChange={(e) => handleNaziv(e.target.value)} 
                />
                ):(
                <input 
                className="ob-input"
                 type="text"
                name="ob-ime" 
                id="ob-ime"
                defaultValue={naziv}
                disabled={true}
                />
                )}
            </div>

            <div className="objava-polje objava-tekst">
                <label className="ob-label" htmlFor="ob-txt">Tekst objave</label>
                {edit && ifAdmin  ? (
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
                ) : (
                    <textarea 
                    className="ob-input" 
                    name="ob-txt" 
                    id="ob-txt" 
                    cols="auto" 
                    rows="7" 
                    defaultValue={tekst}
                    disabled={true}
                    /> 
                )}
                
            </div>

            <div className="objava-polje objava-datoteke">
                <label className="ob-label" htmlFor="ob-file">Datoteke</label>
                <input className="ob-input" type="file" name="ob-file" id="ob-file" multiple/>
            </div>

        </div>

        <div className="ob-funkcije objava-gumbi">
            {edit &&  (<button className="gumb-ob" id="delete" onClick={obrisi}>Obriši</button>)}
            <button className="gumb-ob" id="cancel" onClick={onClose}>Zatvori</button>
            {edit &&  (<button className="gumb-ob" id="save" onClick={uredi}>Spremi</button>)}
        </div>

        </div>
    </div>
    </div>
  );
};

export default ObjavaOtvoreno;