import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppcontextProvider = (props) => {
  const currencySymbol = "$";
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || false);
  const [userData, setUserData] = useState(false);

  // ✅ Fetch Doctors List
  const getDoctorsData = async () => {
    try {
      console.log("Fetching doctors from:", `${BackendUrl}/api/doctors/list`);
      const { data } = await axios.get(`${BackendUrl}/api/doctors/list`);
      console.log("Doctors API response:", data);

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.error || "Failed to fetch doctors.");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("An error occurred while fetching doctors.");
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, [BackendUrl]);

  // ✅ Fetch User Profile Data
  const loadUserProfileData = async () => {
    if (!token) return; // Prevent API call if token is missing

    try {
      console.log("Fetching user profile with token:", token);

      const { data } = await axios.get(`${BackendUrl}/api/user/get-profile`, {
        headers: { Authorization: `Bearer ${token}` }, // ✅ Correct Authorization Header
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message || "Failed to fetch profile.");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      if (error.response && error.response.status === 401) {
        toast.error("Session expired. Please log in again.");
        setToken(false);
        localStorage.removeItem("token");
      } else {
        toast.error("Failed to load user profile.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  // ✅ Context Values
  const value = {
    doctors,getDoctorsData,
    currencySymbol,
    BackendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppcontextProvider;
