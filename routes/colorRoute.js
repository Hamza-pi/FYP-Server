// ==================== Imports ==============
const router = require("express").Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  createColor,
  getColor,
  getAllColor,
  updateColor,
  deleteColor,
} = require("../controller/colorCntrl");

// =============== Post Requsets ===============

router.post("/add", authMiddleware, isAdmin, createColor);

// =============== Get Requsets ===============

router.get("/:id", getColor);
router.get("/", getAllColor);

// =============== Update/Put Requsets ===============

router.put("/update/:id", authMiddleware, isAdmin, updateColor);

// =============== Delete Requsets ===============

router.delete("/delete/:id", authMiddleware, isAdmin, deleteColor);

module.exports = router;
