import { TryCatch } from "../middlewares/error.js"
import { Product } from "../models/products.js"
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidatecache } from "../utils/feature.js";



// create new product------------------------
export const newProduct = TryCatch(async (req, res) => {

    const { name, category, price, stock } = req.body;
    const photo = req.file;

    if (!photo)

        return res.status(401).json({

            success: false,
            message: "please add the photo"

        })

    if (!name || !category || !price || !stock) {
        rm(photo.path, () => {
            console.log("deleted");
        })

        return res.status(401).json({

            success: false,
            message: "please enter all fields"

        })
    }


    const product = await Product.create({
        name, category: category.toLowerCase(), price, stock, photo: photo?.path,
    });

    invalidatecache({ product: true, admin: true })

    return res.status(201).json({
        success: true,
        message: 'product created successfully'
    })

})


//get latest product according to createdAt timpestamp from database 


export const latestProduct = TryCatch(async (req, res) => {

    let products;

    if (myCache.has("latest-product")) {
        products = JSON.parse(myCache.get("latest-product"));
    }
    else {

        products = await Product.find({}).sort({ createdAt: -1 }).limit(10);
        myCache.set("latest-product", JSON.stringify(products))
    }

    return res.status(200).json({

        success: true,
        products,
    })


})


export const allProductCategories = TryCatch(async (req, res) => {

    let category;

    if (myCache.has("category")) {
        category = JSON.parse(myCache.get("category"));
    }
    else {
        category = await Product.distinct("category");
        myCache.set("category", JSON.stringify(category))
    }



    return res.status(200).json({

        success: true,
        category,
    })


})

// show all product for admin only 

export const allAdminProducts = TryCatch(async (req, res) => {

    let products;

    if (myCache.has("allproduct")) {
        products = JSON.parse(myCache.get("allproduct"));
    }
    else {

        products = await Product.find({});
        myCache.set("allproduct", JSON.stringify(products))
    }


    return res.status(200).json({

        success: true,
        products,
    })


})

// show single product details



export const getSingleProduct = TryCatch(async (req, res) => {
    const id = req.params.id;
    let product;

    if (myCache.has(`singleproduct-${id}`)) {
        product = JSON.parse(myCache.get(`singleproduct-${id}`));
    }
    else {

        product = await Product.findById(id);

        if (!id) {
            return res.status(401).json({

                success: false,
                message: "id not found",
            })
        }

        if (!product) {
            return res.status(401).json({

                success: false,
                message: "product not found",
            })
        }
        myCache.set(`singleproduct-${id}`, JSON.stringify(product))
    }



    return res.status(200).json({

        success: true,
        product,
    })


})

//       update single product



export const updateProduct = TryCatch(async (req, res) => {

    const { id } = req.params;

    const { name, category, price, stock } = req.body;
    const photo = req.file;


    const product = await Product.findById(id);

    if (!product)
        return res.stats(400).json({
            success: true,
            message: 'product not found'

        })


    if (photo) {
        rm(product.photo, () => {
            console.log("old photo deleted");
        })
        product.photo = photo.path
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (price) product.price = price;


    await product.save();
    invalidatecache({ product: true, productid: product._id, admin: true })



    return res.status(201).json({
        success: true,
        message: 'product updated successfully'
    })

})



// delete product 


export const deleteProduct = TryCatch(async (req, res) => {

    const id = req.params.id;
    const product = await Product.findById(id);

    if (!id) {
        return res.status(401).json({

            success: false,
            message: "id not found",
        })
    }

    if (!product) {
        return res.status(401).json({

            success: false,
            message: "product not found",
        })
    }

    rm(product.photo, () => {
        console.log('product photo deleted');
    })

    await product.deleteOne();
    invalidatecache({ product: true, productid: product._id, admin: true })



    return res.status(200).json({

        success: true,
        message: 'product deleted successfully',
    })


})


// search products ------------


export const getSearchProduct = TryCatch(async (req, res) => {

    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;

    // (2-1)*8 = 8 product skip on page 2nd
    const skip = (page - 1) * limit; // i will skip 8 product on page 2nd

    const baseQuery = {

    }

    if (search)
        baseQuery.name = {
            $regex: search, // they will take search query from url and find the pattern for example jeans
            $options: "i",  // take case sensitive
        }


    if (price)
        baseQuery.price = {
            $lte: Number(price) // take price less then or eual to example 0-6000 rupess
        }


    if (category)
        baseQuery.category = category;



    // in that case i have a two await if i want to use two await together then use this 

    const productPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === "asc" ? 1 : -1 })
        .limit(limit)
        .skip(skip)

    const [products, filteredproductonly] = await Promise.all([

        productPromise,

        Product.find(baseQuery)

    ])


    const totalpage = Math.ceil(filteredproductonly.length / limit);


    return res.status(200).json({

        success: true,
        products,
        totalpage,
    })


})