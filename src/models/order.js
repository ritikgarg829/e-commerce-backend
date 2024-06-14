import mongoose from "mongoose";
import { Product } from "./products.js";


const schema = new mongoose.Schema(
    {
        shippingInfo: {
            address: {
                type: String,
                required: [true, "Please Enter address"],
            },

            city: {
                type: String,
                required: [true, "Please Enter city"],
            },

            state: {
                type: String,
                required: [true, "Please Enter state"],
            },

            country: {
                type: String,
                required: [true, "Please Enter country "],
            },

            pincode: {
                type: Number,
                required: [true, "Please Enter pin code"],

            },
        },


        user: {
            type: String,
            ref: "User",
            required: true,
        },

        subtotal: {
            type: Number,
            required: [true, "Please Enter subtotal"],

        },

        tax: {
            type: Number,
            required: [true, "Please tax"],

        },

        shippingCharges: {
            type: Number,
            required: [true, "Please Enter shipping charges"],

        },

        discount: {
            type: Number,
            required: [true, "Please Enter discount"],

        },

        total: {
            type: Number,
            required: [true, "Please Enter total"],

        },

        status: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered"],
            default: "Processing"

        },


        orderItems: [{
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Product",
            },

        }],

    },

    {
        timestamps: true
    }


);



export const Order = mongoose.model("Order", schema);

