// ==================== Imports ==============
const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategory
} = require("../controller/categoryCntrl");

// =============== Post Requsets ===============

router.post("/add", authMiddleware, isAdmin, createCategory);

// =============== Get Requsets ===============

router.get("/:id", getCategory);
router.get("/", getAllCategory);

// =============== Update/Put Requsets ===============

router.put("/update/:id", authMiddleware, isAdmin, updateCategory);

// =============== Delete Requsets ===============

router.delete("/delete/:id", authMiddleware, isAdmin, deleteCategory);

module.exports = router;
