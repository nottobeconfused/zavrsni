import React, { useState } from 'react';
import axios from 'axios';

const NewGroup = ({ user, setUserGroup, onClose }) => {
  const [groupName, setGroupName] = useState('');

  const createGroup = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/grupe', { imeGrupe: groupName }, { withCredentials: true });

      alert(`Grupa "${res.data.name}" kreirana!`);

      setUserGroup(res.data);
    } catch (error) {
      console.error(error);
      alert('Nismo uspjeli kreirati grupu.');
    }
  };

  return (
    <div>
      <h2>Izradi novu grupu</h2>
      <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      <button onClick={createGroup} className="gumb_otvori gumb">Izradi grupu</button>
      <button onClick={onClose} className="gumb_otvori gumb">Cancel</button>
    </div>
  );
};

export default NewGroup;
