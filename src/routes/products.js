import express from "express";
import { AdminOnly } from "../middlewares/myauth.js"
import { newProduct, latestProduct, allProductCategories, allAdminProducts, getSingleProduct, updateProduct, deleteProduct, getSearchProduct } from "../controllers/product.js"
import { singleUpload } from "../middlewares/multer.js"

const app = express.Router();

// create new product routes --- /api/v1/product/new 

app.post("/new", AdminOnly, singleUpload, newProduct);


// show all product for admin routes --- /api/v1/product/admin-products 

app.get("/admin-products", AdminOnly, allAdminProducts);



// get latest product routes --- /api/v1/product/latest

app.get("/latest", latestProduct);

// get all product categories routes --- /api/v1/product/categories 


app.get("/categories", allProductCategories);


// get single product details routes --- /api/v1/product/singleproduct/:id

app.get("/singleproduct/:id", getSingleProduct);



//update single product details routes --- /api/v1/product/updateproduct/:id

app.put("/updateproduct/:id", AdminOnly, singleUpload, updateProduct)


// delete product routes --- /api/v1/product/deleteproduct/:id

app.delete("/deleteproduct/:id", AdminOnly, deleteProduct)

// delete product routes --- /api/v1/product/searchproduct/


app.get("/searchproduct", getSearchProduct)






export default app;