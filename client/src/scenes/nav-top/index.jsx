import { useState, useEffect } from "react";
import '../../App.css';
import ModalNovo from "./ModalNovo";
import ModalProfil from "./MofdalProfil";
import axios from "axios";


axios.defaults.withCredentials = true;
let firstRender = true;
const NavTop = () => {
    const [user, setUser] = useState();

    const refreshToken = async () => {
        const res = await axios.get("http://localhost:5000/api/refresh", {
            withCredentials: true
        }).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }

    const sendRequest = async () => {
        const res = await axios.get('http://localhost:5000/api/user', {
            withCredentials: true
        }).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }
    useEffect(() => {
        if(firstRender) {
            firstRender = false;
            sendRequest().then((data) => setUser(data.user));
        }
        let interval = setInterval(() => {
            refreshToken().then((data)=>setUser(data.user))
        }, 1000 * 29)
        
        return () => clearInterval(interval);

    }, [])
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenP, setIsOpenP] = useState(false);

    return (
        <>
        
        <div className="nav-top">
            <div className="nav-top-elementi">
            <div className="nav-top-naziv">
                <div className="naziv-ime">
                    {user && <h3>Naslovna</h3>}
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