import mongoose from "mongoose"
import { Product } from "../models/products.js";
import { myCache } from "../app.js";
import { Order } from "../models/order.js";

export const connectDB = (uri) => {
    mongoose.connect(uri,
        {
            dbName: "Shopping",
        }).then((c) => console.log(`Db connected to ${c.connection.host}`)).
        catch((e) => console.log(e));
}


export const invalidatecache = ({ product, order, admin, userid, orderid, productid }) => {

    if (product) {
        const productkeys = ["latest-product", "category", "allproduct", `singleproduct-${productid}`]
        if (typeof productid === "string") productkeys.push(`singleproduct-${product._id}`)
        if (typeof productid === "object") productkeys.push(`singleproduct-${product._id}`)

        myCache.del(productkeys)
    }


    if (order) {

        const orderkeys = [`all-orders`, `my-orders-${userid}`, `orders-${orderid}`];

        myCache.del(orderkeys)

    }

    if (admin) {

        myCache.del(["admin-stats"])
    }

}


export const reduceStock = async (orderItems) => {

    for (let i = 0; i < orderItems.length; i++) {
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if (!product) throw new Error("product not found");
        product.stock -= order.quantity;
        await product.save();
    }
};

export const calculatepercentage = (thisMonth, lastMonth) => {

    if (lastMonth === 0) return thisMonth * 100;

    const percent = ((thisMonth - lastMonth) / lastMonth) * 100;

    return Number(percent.toFixed(0));
}