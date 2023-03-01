import React from 'react'

function Objava({item}) {
  return (
    <div className="karticaZadatka">
            <div className="ikona_ime_kartica">
                  <i className="uil uil-polygon" id="uil">{item.imeGrupe}</i>
            <p>{item.nazivZadatka}</p>
            </div>
            <div className="opis_kartica">
                <p>{item.tekst}</p>
            </div>
            <div className="gumbi_kartica">
                <div className="od">
                    <p id="od">od: {item.od}</p>
                </div>
                <div className="do">
                    <p id="do">do: {item.do}</p>
                </div>
                <div className="gumb_otvori gumb">Otvori</div>
                <div className="gumb_vise gumb"><i className="uil uil-ellipsis-v" id="uil"></i></div>
            </div>
        </div>
  )
}

export default Objava