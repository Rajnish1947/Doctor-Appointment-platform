import mongoose from "mongoose";

const appointmentShema = new mongoose.Schema({
  userId: { type: String, require: true },
  docId: { type: String, require: true },
  slotDate: { type: String, require: true },
  slotTime: { type: String, require: true },
  userData: { type: Object, require: true },
  doctorData: { type: Object, required: true }, 
  userId: { type: String, require: true },
  amount: { type: String, require: true },
  date: { type: Number, require: true },
  cancalled: { type: Boolean, require: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: String, require: true },
});

const appointmentModel =
  mongoose.model.appointment || mongoose.model("appointment", appointmentShema);

export default appointmentModel;
