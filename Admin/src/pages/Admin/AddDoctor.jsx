import React, { useState, useEffect, useContext } from "react";
import { assets } from "../../assets/assets";
import { AddminContext } from "../../context/Addmincontext";
import { toast } from "react-toastify";
import axios from "axios";
const AddDoctor = () => {
  const [docImg, setDocImg] = useState(null);
  const [preview, setPreview] = useState(assets.upload_area);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Ensure password is a string
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { aToken, setAtoken, BackendUrl } = useContext(AddminContext);

  // Effect to update image preview
  useEffect(() => {
    if (!docImg) {
      setPreview(assets.upload_area);
      return;
    }

    const objectUrl = URL.createObjectURL(docImg);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Cleanup memory
  }, [docImg]);

  // Handle form submission
  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        toast.error("Image Not Selected");
        return;
      }

      const formData = new FormData();
      formData.append("image", docImg); // Image file
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // Debugging logs to verify what is being sent
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]); // Ensure image is properly logged
      }

      // Debugging: Log FormData values
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      console.log("Authorization Token before API call:", setAtoken);

      const { data } = await axios.post(
        BackendUrl + `/api/admin/add-doctor`,
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
     setDocImg(null)
        setName('');
        setPassword('')
        setEmail('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setFees('')
        
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting doctor details:", error);
    
      // Check if the error response exists and contains a message
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // Show backend error message
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={submitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Upload Doctor Image */}
        <div className="flex items-center gap-4 mb-8 font-semibold text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 h-16 bg-gray-100 rounded-full cursor-pointer object-cover"
              src={preview}
              alt="Doctor Preview"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2 w-full"
                type="text"
                placeholder="Enter Doctor Name"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2 w-full"
                type="email"
                autoComplete="off"
                required
                placeholder="Enter Doctor Email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2 w-full"
                type="password"
                autoComplete="off"
                required
                placeholder="Enter Password"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                className="border rounded px-3 py-2 w-full"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2 w-full"
                type="number"
                required
                placeholder="Enter Fees"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                className="border rounded px-3 py-2 w-full"
                required
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
              >
                <option value="General physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <p>Degree</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2 w-full"
                type="text"
                required
                placeholder="Enter Degree"
              />
            </div>
            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2 w-full"
                type="text"
                required
                placeholder="Address Line 1"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2 w-full"
                type="text"
                required
                placeholder="Address Line 2"
              />
            </div>
          </div>
        </div>

        {/* About Doctor */}
        <div className="flex flex-col gap-1 mt-4">
          <p>About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="border rounded px-3 py-2 w-full"
            required
            placeholder="Write about doctor..."
            rows={5}
          />
        </div>

        {/* Submit Button */}
        <button className="bg-primary py-3 px-10 mt-4 text-white rounded-full">
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
