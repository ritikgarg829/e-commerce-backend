// coupon and payment routes are here ---------
import express from 'express';
import { AdminOnly } from '../middlewares/myauth.js';
import { newCoupon, applyDiscount, allCoupon, deleteCoupon, createPaymentIntent } from "../controllers/payment.js"
const app = express.Router();
// --create coupon-------
app.post('/coupon/new', AdminOnly, newCoupon);

// -----get or apply coupon---
app.get('/discount', applyDiscount);

// -----get allcoupon---
app.get('/all/coupon', AdminOnly, allCoupon);

// -----get allcoupon---
app.delete('/delete/coupon/:id', AdminOnly, deleteCoupon);



// -------------------------------------payment routes-----------------------------------------------

app.post('/create', createPaymentIntent);



export default app;