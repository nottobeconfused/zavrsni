import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ObjavaOtvoreno = ({ onClose, objavaId, tekst, naziv, grupaId, user, grupa, edit}) => {
    const [objavaIme, setObjavaIme] = useState(naziv);
    const [objavaTekst, setObjavaTekst] = useState(tekst);
    const [objavaKomentar, setObjavaKomentar] = useState("");
    const [objavaKomentari, setObjavaKomentari] = useState([]);
    const [ifAdmin, setIfAdmin] = useState();

    console.log(objavaKomentari)

    
    const handleNaziv = (e) => {
        setObjavaIme(e);
    }
    
    const handleTekst = (e) => {
        setObjavaTekst(e);
    }

    const handleKomentar = (e) => {
      setObjavaKomentar(e);
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
    const dodajKomentar = async (e) => {
      try {
        const res = await axios.post(
          `http://localhost:5000/api/objava-komentar/${objavaId}`,
          { sadrzaj: objavaKomentar },
          { withCredentials: true }
        )
        const data = await res.data;
        return data;
      } catch (error) {
        console.error(error);
        alert('Nismo uspjeli pohraniti komentar.');
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
  const sendRequestObjavaKomentari = async () => {
    const res = await axios.get(`http://localhost:5000/api/objava-komentari/${objavaId}`, {
        withCredentials: true
    }).catch((err) => console.log(err));
    return res.data;
}
    
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
      sendRequestObjavaKomentari().then((data) => {
        setObjavaKomentari(data)
      });
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
                {edit && ifAdmin  ? (
                <input className="ob-input" type="file" name="ob-file" id="ob-file" multiple/>
                ) : (
                <input className="ob-input" type="file" name="ob-file" id="ob-file" multiple disabled={true}/>
                )}
            </div>

            <div className="objava-polje objava-komentari">
                <label className="ob-label" htmlFor="ob-komentar">Novi komentar:</label>
                <textarea className="ob-input" name="ob-komentar" id="ob-komentar" cols="auto" rows="3" placeholder="Komentar..." onChange={(e) => handleKomentar(e.target.value)} ></textarea>
                <div><button className="gumb-ob" id="save" onClick={dodajKomentar}>Spremi komentar</button></div>
                <div className="objava-polje objava-tekst korisnici">
              <p>Komentari:</p>
              {objavaKomentari?.length > 0 ? (
                  objavaKomentari?.map(item => (
                    <div className=" korisnik komentar" key={item._id}>
                      <div className='kom-info'>
                        <i>{item.user}</i>
                        <p>{new Date(item.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
                      </div>
                      <div>{item.tekst}</div>
                  </div>
                ))
              ) : (
                  <div>
                    <p>Nema komentara!</p>
                  </div>
              )}
              </div>
            </div>

        </div>

        <div className="ob-funkcije objava-gumbi">
            {edit && ifAdmin ? (<button className="gumb-ob" id="delete" onClick={obrisi}>Obriši</button>) : null}
            <button className="gumb-ob" id="cancel" onClick={onClose}>Zatvori</button>
            {edit && ifAdmin ? (<button className="gumb-ob" id="save" onClick={uredi}>Spremi</button>) : null}
        </div>

        </div>
    </div>
    </div>
  );
};

export default ObjavaOtvoreno;