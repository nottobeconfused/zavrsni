import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import NewObjava from '../../components/novaObjava/novaObjava';

const Grupa = () => {

  const [ObjavaModal, setObjavaModalOpen] = useState(false);

    const { id } = useParams();

    const [objave, setObjave] = useState([]);
    const [grupa, setGrupa] = useState();
    const [user, setUser] = useState();
    const [groups, setGroups] = useState([]);

    const sendRequest = async () => {
      const res = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
      
  }
    const sendRequestGrupa = async () => {
        const res = await axios.get(`http://localhost:5000/api/grupe/${id}`, {
            withCredentials: true
        }).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }

    const refreshToken = async () => {
      const res = await axios
        .get("http://localhost:5000/api/refresh", {
          withCredentials: true,
        })
        .catch((err) => console.log(err));
  
      const data = await res.data;
      return data;
    };
  
  
      useEffect(() => {
  
          sendRequestGrupa().then((data) => {
            setGrupa(data)
            setObjave(data.objave)
          });
          sendRequest().then((data) => {
            setUser(data.user)
            setGroups(data.user.grupe);
            
          });

          let interval = setInterval(() => {
            refreshToken().then((data) => {
              setGroups(data.user.grupe);
              setUser(data.user)
            });
            sendRequestGrupa().then((data) => {
              setGrupa(data)
              setObjave(data.objave)
            })
          }, 1000 * 28 * 60 * 60);
    
          return () => clearInterval(interval);// eslint-disable-next-line
      }, []);
      return (
          <>
          <Navigacija grupe={groups} user={user}/>
          <NavTop user={user} grupa={grupa} setObjavaModalOpen={() => setObjavaModalOpen(true)} onClose={() => setObjavaModalOpen(false)}/>
          {ObjavaModal && (<NewObjava id={id} onClose={() => setObjavaModalOpen(false)}/>)}
          <div className="main">
          {objave.length > 0 ? (
            objave.map(objava => (
              <Objava item={objava} key={objava._id}/>
            ))) : (
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