
import React from 'react';
import { Routes, Route, useLocation  } from 'react-router-dom';
import SignUp from './Pages/Signup';



import LoginPage from './Pages/LoginPage';

import Logout from "./components/Logout" 

import Employee from "./Pages/EmployeePage"

import Update from './components/Update';

import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const location = useLocation();
  const adminPage = location.pathname === '/admin'; 
  return (
    <>
   
      <Routes>
      <Route path="/" element={<SignUp />} />
      <Route path="/login" element={<LoginPage />} />
        
        <Route path="/logout" element={<Logout />} />
        <Route path="/Employee" element={<Employee />} />
     
        <Route path="/update" element={<Update />} />
    </Routes>
 
    </>
  );
};

export default App;