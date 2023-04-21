import React, { useState } from 'react';
import axios from 'axios';

const NewObjava = ({ onClose }) => {
    const [zadChecked, setZadChecked] = useState(false)
    const [objavaIme, setObjavaIme] = useState('');
    const [objavaTekst, setObjavaTekst] = useState('');
    const [objavaDatumOd, setObjavaDatumOd] = useState('');
    const [objavaDatumDo, setObjavaDatumDo] = useState('');
    const [objavaOcjena, setObjavaOcjena] = useState('');

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
    const handleObjavaOcjena = (e) => {
        setObjavaOcjena(e);
    }

    const izradi = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post(
            'http://localhost:5000/api/nova-objava',
            { naslov: objavaIme, sadrzaj: objavaTekst },
            { withCredentials: true }
          );
          const data = res.data;
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
                <input className="ob-input" type="file" name="ob-file" id="ob-file" multiple/>
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

                <div className='objava-polje ob-ocjena'>
                    <label htmlFor="ocjena">Ocjena:</label>
                    <section>
                        <p>___ / <input 
                        className="ob-input" 
                        type="number" 
                        name="ocjena" 
                        id="ocjena" 
                        min={0} 
                        max={100} 
                        defaultValue={100}
                        onChange={(e) => handleObjavaOcjena(e.target.value)} 
                        /></p>
                    </section>
                </div>
                </>
                )}


            <div className="objava-polje objava-komentari">
                <label className="ob-label" htmlFor="ob-komentar">Komentari</label>
                <textarea className="ob-input" name="ob-komentar" id="ob-komentar" cols="auto" rows="3" placeholder="Komentar..."></textarea>
            </div>

        </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="delete">Obriši</button>
            <button className="gumb-ob" id="cancel" onClick={onClose}>Cancel</button>
            <button className="gumb-ob" id="save" onClick={izradi}>Spremi</button>
        </div>

        </div>
    </div>
  );
};

export default NewObjava;