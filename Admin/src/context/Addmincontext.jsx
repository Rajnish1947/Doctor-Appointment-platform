import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


 export const AddminContext=createContext()

 


 const AddminContextProvider=(props)=>{
    const [aToken,setAtoken]=useState(localStorage.getItem('aToken')?localStorage.getItem('aToken'):"")
    const [doctors,setDoctors]=useState([])
    
    const BackendUrl=import.meta.env.VITE_BACKEND_URL
   
   
   const getAllDoctors=async()=>{
    try {
        const {data}=await axios.post(BackendUrl+`/api/admin/all-docters`,{},{headers:aToken})
    if(data.success){
        setDoctors(data.doctors)
        console.log(data)
    }else{
        toast.error(data.message)
    }
    
    } catch (error) {
        toast.error(error.message)
    }
   }
   
//    this is for changeAvailability
 const changeAvailability=async(docId)=>{
try {
    
    const {data}=await axios.post(BackendUrl+`/api/admin/change-availability`,{docId},{headers:{aToken}})
    if(data.success){
        toast.success(data.message)
        getAllDoctors()
    } else{
        toast.error(error.message)
    }

} catch (error) {
    toast.error(error.message)
}
 }
   
   
   
    const value={
        aToken,setAtoken,
        BackendUrl,getAllDoctors,doctors ,changeAvailability
    }

    return (
        <AddminContext.Provider value={value}>
            {props.children}
        </AddminContext.Provider>
    )
 }
 export default AddminContextProvider;