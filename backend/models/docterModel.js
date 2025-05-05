

import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    Image: { 
      type: String, 
      required:true
    },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean,default:true },
    fees: { type: Number, required: true },
    address: { type: String, required: true },
    date: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
  },
  { minimize: false }
);

// ✅ Correct Model Export
const DoctorModel = mongoose.model("Doctor", doctorSchema);

export default DoctorModel;
