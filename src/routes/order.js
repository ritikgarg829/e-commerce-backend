import express from "express";
import { newOrder, myOrder, allOrders, singleOrder, updateOrder, deleteOrder } from "../controllers/order.js";
import { AdminOnly } from "../middlewares/myauth.js"



const app = express.Router();

// -------route -- /api/v1/new------
app.post("/new", newOrder);

// -------route -- /api/v1/myorder------
app.get("/myorder", myOrder);


// -------route -- /api/v1/allorders------
app.get("/allorders", AdminOnly, allOrders);


// -------route -- /api/v1/------
app.get("/:id", singleOrder);


// -------route -- /api/v1/------
app.put("/:id", AdminOnly, updateOrder);

app.delete("/:id", AdminOnly, deleteOrder);








export default app;