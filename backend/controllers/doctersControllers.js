import DoctorModel from "../models/docterModel.js";

const ChangeAvaility = async (req, res) => {
  try {
    const { docId } = req.body;
    const DocData = await DoctorModel.findById(docId);

    if (!DocData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await DoctorModel.findByIdAndUpdate(docId, { available: !DocData.available });

    res.json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 
const doctorList = async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}).select(["-password", "-email"]);
    
    res.json({ success: true, doctors }); 
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: error.message }); 
  }
};


export { ChangeAvaility ,doctorList };


