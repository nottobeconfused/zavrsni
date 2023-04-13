import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

const Grupa = () => {

    const { id } = useParams();

    const [objave, setObjave] = useState(null);
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
        console.log(data)
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
            setGrupa(data.grupa)
          })
          sendRequest().then((data) => {
            setUser(data.user)
            setGroups(data.user.grupe);
            setObjave(data.user.objave)
          });

          let interval = setInterval(() => {
            refreshToken().then((data) => {
              setUser(data.user)
            });
            sendRequestGrupa().then((data) => {
              setGrupa(data.grupa)
              setObjave(data.grupa.objave)
            })
          }, 1000 * 29);
    
          return () => clearInterval(interval);
      }, []);
  
  
  
      
    const Objave = [{...objave}];
      return (
          <>
          <Navigacija grupe={groups} user={user}/>
          <NavTop user={user} grupa={grupa}/>
          {console.log(grupa)}
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