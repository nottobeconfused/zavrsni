import { useState, useEffect } from "react";
import { Routes, Route, Link } from 'react-router-dom';
import '../../App.css';
import Naslovna from "../naslovna/Naslovna";
import { OsobniProstor } from "../osobni-prostor/OsobniProstor";
import axios from 'axios';

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
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // Get user's groups from the backend API
    axios.get('/api/groups')
      .then(res => {
        setGroups(res.data.groups);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = e => {
    setGroupName(e.target.value);
  };

  const handleAddUser = e => {
    e.preventDefault();
    const newUser = e.target.user.value;
    setUsers([...users, newUser]);
    e.target.user.value = '';
  };

  const handleCreateGroup = e => {
    e.preventDefault();
    axios.post('/api/groups', { name: groupName, users: users })
      .then(res => {
        console.log(res.data);
        setShowModal(false);
        setGroupName('');
        setUsers([]);
      })
      .catch(err => {
        console.log(err);
      });
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
        {groups.length > 0 ? (
            groups.map(group => (
                <Link className="link" to="/grupe1/:id">
                    <div key={group._id} className="gumb-nav gumb-grupe" onClick={handleClick}>
                    <i className="uil uil-polygon grupica"></i>
                    <p>{group.name}</p>
                    </div>
                </Link>
              ))
        ):(
            <button onClick={() => setShowModal(true)}>Create New Group</button>
        )}
        {showModal && (
        <div>
          <form onSubmit={handleCreateGroup}>
            <label>
              Group Name:
              <input type="text" value={groupName} onChange={handleInputChange} />
            </label>
            <label>
              Add Users:
              <ul>
                {users.map(user => (
                  <li key={user}>{user}</li>
                ))}
              </ul>
              <input type="text" name="user" />
              <button onClick={handleAddUser}>Add User</button>
            </label>
            <button type="submit">Create Group</button>
          </form>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
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