import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { invalidatecache } from "../utils/feature.js"; // Ensure this path is correct

//---------------------------------------------------creating new user
export const newUser = TryCatch(async (req, res, next) => {
    const { name, email, photo, gender, _id, dob } = req.body;

    // Check if user account already exists
    let user = await User.findById(_id);

    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
        });
    }

    // Validate required fields
    if (!_id || !name || !email || !photo || !gender || !dob) {
        return res.status(400).json({
            success: false,
            message: `Please add all the fields`,
        });
    }

    // Create new user
    user = await User.create({
        name, email, photo, gender, _id, dob: new Date(dob)
    });

    // Invalidate cache
    invalidatecache({ admin: true });

    return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
    });
});

//---------------------------------------------------get all users
export const getallUsers = TryCatch(async (req, res, next) => {
    const users = await User.find({});
    return res.status(200).json({
        success: true,
        users,
    });
});

//---------------------------------------------------get user details by id
export const getUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `Invalid user`,
        });
    } else {
        return res.status(200).json({
            success: true,
            user,
        });
    }
});

//---------------------------------------------------delete user
export const deleteUser = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({
            success: false,
            message: `User not be deleted / Invalid user`,
        });
    } else {
        await user.deleteOne();

        // Invalidate cache
        invalidatecache({ admin: true });

        return res.status(200).json({
            success: true,
            message: `User deleted successfully`,
        });
    }
});
