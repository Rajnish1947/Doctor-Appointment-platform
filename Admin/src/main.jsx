import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AddminContextProvider from "./context/Addmincontext.jsx";
import DoctorContextProvider from "./context/DocterContext.jsx";
import AppContextProvider from "./context/Appcontext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AddminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AddminContextProvider>
  </BrowserRouter>
);
