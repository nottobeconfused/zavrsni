import axios from 'axios';
import React, { useState } from 'react'

export default function Odgovor(item) {

     const [odgovorDatoteke, setOdgovorDatoteke] = useState()

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

  return (
     <>
     
         <div className=" korisnik komentar" key={item._id}>
           <div className='kom-info'>
             <div>
             <i>{item.file}</i>
             <p>{new Date(item.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
             </div>
             <div className='btn-file'>
             <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(item._id)}>Preuzmi</button>
             </div>
           </div>
           </div>
           </>
)}
