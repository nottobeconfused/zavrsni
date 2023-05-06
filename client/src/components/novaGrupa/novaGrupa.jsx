import React, { useState } from 'react';
import axios from 'axios';

const NewGroup = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');
  const [isGrupaOpen, setTipGrupe] = useState();

  const createGroup = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/nova-grupa', { imeGrupe: groupName, tip: isGrupaOpen }, { withCredentials: true });

      alert(`Grupa "${groupName}" kreirana!`);

      setGroupName(res.data);
      setGroupName('');
    } catch (error) {
      console.error(error);
      alert('Nismo uspjeli kreirati grupu.');
    }
  };

  return (
    <div>
      <h2>Izradi novu grupu</h2>
      <div>
      <div className="ob-funkcije ob-zad">
            <div className="odabir radio">
                <input className="radio_input" onClick={() => {
                    setTipGrupe(true)
                }} defaultChecked type="radio" name="ob-zad" id="ob" />
                <label className="radio_label" htmlFor="ob" title='Samo admin može objavljivati.'>zatvorena</label>
                <input className="radio_input" onClick={() => {
                    setTipGrupe(false)
                }} type="radio" name="ob-zad" id="zad"/>
                <label className="radio_label" htmlFor="zad" title='Svi mogu objavljivati'>otvorena</label>
            </div>
        </div>
        </div>
        <div>
      <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      </div>
      <div className='gumbi-Ngrupa'>
        <button onClick={createGroup} className="gumb_otvori gumb">Izradi grupu</button>
        <button onClick={onClose} className="gumb_otvori gumb">Zatvori</button>
      </div>
      
    </div>
  );
};

export default NewGroup;
