
import mongoose from "mongoose";
const DBconnect = async () => {
   mongoose.connection.on('connected', () => {
       console.log("Database connected successfully");
   });

   mongoose.connection.on('error', (err) => {
       console.error("Error connecting to the database:", err);
   });

   try {
       await mongoose.connect(process.env.MONGO_URL);
   } catch (error) {
       console.error("Error while connecting to MongoDB:", error);
   }
};

export default DBconnect;