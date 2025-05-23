import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AddminContext } from '../context/Addmincontext'
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const {aToken,setAtoken}=useContext(AddminContext)
    const navigate = useNavigate();

  const logout=()=>{
    aToken && setAtoken('')
    aToken && localStorage.removeItem('aToken')
    navigate('/');
  }
  
    return (
    <div  className='flex justify-between items-center px-4 sm:px-4 py-3 border-b bg-white'>
        <div className='flex items-center gap-2 text-xs'>
            <img className='w-36 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5  rounded-full border-gray-500 text-gray-600'>{aToken? 'Admin':'Docter'}</p>
        </div>
        <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full'>Logout</button>
    </div>
  )
}

export default Navbar