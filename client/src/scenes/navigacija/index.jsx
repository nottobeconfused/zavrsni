import { useState } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import { OsobniProstor } from "../osobni-prostor/OsobniProstor";

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


      const listItems = [
        { id: 1, label: 'Item 1' },
        { id: 2, label: 'Item 2' },
      ];

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
        {listItems.map(item => (
            <Link className="link" to="/grupe1/:id">
                <div key={item.id} className="gumb-nav gumb-grupe" onClick={handleClick}>
                <i className="uil uil-polygon grupica"></i>
                <p>{item.label}</p>
                </div>
            </Link>
          ))}
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