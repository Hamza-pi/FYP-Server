// ===================== Imports ===================
const {
  createProduct,
  delProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  addToWishlist,
  addRatings,
} = require("../controller/productCntrl");
const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
// ============= Post Request ===============
router.post("/add", authMiddleware, isAdmin, createProduct);

// ============= Get Request ===============
router.get("/:id", authMiddleware, getProduct);
router.get("/", getAllProducts);

router.put("/update/:id", authMiddleware, isAdmin, updateProduct);
router.put("/wishlist", authMiddleware, addToWishlist);
router.put("/ratings", authMiddleware, addRatings);

// ============== Delete Request ===============

router.delete("/delete/:id", authMiddleware, isAdmin, delProduct);

// ==================== Exports ================
module.exports = router;
