import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const OdgovorOtvoreno = ({ objavaId, user }) => {
    const [odgovorKomentar, setOdgovorKomentar] = useState('');
    const [odgovorDatoteke, setOdgovorDatoteke] = useState([]);
    const fileInputRef = useRef(null);

    const handleKomentar = (e) => {
        setOdgovorKomentar(e);
    }

    const getDatoteke = async () => {
     try{
         const res = await axios.get(`http://localhost:5000/api/odgovor-datoteke/${objavaId}`,
         {userId: user.id},
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

        useEffect(() =>{
          getDatoteke().then((data) => {
               setOdgovorDatoteke(data)
             });
        })

  return (
     <>
            <div className="objava-polje objava-tekst korisnici">
              {odgovorDatoteke?.length > 0 ? (
                  odgovorDatoteke?.map(item => (
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

            <div className="objava-polje objava-komentari">
                <label className="ob-label" htmlFor="ob-komentar">Komentar uz zadaću:</label>
                <textarea className="ob-input" name="ob-komentar" id="ob-komentar" cols="auto" rows="3" placeholder="Komentar..." onChange={(e) => handleKomentar(e.target.value)} ></textarea>
            </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="delete">Obriši</button>
        </div>
    </>
  );
};

export default OdgovorOtvoreno;