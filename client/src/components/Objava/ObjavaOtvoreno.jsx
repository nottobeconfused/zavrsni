import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Odgovor from './Odgovor';
import NewOdgovor from './noviOdgovor';
import OdgovorOtvoreno from './OdgovorOtvoreno';

const ObjavaOtvoreno = ({ onClose, objavaId, tekst, naziv, OD, DO, ocjena, grupaId, user, grupa, edit, ifZadatak, odgovori}) => {
    const [objavaIme, setObjavaIme] = useState(naziv);
    const [objavaTekst, setObjavaTekst] = useState(tekst);
    const [objavaKomentar, setObjavaKomentar] = useState("");
    const [objavaKomentari, setObjavaKomentari] = useState([]);

    const [objavaOdgovori, setObjavaOdgovori] = useState(odgovori)

    const [objavaDatumOd, setObjavaDatumOd] = useState(OD);
    const [objavaDatumDo, setObjavaDatumDo] = useState(DO);
    const [objavaOcjena, setObjavaOcjena] = useState(ocjena);

    const [ifAdmin, setIfAdmin] = useState();

    const [objavaDatoteke, setObjavaDatoteke] = useState([]);
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);

    
    const handleNaziv = (e) => {
        setObjavaIme(e);
    }
    
    const handleTekst = (e) => {
        setObjavaTekst(e);
    }

    const handleDatumOd = (e) => {
      setObjavaDatumOd(e);
  }
  const handleDatumDo = (e) => {
      setObjavaDatumDo(e);
  }

    const handleKomentar = (e) => {
      setObjavaKomentar(e);
  }
        
  const getDatoteke = async () => {
    setLoading(true);
    try{
        const res = await axios.get(`http://localhost:5000/api/objava-datoteke/${objavaId}`);
        setLoading(false);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
const downloadDatoteka = async (datId) => {
  try{
    const res = await axios.get(
      `http://localhost:5000/api/objava-datoteke-download/${datId}`,
      {responseType: 'blob'},
    );
    const blob = new Blob([res.data], { type: res.data.type });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "untitled";
      link.click();
  } catch (error) {
    console.log(error);
  }
}

const uredi = async (e) => {
  e.preventDefault()
  try {
    const formData = new FormData();
    formData.append("naslov", objavaIme);
    formData.append("sadrzaj", objavaTekst);
    formData.append("OD", objavaDatumOd);
    formData.append("DO", objavaDatumDo);
    formData.append("ocjena", objavaOcjena);

    const fileInput = fileInputRef.current;
    if (fileInput.files.length > 0) {
      formData.append("file", fileInput.files[0]);
    }

    const res = await axios.post(
      `http://localhost:5000/api/objava/${objavaId}`,
      formData,
      { withCredentials: true }
    );
    const data = await res.data;
    return data;
  } catch (error) {
    console.error(error);
    alert('Nismo uspjeli urediti objavu.');
  }
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
  };
  
  const sendRequestObjavaKomentari = async () => {
    const res = await axios.get(`http://localhost:5000/api/objava-komentari/${objavaId}`, {
        withCredentials: true
    }).catch((err) => console.log(err));
    return res.data;
}
const sendRequestObjavaOdgovori = async () => {
  const res = await axios.get(`http://localhost:5000/api/objava-odgovori/${objavaId}`, {
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
    };
    const obrisiDatoteku = async (datId) => {
      try {
          await axios.post(
          `http://localhost:5000/api/datoteka-brisanje/${datId}`,
          { withCredentials: true }
        )
      } catch (error) {
        console.error(error);
        alert('Nemate ovlasti za brisanje.');
      }
  };
    useEffect(() => {
      sendRequestObjavaKomentari().then((data) => {
        setObjavaKomentari(data)
      });
      sendRequestObjavaOdgovori().then((data) => {
        setObjavaOdgovori(data)
      });
      getDatoteke().then((data) => {
        setObjavaDatoteke(data)
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
                  <>
                <input className="ob-input" type="file" name="ob-file" id="ob-file" ref={fileInputRef}/>
                <div className="objava-polje objava-tekst korisnici">
              {objavaDatoteke?.length > 0 ? (
                  objavaDatoteke?.map(item => (
                    <div className=" korisnik komentar" key={item._id}>
                      <div className='kom-info'>
                        <div>
                        <i>{item.file}</i>
                        <p>{new Date(item.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
                        </div>
                        <div className='btn-file'>
                          <button className="gumb-ob" id="delete" onClick={() => obrisiDatoteku(item._id)}>Obriši</button>
                        <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(item._id)}>Preuzmi</button>
                        </div>
                      </div>
                  </div>
                ))
              ) : (
                  <div>
                    <p>Nema datoteka!</p>
                  </div>
              )}
              </div>
              </>
                ) : (
                  <div className="objava-polje objava-tekst korisnici">
              {objavaDatoteke?.length > 0 ? (
                  objavaDatoteke?.map(item => (
                    <div className=" korisnik komentar" key={item._id}>
                      <div className='kom-info'>
                        <i>{item.file}</i>
                        <p>{new Date(item.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
                        <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(item._id)}>Preuzmi</button>
                      </div>
                  </div>
                ))
              ) : (
                  <div>
                    <p>Nema datoteka!</p>
                  </div>
              )}
              </div>
                )}
            </div>

            
            {ifZadatak && edit && ifAdmin && (
  <div className='objava-oddo'>
    <div className="objava-polje">
      <label htmlFor="od">OD datuma:</label>
      <input 
        className="ob-input" 
        type="date" 
        name="od" 
        id="od" 
        defaultValue={OD}
        onChange={(e) => handleDatumOd(e.target.value)} 
      />
    </div>
    <div className="objava-polje">
      <label htmlFor="do">DO datuma:</label>
      <input 
        className="ob-input" 
        type="date" 
        name="do" 
        id="do" 
        defaultValue={DO}
        onChange={(e) => handleDatumDo(e.target.value)} 
      />
    </div>
  </div>
)}
{(!ifZadatak) && (<></>
)}
                {ifZadatak && ifAdmin === false ? (
                  <div className="objava-polje objava-datoteke odgovori">
                    <p>Predaja zadaće:</p>
                      <NewOdgovor objavaId={objavaId} user={user}/>
                </div>
                ):null}
                

                {ifZadatak && edit ? (
  <div className="objava-polje objava-datoteke odgovori">
    <>
      {ifAdmin ? (
        <label className="ob-label" htmlFor="ob-file">Odgovori</label>
      ) : null}
      <div className="objava-polje objava-tekst korisnici">
        {objavaOdgovori?.length > 0 ? (
          objavaOdgovori?.map((item) => {
            if (ifAdmin || item.userId === user._id) {
              return (
                <div className="korisnik komentar" key={item._id}>
                  <div className="kom-info">
                    <i>{item.admin}</i>
                    <p>{new Date(item.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
                  </div>
                  <div>
                    {item.datoteke?.map((dat) => (
                      <div className="korisnik komentar" key={dat.id}>
                        <div className="kom-info">
                          <p>{dat.file}</p>
                          <button className="gumb-ob" id="delete" onClick={() => obrisiDatoteku(item._id)}>Obriši</button>
                          <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(dat.id)}>Preuzmi</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    Komentari uz zadaću:
                    {item.komentari?.map((kom) => (
                      <div className="korisnik komentar" key={kom.id}>
                        <div className="kom-info">
                          {kom}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })
        ) : null}
      </div>
    </>
  </div>
): null}
                

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