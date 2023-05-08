import React from 'react'
import NavTop from '../nav-top'
import Navigacija from '../navigacija'
import '../../App.css';
import Objava from '../../components/Objava/Objava';
import { useEffect, useState } from "react";
import axios from "axios";


axios.defaults.withCredentials = true;
const Naslovna = () => {
  const [objave, setObjave] = useState(null);
  const [user, setUser] = useState();
  const [groups, setGroups] = useState([]);
  const [sortiranje, setSortiranje] = useState(false);
  const otvoreno = "naslovna";

  const sendRequest = async () => {
      const res = await axios.get('http://localhost:5000/api/user', {
          withCredentials: true
      }).catch((err) => console.log(err));
      const data = await res.data;
      return data;
  }
  const sentRequestGetObjave = async () => {
    const res = await axios.get('http://localhost:5000/api/objave', {
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
        sentRequestGetObjave().then((data) => {
          setObjave(data)
        })

      let interval = setInterval(() => {
        refreshToken().then((data) => {
          setUser(data.user)
          setGroups(data.user.grupe)
        });
      }, 1000 * 28 * 60 * 60);

      return () => clearInterval(interval);

    }, []);
    
    return (
        <>
        <Navigacija grupe={groups} user={user} otvoreno={otvoreno}/>
        <NavTop user={user}/>
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
      <Objava item={item} key={item.id} edit={false}/>
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

export default Naslovna;