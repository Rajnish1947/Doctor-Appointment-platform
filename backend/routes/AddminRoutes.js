import express from "express";
import {
  AddDoctor,
  LoginAdmin,
  allDocters,
} from "../controllers/AddminControllers.js";
import { ChangeAvaility } from "../controllers/doctersControllers.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/AuthAdmin.js";
const AddminRouter = express.Router();

AddminRouter.post("/add-doctor", authAdmin, upload.single("image"), AddDoctor);
AddminRouter.post("/login", LoginAdmin);
AddminRouter.post("/all-docters", allDocters);
AddminRouter.post("/change-availability", ChangeAvaility);

export default AddminRouter;
