import React, { useContext, useEffect, useState } from "react";
import { data, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoc from "../components/RelatedDoc";
import { toast } from "react-toastify";
import axios from "axios";
const Appointments = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    BackendUrl,
    token,
    getDoctorsData,
    userData,
  } = useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();
  const [doctInfo, setDoctInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  // Fetch doctor information
  const fetchDocInfo = async () => {
    const foundDoctor = doctors.find((doc) => doc._id === docId);
    setDoctInfo(foundDoctor);
  };

  // Generate available appointment slots

  const getAvailableSlots = async () => {
    let today = new Date();
    let timeSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date();
      currentDate.setDate(today.getDate() + i);

      let startTime = new Date(currentDate);
      startTime.setHours(10, 0, 0, 0);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // Adjust start time for today
      if (i === 0 && today.getHours() >= 10) {
        startTime.setHours(today.getHours() + 1);
        startTime.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      }

      let dailySlots = [];
      while (startTime < endTime) {
        let formattedTime = startTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = `${year}-${month < 10 ? "0" + month : month}-${
          day < 10 ? "0" + day : day
        }`;

        // Check if the slot is already booked
        let isSlotBooked = false;

        if (Array.isArray(doctInfo.slots_booked)) {
          isSlotBooked = doctInfo.slots_booked.some(
            (slot) =>
              slot.slotDate === slotDate && slot.slotTime === formattedTime
          );
        } else if (typeof doctInfo.slots_booked === "object") {
          isSlotBooked =
            doctInfo.slots_booked?.[slotDate]?.includes(formattedTime);
        }

        // Only push if the slot is not already booked
        if (!isSlotBooked) {
          dailySlots.push({
            datetime: new Date(startTime),
            time: formattedTime,
          });
        }

        startTime.setMinutes(startTime.getMinutes() + 30);
      }

      timeSlots.push(dailySlots);
    }

    setDocSlots(timeSlots);
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (doctInfo) {
      getAvailableSlots();
    }
  }, [doctInfo]);

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[selectedSlotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;

      const appointmentPayload = {
        userId: userData._id,
        docId,
        userData: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
        },
        doctorData: {
          name: doctInfo.name,
          email: doctInfo.email,
          phone: doctInfo.phone,
          fees: doctInfo.fees,
          speciality: doctInfo.speciality,
          degree: doctInfo.degree,
          experience: doctInfo.experience,
          image: doctInfo.Image,
        },
        slotTime: selectedTime,
        slotDate,
        slots_booked: [selectedTime],
        amount: doctInfo.fees, // optional: if you want to show fee
      };

      const { data } = await axios.post(
        `${BackendUrl}/api/user/book-appointment`,
        appointmentPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/myAppoint");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const handleSlotClick = (index) => {
    setSelectedSlotIndex(index);
    setSelectedTime(docSlots[index][0].time); // Set selected time based on clicked slot
  };

  return (
    doctInfo && (
      <div>
        {/* Doctor details section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={doctInfo.Image}
              alt="Doctor"
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {doctInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="Verified" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {doctInfo.degree} - {doctInfo.speciality}
              </p>
              <button className="py-0.5 px-2 text-sm rounded-full border border-gray-300">
                {doctInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="Info" />
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {doctInfo.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                {currencySymbol} {doctInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/* Booking Slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots.map((slots, index) => (
                <div
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    selectedSlotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                  key={index}
                  onClick={() => handleSlotClick(index)} // Set the selected slot index when clicked
                >
                  <p>
                    {slots.length > 0 && daysOfWeek[slots[0].datetime.getDay()]}
                  </p>
                  <p>{slots.length > 0 && slots[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length > 0 &&
              docSlots[selectedSlotIndex].map((item, index) => {
                return (
                  <p
                    className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-2xl cursor-pointer ${
                      item.time === selectedTime
                        ? "bg-primary text-white"
                        : "text-gray-400 border border-gray-300"
                    }`}
                    key={index}
                    onClick={() => setSelectedTime(item.time)} // Set selected time when clicked
                  >
                    {item.time.toLowerCase()}
                  </p>
                );
              })}
          </div>
          <button
            onClick={bookAppointment}
            className=" bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an Appointment
          </button>
        </div>

        {/* related docter */}
        <RelatedDoc docId={docId} speciality={doctInfo.speciality} />
      </div>
    )
  );
};

export default Appointments;
