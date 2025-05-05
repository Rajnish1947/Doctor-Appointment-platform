import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { 
    type: String, 
    default: "https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg?ga=GA1.1.900574383.1727783191&semt=ais_hybrid"
  },
  address: { type: Object, default: { line1: "", line2: "" } },
  gender: { type: String, default: "Not selected" },
  dob: { type: String, default: "Not selected" },
  phone: { type: String, default: "6209567823" },
});

// ✅ Correct Model Export
const UserModel = mongoose.model("User", userSchema);

export default UserModel;





