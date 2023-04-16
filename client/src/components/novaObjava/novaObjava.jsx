import React, { useState } from 'react';

const NewObjava = ({ onClose }) => {
    const [zadChecked, setZadChecked] = useState(false)
//   const [objavaIme, setObjavaIme] = useState('');
//   const [objavaTekst, setObjavaTekst] = useState('');
//   const [objavaDatumOd, setObjavaDatumOd] = useState('');
//   const [objavaDatumDo, setObjavaDatumDo] = useState('');

//   const izradiObjavu = async () => {
//     try {
//       const res = await axios.post('http://localhost:5000/api/nova-objava', { nazivObjave: objavaIme }, { withCredentials: true });

//       setObjavaIme(res.data);
//     } catch (error) {
//       console.error(error);
//       alert('Nismo uspjeli kreirati objavu.');
//     }
//   };

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
                <input className="ob-input" type="text" name="ob-ime" id="ob-ime" placeholder="Naziv objave" />
            </div>

            <div className="objava-polje objava-tekst">
                <label className="ob-label" htmlFor="ob-txt">Tekst objave</label>
                <textarea className="ob-input" name="ob-txt" id="ob-txt" cols="auto" rows="7" placeholder="Tekst objave..."></textarea>
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
                        <input className="ob-input" type="date" name="od" id="od" />
                    </div>
                    <div className="objava-polje">
                        <label htmlFor="do">DO datuma:</label>
                        <input className="ob-input" type="date" name="do" id="do" />
                    </div>
                </div>

                <div className='objava-polje ob-ocjena'>
                    <label htmlFor="ocjena">Ocjena:</label>
                    <section>
                        <p>___ / <input className="ob-input" type="number" name="ocjena" id="ocjena" min={0} max={100} defaultValue={100}/></p>
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
            <button className="gumb-ob" id="save">Spremi</button>
        </div>

        </div>
    </div>
  );
};

export default NewObjava;