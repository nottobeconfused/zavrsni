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

    const [objave, setObjave] = useState(null);
    const [grupa, setGrupa] = useState();
    const [user, setUser] = useState();
    const [groups, setGroups] = useState([]);

    const sendRequest = async () => {
      const res = await axios.get('https://propuh-m6q1.onrender.com/api/user', {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }
    const sendRequestGrupa = async () => {
        const res = await axios.get(`https://propuh-m6q1.onrender.com/api/grupe/${id}`, {
            withCredentials: true
        }).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }

    const refreshToken = async () => {
      const res = await axios
        .get("https://propuh-m6q1.onrender.com/api/refresh", {
          withCredentials: true,
        })
        .catch((err) => console.log(err));
  
      const data = await res.data;
      return data;
    };
  
  
      useEffect(() => {
  
          sendRequestGrupa().then((data) => {
            setGrupa(data)
          });
          sendRequest().then((data) => {
            setUser(data.user)
            setGroups(data.user.grupe);
            setObjave(data.user.objave)
          });

          let interval = setInterval(() => {
            refreshToken().then((data) => {
              setGroups(data.user.grupe);
              setObjave(data.user.objave)
              setUser(data.user)
            });
            sendRequestGrupa().then((data) => {
              setGrupa(data)
            })
          }, 1000 * 29);
    
          return () => clearInterval(interval);// eslint-disable-next-line
      }, []);
  
  
      
    const Objave = [{...objave}];
      return (
          <>
          <Navigacija grupe={groups} user={user}/>
          <NavTop user={user} grupa={grupa} setObjavaModalOpen={() => setObjavaModalOpen(true)} onClose={() => setObjavaModalOpen(false)}/>
          {ObjavaModal && (<NewObjava onClose={() => setObjavaModalOpen(false)}/>)}
          <div className="main">
          {Objave?.lenght > 0 ? (
            Objave.map(item => (
              <Objava item={item}/>
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