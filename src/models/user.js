import mongoose from "mongoose";
import validator from "validator";

const schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, "Please Enter ID"],
        },

        photo: {
            type: String,
            required: [true, "Please Enter Photo"],
        },

        name: {
            type: String,
            required: [true, "Please Enter name"],
        },

        email: {
            type: String,
            unique: [true, "Email alrready Exist"],
            required: [true, "Please Enter email"],
            validate: validator.default.isEmail,
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },

        gender: {
            type: String,
            enum: ["Male", "Female"],
            required: [true, "Please Enter Gender"],

        },

        dob: {
            type: Date,
            required: [true, "Please Enter date of Birth"],

        },



    },

    {
        timestamps: true
    }


);

schema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age = today.getFullYear() - dob.getFullYear();
    if (today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() &&
            today.getDate() < dob.getDate())) {
        age--
    }

    return age;
})

export const User = mongoose.model("User", schema);

