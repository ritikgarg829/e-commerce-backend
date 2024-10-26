import express from "express";
import { connectDB } from "./utils/feature.js"
import { ErrorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache"
import Stripe from "stripe";
import Cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";

// ----------------user Routes---------------------
import userRoute from "./routes/user.js"
import productsRoutes from "./routes/products.js"
import orderRoutes from "./routes/order.js"
import paymentRoutes from "./routes/payment.js"
import adminDashboardRoutes from "./routes/dashboard.js"

// -----------------------------------------
config({
    path: "./.env",
});


const port = process.env.PORT || 1234;
const mongouri = process.env.MONGO_URI || "";
const stripekey = process.env.STRIPE_KEY || "";
connectDB(mongouri);

// -----------------------------------------
export const stripe = new Stripe(stripekey)

export const myCache = new NodeCache();

const app = express()
app.use(express.json());
app.use(morgan("dev"));
app.use(Cors());

app.get("/", (req, res) => {
    res.send("api working");
})

// -----using routes---------
app.use("/api/v1/user", userRoute); //user routes


app.use("/api/v1/product", productsRoutes); // product routes 

app.use("/api/v1/order", orderRoutes); // orders routes 

app.use("/api/v1/payment", paymentRoutes); // orders routes 

app.use("/api/v1/dashboard", adminDashboardRoutes); // orders routes 


app.use("/uploads", express.static('uploads')); // product images route folder treat as a static to access the image


app.use(ErrorMiddleware);

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
})



//MONGO_URI = mongodb://localhost:27017/Shopping for mongodb compass
