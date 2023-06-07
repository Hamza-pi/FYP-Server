// =================== Imports ===============
const { default: slugify } = require("slugify");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
// ================ Function to create product in DB ================
const createProduct = asyncHandler(async (req, resp) => {
  try {
    const product = await Product.create(req.body);
    resp.send({
      message:"Product Added Successfully",
      product
    });
  } catch (error) {
    throw new Error(error);
  }
});

// ================ Function to delete product in DB ================

const delProduct = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(id);
    resp.send(product);
    // resp.send(id)
  } catch (error) {
    throw new Error(error);
  }
});

// ================ Function to get a product from DB ================

const getProduct = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const findProduct = await Product.findById(id).populate("category","title").populate("brand","title").populate("color","value");
    resp.send(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// ================ Function to get All product from DB ================

const getAllProducts = asyncHandler(async (req, resp) => {
  try {
    // ========== Filtering ==========

    const queryObj = { ...req.query };

    const excludeFields = ["page", "sort", "limit", "fields"];

    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr)).populate("category").populate("brand").populate("color");

    // ============ Sorting =============

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // ===== Limiting Fields ====

    if (req.query.fields) {
      const fields = req.query.fields.split(",").join("");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // === Pagination ===

    if (req.query.page) {
      const page = req.query.page;
      const limit = req.query.limit;
      const skip = (page - 1) * limit;
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("This page does not exits");
      }
      query = query.skip(skip).limit(limit);
    }

    const Products = await query;
    resp.send(Products);
  } catch (error) {
    throw new Error(error);
  }
});

// =============== Function to update Products ==============

const updateProduct = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    resp.send({
      message:"Updated Product Successfully",
      product
    });
  } catch (error) {
    throw new Error(error);
  }
});

// =============== Function to add product to wishlist ==============

const addToWishlist = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const { id } = req.body;
  try {
    const user = await User.findById(_id);
    const alreadyAdded = user.wishlist.includes(id);
    if (alreadyAdded) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: id },
        },
        { new: true }
      );
      const newUser = await User.findById(_id).populate("wishlist")
      resp.send({
        message:"Removed From Wishlist",
        wishlist:newUser.wishlist
      });
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: id },
        },
        { new: true }
      );
      const newUser = await User.findById(_id).populate("wishlist")
      resp.send({
        message:"Added To Wishlist",
        wishlist:newUser.wishlist
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// =============== Function to add ratings to product ==============

const addRatings = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const { star, comment, prodId } = req.body;
  try {
    const product = await Product.findById(prodId);
    const alreadyRated = product.ratings.find(
      (rating) => rating.postedBy.toString() === _id.toString()
    );
    if (alreadyRated) {
      await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { "ratings.$.star": star, "ratings.$.comment": comment } }
      );
    } else {
      await Product.findByIdAndUpdate(prodId, {
        $push: { ratings: { star: star, comment: comment, postedBy: _id } },
      });
    }
    const getAllRatings = await Product.findById(prodId);
    const numRatings = getAllRatings.ratings.length;
    const sumRatings = getAllRatings.ratings
      .map((rating) => rating.star)
      .reduce((prev, curr) => prev + curr, 0);
    const actualRating = Math.round(sumRatings / numRatings);
    const ratedProduct = await Product.findByIdAndUpdate(
      prodId,
      {
        totalRatings: actualRating,
      },
      { new: true }
    );
    resp.send(ratedProduct);
  } catch (error) {
    throw new Error(error);
  }
});



module.exports = {
  createProduct,
  delProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  addToWishlist,
  addRatings,
};
