import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import jwt from "jsonwebtoken";
import DoctorModel from "../models/docterModel.js"; 

// Multer Middleware Setup (Only memoryStorage for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add Doctor Controller
const AddDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const ImageFile = req.file; // Ensure file is uploaded

    // Validate Required Fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing details" });
    }

    // Validate Email
    if (!validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid email" });
    }
    // dublacte email
    const existingDoctor = await DoctorModel.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ success: false, message: "That email already exists" });
    }
    // Validate Password
    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password should be at least 6 characters",
        });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if Image Exists
    if (!ImageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // Upload Image to Cloudinary (Fix: Use uploader.upload instead of upload_stream)
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(ImageFile.buffer);
    });

    // Create Doctor Object
    const doctorData = new DoctorModel({
      name,
      email,
      Image: result.secure_url, // Cloudinary Image URL
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      date: Date.now(),
    });

    // Save Doctor to Database
    const newDoctor = new DoctorModel(doctorData);
    await newDoctor.save();

    res
      .status(201)
      .json({
        success: true,
        message: "Doctor added successfully",
        data: doctorData,
      });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// API for data Login
const LoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.Addmin_Email &&
      password === process.env.Addmin_Passwprd
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);

      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "inavalid Addmin Id Or password" });
    }
  } catch {
    console.error("Error adding doctor:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Api for gettin all docter
const allDocters = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { AddDoctor, upload, LoginAdmin, allDocters };
