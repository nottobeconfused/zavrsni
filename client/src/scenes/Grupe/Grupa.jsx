import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import NewObjava from '../../components/novaObjava/novaObjava';
import NewKorisnik from '../../components/noviKorisnik/noviKorisnik';

const Grupa = () => {

  const [ObjavaModal, setObjavaModalOpen] = useState(false);
  const [KorisnikModal, setKorisnikModelOpen] = useState(false);
  const [sortiranje, setSortiranje] = useState(false);

    const { id } = useParams();

    const [objave, setObjave] = useState([]);
    const [grupa, setGrupa] = useState();
    const [user, setUser] = useState();
    const [groups, setGroups] = useState([]);


    const sendRequest = async () => {
      const res = await axios.get('https://propuh.onrender.com/api/user', {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
      
  }
    const sendRequestGrupa = async () => {
        const res = await axios.get(`https://propuh.onrender.com/api/grupe/${id}`, {
            withCredentials: true
        }).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }
    const sendRequestGrupaObjave = async () => {
      const res = await axios.get(`https://propuh.onrender.com/api/grupe-objave/${id}`, {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }

    const refreshToken = async () => {
      const res = await axios
        .get("https://propuh.onrender.com/api/refresh", {
          withCredentials: true,
        })
        .catch((err) => console.log(err));
  
      const data = await res.data;
      return data;
    };

    function sortirajObjave(objave, setSortiranje) {
      if (setSortiranje) {
        return objave?.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      } else {
        return objave?.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      }
    }
    function handleChangeSort() {
        setSortiranje(false);
    }
    function handleGoBack() {
      setSortiranje(true);
      sortirajObjave(objave, setSortiranje)
    }
  
  
      useEffect(() => {
        sendRequest().then((data) => {
            setUser(data.user)
            setGroups(data.user.grupe);
            
          });

          sendRequestGrupaObjave().then((data) => {
            setObjave(data)
          });
          
          sendRequestGrupa().then((data) => {
            setGrupa(data);
          });
          
          let interval = setInterval(() => {
            refreshToken().then((data) => {
              setGroups(data.user.grupe);
              setUser(data.user)
            });
            sendRequestGrupa().then((data) => {
              setGrupa(data)
            })
            sendRequestGrupaObjave().then((data) => {
              setObjave(data)
            });
          }, 1000 * 60 * 60);
    
          return () => clearInterval(interval)
          
      }, []);
      return (
          <>
          <Navigacija grupe={groups} user={user}/>
          <NavTop user={user} grupa={grupa} setObjavaModalOpen={() => setObjavaModalOpen(true)} setKorisnikModelOpen={() => setKorisnikModelOpen(true)} onClose={() => setObjavaModalOpen(false)}/>
          
          {ObjavaModal && (<NewObjava id={id} onClose={() => setObjavaModalOpen(false)} grupa={grupa} user={user}/>)}
          {KorisnikModal && (<NewKorisnik id={id} onClose={() => setKorisnikModelOpen(false)} grupa={grupa} user={user}/>)}
          <div className="main">
    <div className='odabir-objave'>
    <div className="ob-funkcije ob-zad">
      <div className="odabir radio">
        <input
          className="radio_input"
          onClick={() => handleChangeSort()}
          defaultChecked
          type="radio"
          name="ob-zad"
          id="ob"
        />
        <label className="radio_label" htmlFor="ob">
          najstarije
        </label>
        <input
          className="radio_input"
          onClick={() => handleGoBack()}
          type="radio"
          name="ob-zad"
          id="zad"
        />
        <label className="radio_label" htmlFor="zad">
          najnovije
        </label>
      </div>
    </div>
  </div>
  
  {objave?.length > 0 ? (
    sortirajObjave(objave, sortiranje)?.map(item => (
      <Objava item={item} key={item._id} user={user} grupa={grupa} edit={true}/>
    ))
  ) : (
    <div className="karticaZadatka">
      <div className="ikona_ime_kartica">
        <i className="uil uil-polygon" id="uil">
          Još nemate objava!
        </i>
        <p></p>
      </div>
    </div>
  )}
</div>
          </>
      )
  }
  
  export default Grupa;