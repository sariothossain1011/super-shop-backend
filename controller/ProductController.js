
const ProductModel = require("../models/ProductModel");
const { deleteService } = require("../services/DeleteService");
const { ListService } = require("../services/ListService");







exports.addProduct = async (req, res) => {
  try {
    // console.log(req.fields);
    // console.log(req.files);
    const { title, description, price, quantity } = req.fields;
    const { photo } = req.files;
    // console.log("PHOTO========>",photo)

    // validation
    switch (true) {
      case !title?.trim():
        return res.json({ error: "title is required" });
      case !description?.trim():
        return res.json({ error: "Description is required" });
      case !price?.trim():
        return res.json({ error: "Price is required" });
      case !quantity?.trim():
        return res.json({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    // create product
    const product = new ProductModel({ ...req.fields });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};



exports.findProduct = async (req, res) => {
  try {
    const data = await ProductModel.findById({ _id: req.params.id }).select(
      "-photo"
    );
    res.status(200).json({ status: "success", data: data });
  } catch (error) {
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};

exports.productPhoto = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).select("photo");
    if (product.photo.data) {
      res.set("Content-Type", product.photo.contentType);
      res.set("Cross-Origin-Resource-Policy", "cross-origin")
      return res.send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};

exports.findProductsList = async (req, res) => {
  const data = await ListService(req, ProductModel);
  return res.status(200).json(data);
};

exports.updateProduct = async (req, res) => {
  try {
    //   console.log(req.fields);
    //   console.log(req.files);
    const { title, description, price, quantity } = req.fields;
    const { photo } = req.files;
    //   console.log("PHOTO========>",photo)

    // validation
    switch (true) {
      case !title?.trim():
        return res.json({ error: "title is required" });
      case !description?.trim():
        return res.json({ error: "Description is required" });
      case !price?.trim():
        return res.json({ error: "Price is required" });
      case !quantity?.trim():
        return res.json({ error: "Quantity is required" });
      case photo && photo.size > 1000000:
        return res.json({ error: "Image should be less than 1mb in size" });
    }

    // update product
    const product = await ProductModel.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
      },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(200).json({ status: "success", data: product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: "fail", data: error.toString() });
  }
};


exports.deleteProduct = async (req, res) => {
  const data = await deleteService(req, ProductModel);
  return res.status(200).json(data);
};
 

