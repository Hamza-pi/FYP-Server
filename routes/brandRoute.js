// ==================== Imports ==============
const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createBrand,
  getBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
} = require("../controller/brandCntrl");

// =============== Post Requsets ===============

router.post("/add", authMiddleware, isAdmin, createBrand);

// =============== Get Requsets ===============

router.get("/:id", getBrand);
router.get("/", getAllBrand);

// =============== Update/Put Requsets ===============

router.put("/update/:id", authMiddleware, isAdmin, updateBrand);

// =============== Delete Requsets ===============

router.delete("/delete/:id", authMiddleware, isAdmin, deleteBrand);

module.exports = router;
