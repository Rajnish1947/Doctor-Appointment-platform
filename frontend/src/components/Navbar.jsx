import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const Navbar = () => {
  // jab kisi page ko redirect click karne pe karna hota hai to navgate hook use karte hai

  const navigate = useNavigate();
  // that is for set and however func
  // that is for mobile value

  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer "
        src={assets.logo}
        alt="logo"
      />

      <ul className="hidden md:flex items-start gap-5 font-medium">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/docters">
          <li className="py-1">ALL DOCTORS</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr className="border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {/* that is ternary for display the login and logout situation */}

        {token ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img src={userData.image} alt="prl" className="w-8 rounded-full" />
            <img src={assets.dropdown_icon} alt="drop" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-40 bg-stone-100 round flex flex-col gap-4 p-4">
                <p
                  onClick={() => navigate("myprofile")}
                  className="hover:text-black  cursor-pointer "
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("myAppoint")}
                  className="hover:text-black cursor-pointer "
                >
                  My Apointment
                </p>
                <p
                  onClick={logout}
                  className="hover:text-black cursor-pointer "
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="bg-primary text-white px-8 py-3 rounded-full font-light md:block"
            onClick={() => navigate("/Login")}
          >
            Create account
          </button>
        )}
        {/* that is make side bar */}

        <img
          onClick={() => setShowMenu(true)}
          className="w-26 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="menu"
        />

        {/* Sidebar for mobile */}
        <div
          className={`fixed top-0 right-0 bottom-0 z-20 w-64 bg-white shadow-lg transition-transform duration-300 ${
            showMenu ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <img className="w-24" src={assets.logo} alt="Logo" />
            <img
              onClick={() => setShowMenu(false)}
              className="w-8 cursor-pointer"
              src={assets.cross_icon}
              alt="Close"
            />
          </div>

          <ul className="p-4 space-y-4 text-lg">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className="block"
            >
              <p>HOME</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/docters"
              className="block"
            >
              <p>ALL DOCTORS</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className="block"
            >
              {" "}
              <p>ABOUT</p>
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className="block"
            >
              <p>CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
