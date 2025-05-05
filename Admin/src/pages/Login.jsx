

import React, { useContext, useState } from "react";
import { AddminContext } from "../context/Addmincontext";
import axios from "axios";
import { toast } from "react-toastify";
const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAtoken, BackendUrl } = useContext(AddminContext);

  const onSubmitHander = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(BackendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
            localStorage.setItem('aToken', data.token);
          setAtoken(data.token)
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
      } else {
        console.log('login faild')
      }

    } catch (error) {}
  };

  return (
    <form onSubmit={onSubmitHander} className="min-h-[80vh] flex items-center">
      <div className=" flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ">
        <p className="text-2xl font-semibold m-auto ">
          {" "}
          <span className="text-primary">{state}</span> Login
        </p>
        <div className="w-full">
          <p className="text-gray-700 mt-2 mb-1">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border w-full rounded-full border-gray-400 p-1 mt-1"
            type="text"
            required
            name=""
            id=""
          />
        </div>
        <div className="w-full">
          <p className="text-gray-700 mt-2 mb-1">Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border w-full rounded-full border-gray-400 p-1 mt-1"
            type="password"
            required
            name=""
            id=""
          />
        </div>
        <button className="text-center bg-primary text-white w-full rounded-full py-2 mt-2 mb-5">
          {" "}
          login
        </button>
        {state === "Admin" ? (
          <p className="text-center font-semibold">
            Doctor Login ?{" "}
            <span
              className="text-primary underline cursor-pointer "
              onClick={() => setState("Doctor")}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-center font-semibold">
            Admin Login ?{" "}
            <span
              className="text-primary underline cursor-pointer"
              onClick={() => setState("Admin")}
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
