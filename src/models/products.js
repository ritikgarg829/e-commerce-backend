import mongoose from "mongoose";



const schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please Enter name"],
        },

        photo: {
            type: String,
            required: [true, "Please Enter photo"],
        },

        price: {
            type: Number,
            required: [true, "Please Enter price"],
        },

        stock: {
            type: Number,
            required: [true, "Please Enter Stock"],
        },

        category: {
            type: String,
            required: [true, "Please Enter product category"],
            trim: true,
        },

    },

    {
        timestamps: true
    }


);



export const Product = mongoose.model("Product", schema);

