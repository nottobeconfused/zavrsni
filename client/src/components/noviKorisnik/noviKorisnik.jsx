import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewKorisnik = ({ onClose, id, grupa, user}) => {
    const [pretraga, setPretraga] = useState('');
    const [korisnici, setKorisnici] = useState([]);
    const [odabraniKorisnici, setOdabraniKorisnici] = useState([]);

    const [ifAdmin, setIfAdmin] = useState();
    
    const [animationStatus, setAnimationStatus] = useState("initial");

    const handleNaziv = (e) => {
        setPretraga(e);
    }
    const odaberiKorisnika = (korisnik) => {
      if (!odabraniKorisnici.includes(korisnik._id)) {
        setOdabraniKorisnici(odabraniKorisnici => [...odabraniKorisnici, korisnik]);
      }
    };
    

    const dodaj = async () => {
        try {
          const res = await axios.post(
            `http://localhost:5000/api/dodaj-korisnika/${id}`,
            { korisnikIds: odabraniKorisnici.map(korisnik => korisnik._id) },
            { withCredentials: true }
          )
          const data = await res.data;
          setAnimationStatus("success");
          return data;
        } catch (error) {
          console.error(error);
          alert('Nismo uspjeli dodati korisnika.');
        }
    };
    
    useEffect(() => {
      const getKorisnici = async () => {
        try {
          let res;
          if (pretraga.length === 0 || pretraga.length > 1) {
            res = await axios.get(`http://localhost:5000/api/korisnici/${pretraga}`, { withCredentials: true });
          } else {
            res = await axios.get(`http://localhost:5000/api/korisnici`, { withCredentials: true });
          }
          setKorisnici(res.data);
        } catch (err) {
          console.error(err);
        }
      };
      getKorisnici();

        if (grupa.admin === user._id) {
          setIfAdmin(true);
        } else {
          setIfAdmin(false);
        }
    }, [pretraga]);

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
                placeholder="korisničko ime | email"
                onChange={e => handleNaziv(e.target.value)} 
                />
            </div>

            <div className="objava-polje objava-tekst korisnici">
              <p>Rezultati pretrage:</p>
              {korisnici?.length > 0 ? (
                korisnici.map(korisnik => (
                  <div
                    className={`korisnik${korisnik.grupe.some(k => k.id === grupa._id) ? " zeleno" : ""}`}
                    key={korisnik._id}
                    onClick={() => !korisnik.grupe.some(k => k.id === grupa._id) && odaberiKorisnika(korisnik)}
                  >
                    <p>{korisnik.korisnickoIme}</p>
                    <p>{korisnik.email}</p>
                    {korisnik.grupe.some(k => k.id === grupa._id) && (
                      <i>Korisnik je u ovoj grupi!</i>
                    )}
                  </div>
                ))
              ) : (
                <div className="karticaZadatka">
                  <div className="ikona_ime_kartica">
                    <p>Nema korisnika u bazi!</p>
                  </div>
                </div>
              )}
            </div>
            {ifAdmin && (
              <div className="objava-polje objava-tekst korisnici">
              <p>Odabrani korisnici:</p>
            {odabraniKorisnici?.length > 0 ? (
            odabraniKorisnici.map(korisnik => (
              <div className="korisnik" key={korisnik._id}>
                <p>{korisnik.korisnickoIme}</p>
                <p>{korisnik.email}</p>
              </div>
            ))) : (
              <div className="karticaZadatka">
              <div className="ikona_ime_kartica">
              <p>Nema odabranih korisnika!</p>
              </div>
          </div>
            )}
            </div>
            )}
            
        </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="cancel" onClick={onClose}>Zatvori</button>
            {ifAdmin && (<button className="gumb-ob" id="save" onClick={dodaj}>
                    {animationStatus === "initial" && "Spremi"}
                    {animationStatus === "success" && (
                      <>
                        <span>&#10003;</span> Spremljeno!
                      </>
                    )}
                  </button>)}
        </div>

        </div>
    </div>
  );
};

export default NewKorisnik;