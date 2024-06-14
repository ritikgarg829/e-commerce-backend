import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Order } from "../models/order.js"
import { User } from "../models/user.js";
import { invalidatecache, reduceStock } from "../utils/feature.js";


// creating new order-
export const newOrder = TryCatch(async (req, res) => {

    const { shippingInfo, orderItems, subtotal, tax, shippingCharges, discount, total } = req.body;

    const { user } = req.body;

    const finduser = await User.findById(user);

    if (!finduser) {
        return res.status(401).json({
            success: false,
            message: 'user not found or login first'
        })
    }


    const order = await Order.create({
        shippingInfo, orderItems, user, subtotal, tax, shippingCharges, discount, total
    });


    await reduceStock(orderItems);

    invalidatecache({ product: true, order: true, admin: true, userid: user, productid: order.orderItems.map(i => i.productId) })

    return res.status(201).json({
        success: true,
        message: 'order placed successfully'
    })

})

// -------------my order----------


export const myOrder = TryCatch(async (req, res) => {

    const { id: user } = req.query;
    const key = `my-orders-${user}`;

    let orders = [];



    if (myCache.has(key)) orders = JSON.parse(myCache.get(key));
    else {
        orders = await Order.find({ user });
        myCache.set(key, JSON.stringify(orders));
    }

    if (orders.length == 0) {
        return res.status(401).json({
            success: false,
            message: "no orders found"


        })
    }

    return res.status(201).json({
        success: true,
        orders,
    })

})

// get all order details by admin----------------------------


export const allOrders = TryCatch(async (req, res) => {

    const key = `all-orders`;

    let orders = []

    if (myCache.has(key)) orders = JSON.parse(myCache.get(key));
    else {
        orders = await Order.find().populate("user", "name");
        myCache.set(key, JSON.stringify(orders));
    }


    return res.status(201).json({
        success: true,
        orders,
    })


})


// get single order details 

export const singleOrder = TryCatch(async (req, res) => {

    const { id } = req.params;

    const findorder = await Order.findById(id);

    if (!findorder) {
        return res.status(401).json({
            success: false,
            message: "no orders found"

        })
    }

    const key = `orders-${id}`;

    let order = []

    if (myCache.has(key)) order = JSON.parse(myCache.get(key));
    else {
        order = await Order.findById(id).populate("user", "name");
        myCache.set(key, JSON.stringify(order));
    }


    return res.status(201).json({
        success: true,
        order,
    })
})

//update the order by admin

export const updateOrder = TryCatch(async (req, res) => {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) return res.status(401).json({
        success: false,
        message: `order not found`
    });

    switch (order.status) {
        case "Processing":
            order.status = "Shipped"

            break;
        case "Shipped":
            order.status = "Delivered"
            break;

        default:
            order.status = "Delivered"
            break;
    }

    await order.save();

    invalidatecache({ product: false, order: true, admin: true, userid: order.user, orderid: order._id })

    return res.status(201).json({
        success: true,
        message: `order status updated`,
        order,
    })


})


// delete order by admin

export const deleteOrder = TryCatch(async (req, res) => {

    const { id } = req.params

    const order = await Order.findById(id);


    if (!order) {
        return res.status(401).json({
            success: false,
            message: "no orders found"


        })
    } else {
        await order.deleteOne();
    }

    invalidatecache({ product: false, order: true, admin: true, userid: order.user, orderid: order._id })


    return res.status(201).json({
        success: true,
        message: 'order deleted successfully'
    })
})