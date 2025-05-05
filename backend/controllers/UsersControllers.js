import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/UserModel.js";
import appointmentModel from "../models/AppointmentModel.js";
import DoctorModel from "../models/docterModel.js";
import razorpay from 'razorpay'
// User Registration API
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password must be at least 8 characters long",
        });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// User Login API
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get User Profile API
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Extracted from auth middleware

    const userData = await userModel.findById(userId).select("-password");
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, userData });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file; // This is from multer

    const userId = req.user.id; // Extracted from auth middleware

    if (!name || !phone || !address || !dob || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    let updateData = { name, phone, address, dob, gender };

    if (imageFile) {
      // Upload from memory buffer
      const imageUpload = await cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            return res
              .status(500)
              .json({ success: false, message: "Image upload failed" });
          }

          updateData.image = result.secure_url;
          updateUser();
        }
      );

      imageUpload.end(imageFile.buffer);
    } else {
      updateUser();
    }

    async function updateUser() {
      const updatedUser = await userModel
        .findByIdAndUpdate(userId, updateData, { new: true })
        .select("-password");

      if (!updatedUser) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Profile updated successfully",
          user: updatedUser,
        });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




const BookAppointment = async (req, res) => {
  try {
    const { userId, docId, userData, slotTime, slotDate, isCompleted = "false" } = req.body;

    // Basic validation
    if (!userId || !docId || !userData || !slotTime || !slotDate) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch doctor data
    const docData = await DoctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Extract required doctor info
    const doctorData = {
      _id: docData._id,
      name: docData.name,
      email: docData.email,
      speciality: docData.speciality, // corrected from specialization
      experience: docData.experience,
      phone: docData.phone,
      image: docData.Image,
      address: docData.address, // corrected from location
      fees: docData.fees,
    };

    // Prepare appointment data
    const appointmentData = {
      userId,
      docId,
      userData,
      doctorData,
      amount: docData.fees,
      slotTime,
      slotDate,
      cancalled:false,
      date: Date.now(),
      isCompleted,
    };

    // Save appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Add to doctor's booked slots


    const updatedSlots = Array.isArray(docData.slots_booked)
    ? [...docData.slots_booked, { slotDate, slotTime }]
    : [{ slotDate, slotTime }];
  

    await DoctorModel.findByIdAndUpdate(docId, { slots_booked: updatedSlots });

    res.json({ success: true, message: "Appointment Booked" });

  } catch (error) {
    console.error("Booking appointment error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



const ListAppointment=async (req,res)=>{

try{
const {userId}=req.body
const appointments=await appointmentModel.find({userId})
res.json ({success:true,appointments})
}
catch (error){
res.json({success:false,message:error.message})
}

}


const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const userId = req.user.id; // ✅ Use from token, not body

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    // verify appointment user
    if (appointmentData.userId.toString() !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancalled: true });

    console.log("Appointment cancelled flag updated ✅");
    
    //releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;
    const doctorData = await DoctorModel.findById(docId);

    if (doctorData?.slots_booked?.[slotDate]) {
      doctorData.slots_booked[slotDate] = doctorData.slots_booked[slotDate].filter(
        (e) => e !== slotTime
      );
    }

    await DoctorModel.findByIdAndUpdate(docId, {
      slots_booked: doctorData.slots_booked,
    });

    res.json({ success: true, message: "Appointment cancelled successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};





export { registerUser, loginUser, getProfile, updateProfile,BookAppointment ,ListAppointment ,cancelAppointment};
