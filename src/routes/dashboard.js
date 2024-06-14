import express from "express";
import { dashboardStats } from "../controllers/dashboard.js";
import { AdminOnly } from "../middlewares/myauth.js"



const app = express.Router();


app.get("/stats", AdminOnly, dashboardStats);








export default app;