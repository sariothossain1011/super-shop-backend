const express = require("express");
const formidable =require("express-formidable");
const Authentication = require("../middleware/Authentication");
const {  findProduct, findProductsList, deleteProduct, addProduct, updateProduct, productPhoto } = require("../controller/ProductController");
const router = express.Router()





router.post("/addProduct",Authentication,formidable(),addProduct);
router.get("/productPhoto/:id",productPhoto)
router.get("/findProduct/:id" ,findProduct)
router.get("/findProductsList",findProductsList)
router.post("/updateProduct/:id",Authentication,formidable(),updateProduct)
router.get("/deleteProduct/:id",Authentication ,deleteProduct)




module.exports = router
