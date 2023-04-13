import { useState, useEffect } from "react";
import '../../App.css';
import ModalNovo from "./ModalNovo";
import ModalProfil from "./MofdalProfil";

const NavTop = ({user, grupa}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenP, setIsOpenP] = useState(false);

    return (
        <>
        
        <div className="nav-top">
            <div className="nav-top-elementi">
            <div className="nav-top-naziv">
                <div className="naziv-ime">
                    {grupa ? (<h3>{grupa.imeGrupe}</h3>) : (<h3>Naslovna</h3>)}
                </div>
            </div>
            <div className="nav-top-funkcije">
                <div className="funkcije">
                    <div >
                    <button onClick={() => setIsOpen(true)}
                    className="gumb-novo gumb-nav gumb"><i className="uil uil-plus-circle"></i></button>
                    <ModalNovo open={isOpen}  onClose={() => setIsOpen(false)}/>
                    </div>
                    <div className="gumb-nav">
                <div className="profil-slika dropdown-container gumb" onClick={() => setIsOpenP(true)}>
                    {user && <p>{user.korisnickoIme}</p>}
                <i className="uil uil-user-circle"></i>     
                </div>       
                <ModalProfil open={isOpenP}  onClose={() => setIsOpenP(false)}/>
                </div>
                </div>
            </div>
            </div>
        </div>
        </>
    );
}

export default NavTop;