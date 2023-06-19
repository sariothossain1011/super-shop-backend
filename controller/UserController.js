const { HashPassword, ComparePassword } = require("../helper/PasswordHash");

const UserModel = require("../models/UserModel");

const { deleteService } = require("../services/DeleteService");
const { FindService } = require("../services/FindService");
const { CreateToken } = require("../utility/CreateToken");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name.trim()) {
      return res
        .status(400)
        .json({ status: "fail", message: "Name is required!" });
    }

    if (!email) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email is required!" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email already existing" });
    }

    const hashPassword = await HashPassword(password);

    const data = await new UserModel({
      name,
      email,
      password: hashPassword,
    }).save();
    if (!data) {
      res.status(400).json({ status: "fail", message: "registration fail" });
    }

    const { password: removedPassword, ...responseData } = data.toObject();

    res.status(200).json({ status: "success", data: responseData });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: "fail", message: "Email is required!" });
    }
    if (!password || password.length < 6) {
      return res.json({
        status: "fail",
        message: "Password must be at least 6 characters long",
      });
    }

    const data = await UserModel.findOne({ email });
    if (!data) {
      res.status(400).json({ status: "fail", message: "User not found!" });
    }

    const passwordMatch = await ComparePassword(password, data.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ status: "fail", message: "Wrong password !" });
    }

    const token = await CreateToken({_id:data._id});
    const { password: removedPassword, ...responseData } = data.toObject();
    res
      .status(200)
      .json({ status: "success", token: token, data: responseData });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};


exports.findUser = async (req, res) => {
  try {
    const data = await UserModel.findById({_id:req.userId}).select("-password");
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { address } = req.body;
    const data = await UserModel.findById(req.userId);

    const updatedData = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        address: address || user.address,
      },
      { new: true }
    );

    if (!updatedData) {
      return res.status(400).json({ status: "fail", message: "update fail" });
    }

    const { password: removedPassword, ...responseData } = updatedData.toObject();

    return res.status(200).json({ status: "success", data: responseData });
  } catch (error) {
    return res.status(400).json({ status: "fail", data: error.toString() });
  }
};



// exports.updateUser = async (req, res) => {
//   try {
//     const {address} = req.body;
//     const data = await UserModel.findById(req.userId);

//     const updatedData = await UserModel.findByIdAndUpdate(
//       req.userId,
//       {
//         address: address || user.address,
        
//       },
//       { new: true } 
//     );

//     if (!updatedData) {
//       res.status(400).json({ status: "fail", message: "update fail" });
//     }

//     const { password: removedPassword, ...responseData } = updatedData.toObject();

//     res.status(200).json({ status: "success", data: responseData });
//   } catch (error) {
//     res.status(400).json({ status: "fail", data: error.toString() });
//   }
// };

exports.deleteUser = async (req, res) => {
  const data = await deleteService(req, UserModel);
  return res.status(200).json(data);
};