import { useState, useEffect } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import { OsobniProstor } from "../osobni-prostor/OsobniProstor";
import axios from 'axios';
import NewGroup from "../../components/novaGrupa/novaGrupa";

const Navigacija = () => {
    const [isGrupeOpen, setIsGrupeOpen] = useState(false);
    const [user, setUser] = useState();

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
  const [groups, setGroups] = useState([]);
  const sendRequest = async () => {
    const res = await axios.get('http://localhost:5000/api/user', {
        withCredentials: true
    }).catch((err) => console.log(err));
    const data = await res.data;
    return data;
}

  useEffect(() => {
    // Get user's groups from the backend API
    sendRequest().then((data) => setUser(data.user));
    axios.get('http://localhost:5000/api/grupe')
      .then(res => {
        setGroups(res.data.groups);
      })
      .catch(err => {
        console.log(err);
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
        {groups?.length > 0 ? (
            groups.map(group => (
                <Link className="link" to="/grupe1/:id">
                    <div key={group._id} className="gumb-nav gumb-grupe" onClick={handleClick}>
                    <i className="uil uil-polygon grupica"></i>
                    <p>{group.name}</p>
                    </div>
                </Link>
              ))
        ):(
            <button onClick={() => setIsOpen(true)} className="gumb_otvori gumb">Create New Group</button>
        )}
        {isOpen && (
        <NewGroup user={user} onClose={() => setIsOpen(false)}></NewGroup>
      )}
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