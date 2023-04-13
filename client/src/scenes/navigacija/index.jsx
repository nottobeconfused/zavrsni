import { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import { OsobniProstor } from "../osobni-prostor/OsobniProstor";
import axios from 'axios';
import NewGroup from "../../components/novaGrupa/novaGrupa";
import Grupa from "../Grupe/Grupa";
axios.defaults.withCredentials = true;

const Navigacija = ({grupe, user}) => {

    const [isGrupeOpen, setIsGrupeOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

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
      {grupe.map(grupa => {
        return (
                <Link className={activeItem === "link" ? "otvoreno" : ""} onClick={() => handleItemClick("link")} to={`/grupe/${grupa.id}`} key={grupa.id}>
                    <div  className="gumb-nav gumb-grupe" onClick={handleClick}>
                    <i className="uil uil-polygon grupica"></i>
                    <p>{grupa.imeGrupe}</p>
                    </div>
                </Link>
        )
})}
        {isOpen && (
        <NewGroup user={user} onClose={() => setIsOpen(false)}></NewGroup>
      )}
      <button onClick={() => setIsOpen(true)} className="gumb_otvori gumb">Izradi novu Grupu!</button>
    </div>
    )}
    <Routes>
        <Route path="/user" element={<Naslovna />} />
        <Route path="/osobni-prostor" element={<OsobniProstor />} />
        <Route path={"/grupe/:id/*"} element={<Grupa grupe={grupe}/>}/>
    </Routes>
        </>
    )
}

export default Navigacija;