import React from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store";

function ModalProfil({open, onClose}) {
  const dispatch = useDispatch();
  const sendLogoutRequest = async () => {
    axios.defaults.withCredentials = true
  const res = await axios.post("http://localhost:5000/api/logout", null, {
    withCredentials: true
  })
  if(res.status === 200) {
    return res;
  }
  return new Error("Unable to logout. Try again");
 }
 const handleLogout = () => {
  sendLogoutRequest().then(()=>dispatch(authActions.logout()))
 }
    if (!open) return null
    return (
      <div className='modal-profil' onClick={onClose}>
      <div className="postavke dropdown-item modal-sredina"><i className="uil uil-setting"></i><p>Postavke</p></div>
      <div className="profil dropdown-item modal-sredina"><i className="uil uil-user-circle"></i><p>Profil</p></div>
      <Link className='link' to="/login" onClick={handleLogout}>
      <div className="odjava dropdown-item modal-sredina"><i className="uil uil-sign-out-alt"></i><p>Odjava</p></div>
      </Link>
      </div>
    )
  }

  export default ModalProfil