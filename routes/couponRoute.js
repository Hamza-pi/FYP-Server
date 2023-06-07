const router = require("express").Router();
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
} = require("../controller/couponCntrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

router.post("/add", authMiddleware, isAdmin, createCoupon);

router.get("/", authMiddleware, isAdmin, getAllCoupons);

router.put("/update/:id", authMiddleware, isAdmin, updateCoupon);

router.delete("/delete/:id", authMiddleware, isAdmin, deleteCoupon);

module.exports = router;
