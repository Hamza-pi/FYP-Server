const mongoose = require("mongoose"); // Erase if already required
const slugify = require("slugify");

// ============== Product Schema ===============
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Brand",
      required: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
      required:true
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Color",
      required: true,
    },
    tags:{
      type:String,
      required:true
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//==================== Slugifiying title and save as slug ====================
productSchema.pre("save", async function (next) {
  this.slug = slugify(this.title);
});

//=============== Export the model =================
module.exports = mongoose.model("Product", productSchema);
