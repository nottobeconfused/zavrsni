import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/Login";
import Signup from "./components/Signup";
import Welcome from "./components/Welcome";
import Naslovna from "./scenes/naslovna/Naslovna";
import Grupa from "./scenes/Grupe/Grupa";


function App() {

    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    console.log("Is logged in: ",isLoggedIn)


   
    return (
        <>
            <Routes>
                {isLoggedIn && <Route path="/user/*" element={<Naslovna />} />}
                {isLoggedIn && <Route path="/grupe/:id/*" element={<Grupa />} />}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Welcome />} />
                </Routes>
        </>
    );
  }
  
  export default App;
