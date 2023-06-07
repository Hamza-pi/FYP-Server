const Color = require("../models/colorModel");
const Product = require("../models/productModel")
const asyncHandler = require("express-async-handler");

const createColor = asyncHandler(async (req, resp) => {
  try {
    const color = await Color.create(req.body);
    resp.send({
      message:"Color Added Successfully",
      color
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getColor = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);
    resp.send(color);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllColor = asyncHandler(async (req, resp) => {
  try {
    const color = await Color.find();
    resp.send(color);
  } catch (error) {
    throw new Error(error);
  }
});

const updateColor = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const color = await Color.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    resp.send({
      message:"Color Updated Successfully",
      color
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteColor = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    await Product.remove({color:id})
    const deletedColor = await Color.findByIdAndDelete(id);
    resp.send(deletedColor);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createColor,
  getColor,
  getAllColor,
  updateColor,
  deleteColor,
};
