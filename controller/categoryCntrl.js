const Category = require("../models/categoryModel");
const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, resp) => {
  try {
    const category = await Category.create(req.body);
    resp.send({
      message:"Category Added Successfully",
      category
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getCategory = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    resp.send(category);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCategory = asyncHandler(async (req, resp) => {
  try {
    const categories = await Category.find();
    resp.send(categories);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCategory = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    resp.send({
      message:"Updated Category Successfully",
      category
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCategory = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    await Product.remove({category:id})
    const category = await Category.findByIdAndDelete(id);
    resp.send(category);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  getCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
};
