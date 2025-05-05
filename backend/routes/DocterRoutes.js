import express from 'express'
import {doctorList} from '../controllers/doctersControllers.js'
const doctorRoutes=express.Router()
doctorRoutes.get('/list',doctorList)
 export default doctorRoutes;