import express from 'express'
import {registerUser,loginUser,getProfile,updateProfile ,BookAppointment ,ListAppointment ,cancelAppointment} from '../controllers/UsersControllers.js'
import authUser from '../middlewares/AuthUser.js';
import multer from "multer";
const UserRoute=express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });
 UserRoute.post('/register',registerUser)
 UserRoute.post('/login',loginUser)
UserRoute.get('/get-profile',authUser,getProfile)
UserRoute.post('/update-profile',upload.single('image'),authUser,updateProfile )
UserRoute.post('/book-appointment',authUser,BookAppointment)
UserRoute.post('/appointments',authUser,ListAppointment)
UserRoute.post('/cancellApointment',authUser,cancelAppointment)
 export default UserRoute;
