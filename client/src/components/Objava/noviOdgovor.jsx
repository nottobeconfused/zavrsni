import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const NewOdgovor = ({ objavaId, user, id }) => {
    const fileInputRef = useRef(null);

    const handleKomentar = (e) => {
        setOdgovorKomentar(e);
    }

    const [odgovorKomentar, setOdgovorKomentar] = useState('');
        

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

  return (
     <>
            <div className="objava-polje objava-datoteke">
                <label className="ob-label" htmlFor="ob-file">Datoteke</label>
                <input className="ob-input" type="file" name="ob-file" id="ob-file" ref={fileInputRef}/>
            </div>

            <div className="objava-polje objava-komentari">
                <label className="ob-label" htmlFor="ob-komentar">Komentar uz zadaću:</label>
                <textarea className="ob-input" name="ob-komentar" id="ob-komentar" cols="auto" rows="3" placeholder="Komentar..." onChange={(e) => handleKomentar(e.target.value)} ></textarea>
            </div>

        <div className="ob-funkcije objava-gumbi">
            <button className="gumb-ob" id="save" onClick={izradi}>Predaj zadaću</button>
        </div>
    </>
  );
};

export default NewOdgovor;