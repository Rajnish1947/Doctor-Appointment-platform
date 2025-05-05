import React, { useContext } from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import { AddminContext } from "./context/Addmincontext";

import Navbar from "./component/Navbar";
import Sidebar from "./component/Sidebar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AddDoctor from "./pages/Admin/AddDoctor";
import Allapointment from "./pages/Admin/Allapointment";
import DocterList from "./pages/Admin/DocterList";
const App = () => {
  const { aToken } = useContext(AddminContext);

  return aToken ? (
    <div className="bg-[#F8FOFD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          <Route path="/" element={<></>} />
          <Route path="/admin-dashboard" element={<Dashboard/>} />
          <Route path="/docter-list" element={<DocterList/>} />
          <Route path="/all-apointments" element={<Allapointment/>} />
          <Route path="/Add-doctor" element={<AddDoctor/>} />


         
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  );
};

export default App;
