//========================== Imports =========================
const { checkOut, paymentVerification } = require("../controller/paymentCtrl");
const {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  delUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshTkn,
  logOut,
  updatePassword,
  resetPassword,
  forgotPasswordToken,
  loginAdmin,
  getWishlist,
  saveAddress,
  addToCart,
  getCart,
  applyCoupon,
  createOrder,
  getOrders,
  getAllOrders,
  updateOrderStatus,
  removeCartItem,
  updateCart,
} = require("../controller/userCntrl"); //function that handle register post req
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = require("express").Router(); // router from express.Router()

//=================== Route for post request of user =====================

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/admin/login", loginAdmin);
router.post("/password/change", authMiddleware, updatePassword);
router.post("/password/forgot", forgotPasswordToken);
router.post("/order/add", authMiddleware, createOrder);
router.post("/order/checkout",authMiddleware,checkOut)
router.post("/order/paymentVerification",authMiddleware,paymentVerification)

//=================== Route for get request of user =====================

router.get("/refresh", handleRefreshTkn);
router.get("/all_users", authMiddleware, isAdmin, getAllUsers);
router.get("/get/:id", authMiddleware, isAdmin, getUser);
router.get("/block/:id", authMiddleware, isAdmin, blockUser);
router.get("/unblock/:id", authMiddleware, isAdmin, unBlockUser);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getCart);
router.get("/order/get", authMiddleware, getOrders);
router.get("/order/", authMiddleware,isAdmin, getAllOrders);

//=================== Route for delete request of user =====================

router.delete("/:id", authMiddleware, isAdmin, delUser);
router.delete("/cart/:id",authMiddleware,removeCartItem)

//=================== Route for update/put request of user =====================

router.put("/update", authMiddleware, updateUser);
router.put("/address/save", authMiddleware, saveAddress);
router.put("/cart", authMiddleware, addToCart);
router.put("/cart/update/:id", authMiddleware, updateCart);
router.put("/password/reset", resetPassword);
router.put("/cart/apply_coupon", authMiddleware, applyCoupon);
router.put("/order/update/:id", authMiddleware, isAdmin, updateOrderStatus);
module.exports = router;
