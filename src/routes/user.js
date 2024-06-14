import express from "express";
import { newUser, getallUsers, getUser, deleteUser } from "../controllers/user.js";
import { AdminOnly } from "../middlewares/myauth.js"



const app = express.Router();

// -------route -- /api/v1/new------
app.post("/new", newUser);

// -------route -- /api/v1/all------

app.get("/all", AdminOnly, getallUsers)

// -------route -- /api/v1/dynamic id------

app.get("/:id", getUser)

// -------route -- /api/v1/dynamic id------

app.delete("/:id", AdminOnly, deleteUser)


export default app;