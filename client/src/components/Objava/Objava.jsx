import React from 'react'

function Objava({item}) {
  return (
    <div className="karticaZadatka">
            <div className="ikona_ime_kartica">
                  <i className="uil uil-polygon" id="uil">{item.grupa}</i>
            <p>{item.nazivZadatka}</p>
            <p>{item.admin}</p>
            </div>
            <div className="opis_kartica">
                <p>{item.tekst}</p>
            </div>
            <div className="gumbi_kartica">
                <div className="gumb_otvori gumb">Otvori</div>
                <div className="gumb_vise gumb"><i className="uil uil-ellipsis-v" id="uil"></i></div>
            </div>
        </div>
  )
}

export default Objava