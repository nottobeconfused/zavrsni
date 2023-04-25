import React, { useState } from 'react'
import NewObjava from '../novaObjava/novaObjava';
import ObjavaOtvoreno from './ObjavaOtvoreno';

function Objava({item}) {
  const [isObjavaOpen, setIsObjavaOpen] = useState(false);
  return (
    <>
    <div className="karticaZadatka">
            <div className="ikona_ime_kartica">
                  <i className="uil uil-polygon" id="uil">{item.grupa}</i>
            <p>{item.nazivObjave}</p>
            </div>
            <div className="opis_kartica">
                <p>{item.tekst}</p>
            </div>
            <div className="gumbi_kartica">
            <div className="od">
                <p id="od">{new Date(item.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
            </div>
                <div className="gumb_otvori gumb" onClick={() => setIsObjavaOpen(true)}>Otvori</div>
                <div className="gumb_vise gumb"><i className="uil uil-ellipsis-v" id="uil"></i></div>
            </div>
        </div>
        {isObjavaOpen && (
          <ObjavaOtvoreno onClose={() => setIsObjavaOpen(false)} objavaId={item._id} naziv={item.nazivObjave} tekst={item.tekst} grupaId={item.grupaId}/> 
        )}
    </>
  )
}

export default Objava