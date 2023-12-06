import Home from "./Componets/Home";
import Registration from "./Componets/Registration";
import Navbar from "./Componets/Navbar";
import Login from "./Componets/Login";
import Footer from "./Componets/Footer";
import UserDashboard from "./Componets/UserDashboard";


import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
function App() {
  return (
    <>
      <Router>
    <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/registration" element={<Registration/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/user" element={<UserDashboard/>}></Route>
        </Routes>
    <Footer/>
      </Router>
  
    </>
  );
}

export default App;
