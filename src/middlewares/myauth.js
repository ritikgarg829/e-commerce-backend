import { User } from "../models/user.js";
import { TryCatch } from "./error.js";


// --------------------------------makesure only admin can access not any users 
export const AdminOnly = TryCatch(async (req, res, next) => {
    // basically params is get id dynamically id from URl and query is /id?key=3
    const { id } = req.query;

    if (!id)

        return res.status(401).json({
            success: false,
            message: `login First`,
        });

    const user = await User.findById(id);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: `You account is not registered`,
        });
    }

    if (user.role !== "admin") {
        return res.status(401).json({
            success: false,
            message: `You account is not registered as a admin`,
        });
    }


    next();

})

