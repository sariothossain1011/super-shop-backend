const express = require("express");
const { register, login, deleteUser, findUser, updateUser } = require("../controller/UserController");
const Authentication = require("../middleware/Authentication");
const router = express.Router()





router.post("/register",register)
router.post("/login",login)
router.get("/findUser",Authentication,findUser)
router.post("/updateUser",Authentication ,updateUser)
router.get("/deleteUser/:id",Authentication ,deleteUser)


module.exports = router
