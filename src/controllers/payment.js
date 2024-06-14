import { TryCatch } from "../middlewares/error.js";
import { Coupon } from "../models/coupon.js"
import { stripe } from "../app.js";

// -----------------------create payment using Stripe---------------------------------------

export const createPaymentIntent = TryCatch(async (req, res) => {
    const { amount, description, customerDetails } = req.body;

    if (!amount) {
        return res.status(401).json({
            success: false,
            message: "Please enter amount",
        });
    }

    if (!description || !customerDetails) {
        return res.status(401).json({
            success: false,
            message: "Please provide description and customer details",
        });
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(amount) * 100,
        currency: "inr",
        description,
        shipping: {
            name: customerDetails.name,
            address: {
                line1: customerDetails.address.line1,
                city: customerDetails.address.city,
                state: customerDetails.address.state,
                postal_code: customerDetails.address.postal_code,
                country: customerDetails.address.country,
            },
        },
        metadata: {
            order_id: `order_${Date.now()}`, // Example metadata
            customer_name: customerDetails.name,
            customer_email: customerDetails.email
        }
    });

    return res.status(201).json({
        success: true,
        clientSecret: paymentIntent.client_secret
    });
});






// -----------------------coupons---------------------------------------

export const newCoupon = TryCatch(async (req, res) => {


    const { coupon, amount } = req.body;

    if (!coupon || !amount)
        return res.status(401).json({
            success: false,
            message: `Please enter coupon and amount fields`,
        })


    await Coupon.create({ coupon, amount })

    return res.status(201).json({
        success: true,
        message: `Coupon ${coupon} created successfully`,
    })



})



export const applyDiscount = TryCatch(async (req, res) => {


    const { coupon } = req.query;

    const discount = await Coupon.findOne({ coupon });

    if (!discount)
        return res.status(401).json({
            success: false,
            message: `invalid coupon code`,
        })

    return res.status(201).json({
        success: true,
        discount: discount.amount
    })



})

export const allCoupon = TryCatch(async (req, res) => {

    const discount = await Coupon.find();

    if (!discount)
        return res.status(401).json({
            success: false,
            message: `Coupon not avail`,
        })

    return res.status(201).json({
        success: true,
        discount,
    })



})


export const deleteCoupon = TryCatch(async (req, res) => {

    const { id } = req.params;

    const findcoupon = await Coupon.findById(id);

    if (!findcoupon)
        return res.status(401).json({
            success: false,
            message: `Coupon not found`,
        })



    await findcoupon.deleteOne();

    return res.status(201).json({
        success: true,
        message: `Coupon deleted successfully`,
    })



})