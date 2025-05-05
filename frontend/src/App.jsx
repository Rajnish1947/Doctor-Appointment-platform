import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Docters from "./pages/Docters";
import Login from "./pages/Login";
import MyAppointment from "./pages/MyAppointment"; // Keep only this import
import Myprofile from "./pages/Myprofile";
import Navbar from "./components/Navbar";
import Appointments from "./pages/Appointments";
import Footer from "./components/Footer";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/docters" element={<Docters />} />
        <Route path="/docters/:speciality" element={<Docters />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myAppoint" element={<MyAppointment />} />
        <Route path="/myprofile" element={<Myprofile />} />
        <Route path="/appointment/:docId" element={<Appointments />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
