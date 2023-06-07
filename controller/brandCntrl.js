const Brand = require("../models/brandModel");
const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, resp) => {
  try {
    const brand = await Brand.create(req.body);
    resp.send({
      message:"Brand Added Successfully",
      brand
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getBrand = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findById(id);
    resp.send(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBrand = asyncHandler(async (req, resp) => {
  try {
    const brand = await Brand.find();
    resp.send(brand);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBrand = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const brand = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    resp.send({
      message:"Updated Brand Successfully",
      brand
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBrand = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    await Product.remove({brand:id})
    const brand = await Brand.findByIdAndDelete(id);
    resp.send(brand);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createBrand,
  getBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
};
