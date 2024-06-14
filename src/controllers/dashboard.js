import { TryCatch } from "../middlewares/error.js";
import { myCache } from "../app.js";
import { Product } from "../models/products.js";
import { Order } from "../models/order.js";
import { User } from "../models/user.js";
import { calculatepercentage } from "../utils/feature.js";
export const dashboardStats = TryCatch(async (req, res) => {

    let stats = {};

    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats"))

    else {

        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth(), -6);

        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today
        }

        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), -1),
            end: new Date(today.getFullYear(), today.getMonth(), 0)
        }


        const thisMonthProducts = Product.find({
            createdAt: {

                $gte: thisMonth.start,
                $lte: thisMonth.end,

            },
        })


        const lastMonthProducts = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,

            },
        })


        const thisMonthUsers = User.find({
            createdAt: {

                $gte: thisMonth.start,
                $lte: thisMonth.end,

            },
        })


        const lastMonthUsers = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,

            },
        })


        const thisMonthOrders = Order.find({
            createdAt: {

                $gte: thisMonth.start,
                $lte: thisMonth.end,

            },
        })


        const lastMonthOrders = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,

            },
        })


        const lastSixMonthsOrders = Order.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today

            },
        })

        const latestTransaction = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);


        const [thisMonthOrdersPromise,
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            lastMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            productCount,
            userCount,
            allorders,
            lastSixMonthUsersPromise,
            categories,
            femaleUsersCount,
            latestTransactionPromise

        ]
            = await Promise.all([thisMonthOrders,
                thisMonthProducts,
                thisMonthUsers,
                lastMonthOrders,
                lastMonthProducts,
                lastMonthUsers,
                Product.countDocuments(),
                User.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthsOrders,
                Product.distinct("category"),
                User.countDocuments({ gender: { $in: ['Female', 'female'] } }),
                latestTransaction
            ])


        const thisMonthRevenue = thisMonthOrdersPromise.reduce(
            (total, order) => total + (order.total || 0), 0
        )

        const lastMonthRevenue = lastMonthOrdersPromise.reduce(
            (total, order) => total + (order.total || 0), 0
        )

        const changePercentage = {
            revenue: calculatepercentage(thisMonthRevenue, lastMonthRevenue),
            product: calculatepercentage(thisMonthUsersPromise.length, lastMonthUsersPromise.length),
            order: calculatepercentage(thisMonthOrdersPromise.length, lastMonthOrdersPromise.length),
            user: calculatepercentage(thisMonthProductsPromise.length, lastMonthProductsPromise.length)
        }


        const Revenue = allorders.reduce(
            (total, order) => total + (order.total || 0), 0
        )

        const counts = {
            Revenue,
            user: userCount,
            product: productCount,
            order: allorders.length,
        }


        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthRevenue = new Array(6).fill(0);

        lastSixMonthUsersPromise.forEach((order) => {

            const creationdate = order.createdAt;
            const monthDiff = today.getMonth() - creationdate.getMonth();

            if (monthDiff < 6) {
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthRevenue[6 - monthDiff - 1] += order.total;
            }

        });



        const categoriesCountPromise = categories.map((category) => Product.countDocuments({ category }));

        const categoriesCount = await Promise.all(categoriesCountPromise);

        const categoryCount = [];

        categories.forEach((category, i) => {

            categoryCount.push({
                [category]: Math.round((categoriesCount[i] / productCount) * 100)
            })
        });

        const genderRatio = {
            male: userCount - femaleUsersCount,
            female: femaleUsersCount
        }

        const modifiedLatestTransaction = latestTransactionPromise.map(i => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            status: i.status,
            quantity: i.orderItems.length
        }));


        stats = {
            modifiedLatestTransaction,
            genderRatio,
            categoryCount,
            changePercentage,
            counts,
            chart: { orderMonthCounts, orderMonthRevenue }
        };

        myCache.set("admin-stats", JSON.stringify(stats));

    }

    return res.status(201).json({
        success: true,
        stats,

    })
})