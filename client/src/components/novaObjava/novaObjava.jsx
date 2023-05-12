import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const NewObjava = ({ onClose, id, grupa, user }) => {
    const [zadChecked, setZadChecked] = useState(false)
    const [objavaIme, setObjavaIme] = useState('');
    const [objavaTekst, setObjavaTekst] = useState('');
    const [objavaDatumOd, setObjavaDatumOd] = useState('');
    const [objavaDatumDo, setObjavaDatumDo] = useState('');
    const fileInputRef = useRef(null);

    const [ifAdmin, setIfAdmin] = useState();

    const [animationStatus, setAnimationStatus] = useState("initial");

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


    const izradi = async (e) => {
        e.preventDefault();
          try {
            const formData = new FormData();
            formData.append("file", fileInputRef.current.files[0]);
            formData.append("naslov", objavaIme);
            formData.append("sadrzaj", objavaTekst);
            formData.append("OD", objavaDatumOd);
            formData.append("DO", objavaDatumDo);
            formData.append("ifZadatak", zadChecked)
            const res = await axios.post(
              `http://localhost:5000/api/${id}/nova-objava`,
              formData,
              { withCredentials: true }
            )
            const data = await res.data;
            setAnimationStatus("success");
            return data;
          } catch (error) {
            console.error(error);
            alert('Nismo uspjeli kreirati objavu.');
          }
        
      };
      useEffect(() => {
        if (grupa.admin === user._id) {
            setIfAdmin(true);
          } else {
            setIfAdmin(false);
          }
      }, [] )
  return (
    <>
    {ifAdmin && (
    <div className="novaObjavaBackground">
        
        <div className='ob-modal'>
            <div className="ob-funkcije ob-zad">
            <div className="odabir radio">
                <input className="radio_input" onClick={() => {
                    setZadChecked(false)
                }} defaultChecked type="radio" name="ob-zad" id="ob" />
                <label className="radio_label" htmlFor="ob">objava</label>
                <input className="radio_input" onClick={() => {
                    setZadChecked(true)
                }} type="radio" name="ob-zad" id="zad"/>
                <label className="radio_label" htmlFor="zad">zadatak</label>
            </div>
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
                onChange={(e) => handleTekst(e.target.value)} 
                />
            </div>

            <div className="objava-polje objava-datoteke">
                <label className="ob-label" htmlFor="ob-file">Datoteke</label>
                <input type='file' ref={fileInputRef}></input>
            </div>

                {zadChecked && (
                    <>
                <div className='objava-oddo'>
                    <div className="objava-polje">
                        <label htmlFor="od">OD datuma:</label>
                        <input 
                        className="ob-input" 
                        type="date" 
                        name="od" 
                        id="od" 
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
                        onChange={(e) => handleDatumDo(e.target.value)} 
                        />
                    </div>
                </div>
                </>
                )}

        </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="delete" onClick={onClose}>Obriši</button>
            <button className="gumb-ob" id="cancel" onClick={onClose}>Zatvori</button>
            {ifAdmin && (<button className="gumb-ob" id="save" onClick={izradi}>
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

  )}
  </>
  );
};

export default NewObjava;