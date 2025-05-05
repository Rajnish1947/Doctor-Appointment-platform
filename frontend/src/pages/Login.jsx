import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { BackendUrl, token, setToken } = useContext(AppContext);

  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      const url =
        state === "Sign Up" ? `/api/user/register` : `/api/user/login`;
      const payload =
        state === "Sign Up" ? { name, email, password } : { email, password };

      const { data } = await axios.post(`${BackendUrl}${url}`, payload);

      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(
          state === "Sign Up"
            ? "Account created successfully!"
            : "Login successful!"
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred!");
    }
  };
  return (
    <form onSubmit={onSubmit} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p>
          Please {state === "Sign Up" ? "Sign to" : "Login to"} book appointment
        </p>
        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 rounded w-full p-2 mt-1"
              type="text"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1 bg-white"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1 bg-white"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="bg-primary text-white p-2 w-full rounded-md mt-1"
          >
            {state === "Sign Up" ? "Create Account" : "Login"}
          </button>
        </div>
        <p className="mt-1 ">
          <span>
            {state === "Sign Up" ? (
              <p>
                Already have an account?{" "}
                <span
                  onClick={() => setState("Login")}
                  className="text-blue-500 underline cursor-pointer "
                >
                  Login here
                </span>{" "}
              </p>
            ) : (
              <p>
                Create account ?{" "}
                <span
                  onClick={() => setState("Sign Up")}
                  className="text-blue-500 underline cursor-pointer "
                >
                  click here
                </span>
              </p>
            )}
          </span>{" "}
        </p>
      </div>
    </form>
  );
};

export default Login;
