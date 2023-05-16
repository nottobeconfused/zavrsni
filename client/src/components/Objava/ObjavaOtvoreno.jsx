import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import NewOdgovor from './noviOdgovor';

const ObjavaOtvoreno = ({ onClose, objavaId, tekst, naziv, OD, DO, user, grupa, edit, ifZadatak, odgovori}) => {
    const [objavaIme, setObjavaIme] = useState(naziv);
    const [objavaTekst, setObjavaTekst] = useState(tekst);
    const [objavaKomentar, setObjavaKomentar] = useState("");
    const [objavaKomentari, setObjavaKomentari] = useState([]);

    const [objavaOdgovori, setObjavaOdgovori] = useState(odgovori)

    const [objavaDatumOd, setObjavaDatumOd] = useState(OD);
    const [objavaDatumDo, setObjavaDatumDo] = useState(DO);

    const [ifAdmin, setIfAdmin] = useState();

    const [objavaDatoteke, setObjavaDatoteke] = useState([]);
    const fileInputRef = useRef(null);

    const [animationStatusDatDel, setAnimationStatusDatDel] = useState("initial");
    const [animationStatus, setAnimationStatus] = useState("initial");
    const [isDeleted, setIsDeleted] = useState(false);
    const [isKom, setIsKom] = useState(false);
    const [deletedAnswers, setDeletedAnswers] = useState([]);

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
    try{
        const res = await axios.get(`http://localhost:5000/api/objava-datoteke/${objavaId}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
const downloadDatoteka = async (datId) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/objava-datoteke-download/${datId}`,
      { responseType: 'blob' }
    );

    const contentDisposition = res.headers['content-disposition'];
    const fileName = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : 'untitled';

    const blob = new Blob([res.data], { type: res.data.type });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  } catch (error) {
    console.log(error);
  }
};

const uredi = async (e) => {
  e.preventDefault()
  setAnimationStatus("success");
  try {
    const formData = new FormData();
    formData.append("naslov", objavaIme);
    formData.append("sadrzaj", objavaTekst);
    formData.append("OD", objavaDatumOd);
    formData.append("DO", objavaDatumDo);

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
      setIsKom(true);
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
      setIsDeleted(true);
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

    const obrisiOdgovor = async (e) => {
      try {
          await axios.post(
          `http://localhost:5000/api/odgovor-brisanje/${e}`,
          { withCredentials: true }
        );
        setDeletedAnswers((prevDeletedAnswers) => [...prevDeletedAnswers, e]);
      } catch (error) {
        console.error(error);
        alert('Nemate ovlasti za brisanje.');
      }
  };


    const obrisiDatoteku = async (id) => {
      setAnimationStatusDatDel("success");
      try {
          await axios.get(
          `http://localhost:5000/api/datoteka-brisanje/${id}`,
          { withCredentials: true }
        )
      } catch (error) {
        console.error(error);
        alert('Došlo je do greške.');
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
              <label className="ob-label">Datoteke</label>
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
                        <button className="gumb-ob" id="delete" onClick={() => obrisiDatoteku(item._id)}>{animationStatusDatDel === "initial" && "Obriši"}
                  {animationStatusDatDel === "success" && (
                    <>
                      <span>&#10003;</span> Obrisano!
                    </>
                  )}</button>
                      <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(item._id)}>Preuzmi</button>
                      </div>
                    </div>
                </div>
              ))
            ) : null}
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
            ) : null}
            </div>
              )}
          </div>
            

            
            {ifZadatak && edit && ifAdmin && (
  <div className='objava-oddo'>
    <div className="objava-polje">
      <label htmlFor="od">OD datuma:</label>
      <input 
        className="ob-input" 
        type="datetime-local" 
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
        type="datetime-local" 
        name="do" 
        id="do" 
        defaultValue={DO}
        onChange={(e) => handleDatumDo(e.target.value)} 
      />
    </div>
  </div>
)}
      {ifZadatak && ifAdmin === false ? (
  <div className="objava-polje objava-datoteke odgovori">
    <div className="korisnik komentar">
      <p>Predaja zadaće:</p>
      {objavaDatumOd && objavaDatumDo ? (
        <>
          <p>Zadatak se otvara: {new Date(objavaDatumOd).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
          <p>Zadatak se zatvara: {new Date(objavaDatumDo).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
        </>
      ) : null}
    </div>
    {(new Date() > new Date(objavaDatumOd) && new Date() < new Date(objavaDatumDo)) || (!objavaDatumOd && !objavaDatumDo) ? (
      <>
        <NewOdgovor objavaId={objavaId} user={user} />
      </>
    ) : null}
  </div>
) : null}

                

                {ifZadatak && edit ? (
  <div className="objava-polje objava-datoteke odgovori">
    <>
    {ifAdmin ? (
  <label className="ob-label">Odgovori</label>
) : null}
<div className="objava-polje objava-tekst korisnici">
{objavaOdgovori?.length > 0 ? (
  objavaOdgovori?.map((item) => {
    const isCurrentUserComment = item.userId === user._id;
    const isAnswerDeleted = deletedAnswers.includes(item._id);

    if (ifAdmin || isCurrentUserComment) {
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
                          <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(dat.id)}>Preuzmi</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {item.komentari?.map((kom) => (
                      <>Komentar:
                      <div className="korisnik komentar" key={kom.id}>
                        <div className="kom-info">
                          {kom}
                        </div>
                      </div>
                      </>
                    ))}
                  </div>
          {isCurrentUserComment && !isAnswerDeleted && (
            <div className="ob-funkcije objava-gumbi">
              <button
                className="gumb-ob"
                id="delete"
                onClick={() => obrisiOdgovor(item._id)}
                disabled={isAnswerDeleted}
              >
                {isAnswerDeleted ? (
                  <>
                    <span>&#10003;</span> Obrisano
                  </>
                ) : (
                  "Obriši"
                )}
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  })
  ) : (
    <div>
      <p>Nema odgovora!</p>
    </div>
  )}
      </div>
    </>
  </div>
): null}
                

            <div className="objava-polje objava-komentari">
                <label className="ob-label" htmlFor="ob-komentar">Novi komentar:</label>
                <textarea className="ob-input" name="ob-komentar" id="ob-komentar" cols="auto" rows="3" placeholder="Komentar..." onChange={(e) => handleKomentar(e.target.value)} ></textarea>
                <div><button
          className="gumb-ob"
          id="save"
          onClick={dodajKomentar}
          disabled={isKom}
        >
          {isKom ? (
            <>
              <span>&#10003;</span> Pohranjeno!
            </>
          ) : (
            "Dodaj komentar"
          )}
        </button></div>
                <div className="objava-polje objava-tekst korisnici">
              <p>Komentari:</p>
              {objavaKomentari?.length > 0 ? (
  objavaKomentari?.map((item) => (
    <div className="korisnik komentar" key={item._id}>
      <div className="kom-info">
        <i>{item.user}</i>
        <p>{new Date(item.createdAt).toLocaleString([], { year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' })}</p>
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
        {edit && ifAdmin ? (
        <button
          className="gumb-ob"
          id="delete"
          onClick={obrisi}
          disabled={isDeleted}
        >
          {isDeleted ? (
            <>
              <span>&#10003;</span> Obrisano | zatvorite modal!
            </>
          ) : (
            "Obriši"
          )}
        </button>
      ) : null}
            <button className="gumb-ob" id="cancel" onClick={onClose}>Zatvori</button>
            {edit && ifAdmin ? (<button className="gumb-ob" id="save" onClick={uredi}>
                    {animationStatus === "initial" && "Spremi"}
                    {animationStatus === "success" && (
                      <>
                        <span>&#10003;</span> Spremljeno!
                      </>
                    )}
                  </button>) : null}
        </div>

        </div>
    </div>
    </div>
  );
};

export default ObjavaOtvoreno;