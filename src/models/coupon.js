import mongoose from "mongoose";

const schema = new mongoose.Schema({


    coupon: {
        type: String,
        required: [true, 'please enter a coupon'],
        unique: true,
    },

    amount: {
        type: Number,
        required: [true, `Please enter the discount amount`],

    },

})


export const Coupon = mongoose.model("Coupon", schema);