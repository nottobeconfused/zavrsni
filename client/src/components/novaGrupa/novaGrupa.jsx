import React, { useState } from 'react';
import axios from 'axios';

const NewGroup = ({ onClose }) => {
  const [groupName, setGroupName] = useState('');

  const createGroup = async () => {
    try {
      const res = await axios.post('https://propuh-m6q1.onrender.com/api/nova-grupa', { imeGrupe: groupName }, { withCredentials: true });

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
      <input type="text" placeholder="Group Name" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      <button onClick={createGroup} className="gumb_otvori gumb">Izradi grupu</button>
      <button onClick={onClose} className="gumb_otvori gumb">Cancel</button>
    </div>
  );
};

export default NewGroup;
