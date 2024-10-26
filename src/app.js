import express from "express";
import { connectDB } from "./utils/feature.js";
import { ErrorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import Stripe from "stripe";
import Cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";

// ----------------user Routes---------------------
import userRoute from "./routes/user.js";
import productsRoutes from "./routes/products.js";
import orderRoutes from "./routes/order.js";
import paymentRoutes from "./routes/payment.js";
import adminDashboardRoutes from "./routes/dashboard.js";

// -----------------------------------------
config({
    path: "./.env",
});

const port = process.env.PORT || 1234;
const mongouri = process.env.MONGO_URI || "";
const stripekey = process.env.STRIPE_KEY || "";
connectDB(mongouri);

// -----------------------------------------
export const stripe = new Stripe(stripekey);
export const myCache = new NodeCache();

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// CORS Configuration
app.use(Cors({
    origin: '*', // Your Netlify site URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.get("/", (req, res) => {
    res.send("API is working");
});

// -----using routes---------
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productsRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/dashboard", adminDashboardRoutes);

app.use("/uploads", express.static('uploads')); // Static files for product images

app.use(ErrorMiddleware);

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});


//MONGO_URI = mongodb://localhost:27017/Shopping for mongodb compass
