const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, resp) => {
  try {
    const coupon = await Coupon.create(req.body);
    resp.send({
      message:"Coupon Created Successfully",
      coupon
    });
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, resp) => {
  try {
    const coupons = await Coupon.find();
    resp.send(coupons);
  } catch (error) {
    throw new Error(error);
  }
});

const updateCoupon = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    resp.send({
      message:"Updated Coupon Successfully",
      coupon
    });
  } catch (error) {
    throw new Error(error);
  }
});

const deleteCoupon = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  try {
    const coupon = await Coupon.findByIdAndDelete(id);
    resp.send(coupon);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createCoupon, getAllCoupons, updateCoupon, deleteCoupon };
