import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const OdgovorOtvoreno = ({ item, user, objavaId }) => {
  const fileInputRef = useRef(null);

  const handleKomentar = (e) => {
      setOdgovorKomentar(e);
  }

  const [odgovorKomentar, setOdgovorKomentar] = useState('');
  const [odgovorDatoteke, setOdgovorDatoteke] = useState([]);
  console.log(odgovorKomentar)

  const getDatoteke = async () => {
   try{
       const res = await axios.get(`http://localhost:5000/api/odgovor-datoteke/${item.id}`,
       {userId: user._id},
            { withCredentials: true })
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
      const obrisi = async (e) => {
        try {
            await axios.post(
            `http://localhost:5000/api/odgovor-brisanje/${item.id}`,
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
      

  const izradi = async (e) => {
      e.preventDefault();
        try {
          const formData = new FormData();
          formData.append("file", fileInputRef.current.files[0]);
          formData.append("komentar", odgovorKomentar);
          const res = await axios.post(
            `http://localhost:5000/api//objava-odgovor/${objavaId}`,
            formData,
            { withCredentials: true }
          )
          const data = await res.data;
          return data;
        } catch (error) {
          console.error(error);
          alert('Nismo uspjeli kreirati objavu.');
        }
      
    };
    useEffect(() =>{
      getDatoteke().then((data) => {
           setOdgovorDatoteke(data)
         });
    }, [])

return (
   <>
          <div className="objava-polje objava-datoteke">
              <label className="ob-label" htmlFor="ob-file">Datoteke</label>
                <>
              <input className="ob-input" type="file" name="ob-file" id="ob-file" ref={fileInputRef}/>
              <div className="objava-polje objava-tekst korisnici">
            {odgovorDatoteke?.length > 0 ? (
                odgovorDatoteke?.map(item => (
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
          </div>

          <div className="objava-polje objava-komentari">
              <label className="ob-label" htmlFor="ob-komentar">Komentar uz zadaću:</label>
              <textarea className="ob-input" name="ob-komentar" id="ob-komentar" cols="auto" rows="3" placeholder="Komentar..." onChange={(e) => handleKomentar(e.target.value)} ></textarea>
          </div>

      <div className="ob-funkcije objava-gumbi">
          <button className="gumb-ob" id="delete">Obriši</button>
          <button className="gumb-ob" id="save" onClick={izradi}>Predaj zadaću</button>
      </div>
  </>
);
};

export default OdgovorOtvoreno;