

import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointment = () => {
  const { BackendUrl, token, userData ,getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const getUserAppointments = async () => {
    try {
      const res = await axios.post(
        `${BackendUrl}/api/user/appointments`,
        { userId: userData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log("Appointments from backend:", data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };




const cancelAppointment = async (appointmentId) => {
  try {
    console.log(appointmentId);
    const { data } = await axios.post(
      `${BackendUrl}/api/user/cancellApointment`, // (Fixed spelling from 'cancellApointment')
      { appointmentId }, // You must send the body data here
      {
        headers: { Authorization: `Bearer ${token}` }, // Authorization goes in config, not body
      }
    );

    if (data.success) {
      toast.success(data.message);
      getUserAppointments();
      getDoctorsData()
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};




  useEffect(() => {
    if (token) {
      getUserAppointments();
    } else {
      console.log("Token not found, can't fetch appointments.");
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">
        My Appointments
      </p>
  
      <div>
        {appointments.map((item) => {
          const doctor = item.doctorData || {};
          let address = { line1: "", line2: "" };
  
          // Safe parsing of stringified address
          try {
            address = JSON.parse(doctor.address);
          } catch (e) {
            console.warn("Invalid address format:", doctor.address);
          }
  
          return (
            <div
              className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-6 border-b"
              key={item._id}
            >
              <div>
                <img
                  className="w-32 bg-indigo-50"
                  src={doctor.image}
                  alt={doctor.name}
                />
              </div>
  
              <div className="flex-1 text-sm text-zinc-600">
                <p className="text-neutral-800 font-semibold">{doctor.name}</p>
                <p>{doctor.speciality}</p>
                <p className="text-zinc-600 font-medium mt-1">Address</p>
                <p className="text-xs">{address.line1}</p>
                <p className="text-xs">{address.line2}</p>
  
                <p className="mt-2 text-xs">
                  <span className="text-sm text-neutral-700 font-medium">
                    Date & Time: {item.slotDate} | {item.slotTime}
                  </span>
                </p>
              </div>
  
              <div className="flex flex-col gap-2 justify-end">
                { !item.cancalled &&  <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white rounded">
                  Pay Online
                </button>}
               
                {!item.cancalled && <button onClick={()=>cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white rounded">
                  Cancel
                </button>}
                {
                  item.cancalled && <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancel</button>
                }
                
              </div>
            </div>
          );
        })}
      </div>
    </div>

  )}

export default MyAppointment;

