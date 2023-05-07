import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function Odgovor(item) {

     const [odgovorDatoteke, setOdgovorDatoteke] = useState()

     const getDatoteke = async () => {
      try{
          const res = await axios.get(`http://localhost:5000/api/objava-odgovor-datoteke/${item._id}`);
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
        useEffect(() => {
          getDatoteke().then((data) => {
            setOdgovorDatoteke(data)
          });
          },[]);

  return (
     <>
     {odgovorDatoteke?.length > 0 ? (
      odgovorDatoteke.map(dat => {
        <>
        <div className=" korisnik komentar" key={dat._id}>
           <div className='kom-info'>
             <div>
             <i>{dat.file}</i>
             <p>{new Date(dat.createdAt).toLocaleString([], {year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric'})}</p>
             </div>
             <div className='btn-file'>
             <button className="gumb-ob" id="save" onClick={() => downloadDatoteka(dat._id)}>Preuzmi</button>
             </div>
           </div>
           </div>
       </>
      })
     ):null}
           </>
)}
