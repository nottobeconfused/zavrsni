import { useState, useEffect } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import { OsobniProstor } from "../osobni-prostor/OsobniProstor";
import axios from 'axios';
import NewGroup from "../../components/novaGrupa/novaGrupa";
axios.defaults.withCredentials = true;
const Navigacija = () => {
    const [isGrupeOpen, setIsGrupeOpen] = useState(false);

    const toggleGrupe = () => {
        setIsGrupeOpen(!isGrupeOpen);
      }
      const handleClick = () => {
        setIsGrupeOpen(false);
      }

      const [activeItem, setActiveItem] = useState("naslovna");

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

const [user, setUser] = useState();
const [groups, setGroups] = useState([]);

const sendRequest = async () => {
  const res = await axios.get('http://localhost:5000/api/user', {
    withCredentials: true
  }).catch((err) => console.log(err));
  const data = await res.data;
  return data;
}

useEffect(() => {
  sendRequest().then((data) => {
    setUser(data.user);
    setGroups(data.user.grupe);
  });
}, []);
  const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        <header>
        <nav>
            
                <div className={activeItem === "naslovna" ? "otvoreno" : ""} onClick={() => handleItemClick("naslovna")}>
                    <Link className="link" to="/user">
                        <i className="uil uil-estate"></i>
                    </Link>
                </div>
            
            
                <div className={activeItem === "osobniProstor" ? "otvoreno" : ""} onClick={() => handleItemClick("osobniProstor")}>
                    <Link className="link" to="/osobni-prostor/:id">
                        <i className="uil uil-user"></i>
                    </Link>
                </div>
            
            
                <div className="gumb-nav gumb" onClick={toggleGrupe}>
                        <i className="uil uil-cell"></i>
                </div>

        </nav>
    </header>
    {isGrupeOpen && (
    <div className="grupice">
      {groups.map(group => (
                <Link className="link" to="/grupe/:id" key={group.id}>
                    <div  className="gumb-nav gumb-grupe" onClick={handleClick}>
                    <i className="uil uil-polygon grupica"></i>
                    <p>{group.imeGrupe}</p>
                    </div>
                </Link>
              ))}
        {isOpen && (
        <NewGroup user={user} onClose={() => setIsOpen(false)}></NewGroup>
      )}
      <button onClick={() => setIsOpen(true)} className="gumb_otvori gumb">Create New Group</button>
    </div>
    )};
    <Routes>
        <Route path="/user" element={<Naslovna />} />
        <Route path="/osobni-prostor/:id" element={<OsobniProstor />} />
    </Routes>
        </>
    );
}

export default Navigacija;