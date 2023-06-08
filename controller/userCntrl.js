//============== Imports =================
const { isValidObjectId } = require("mongoose");
const generateToken = require("../config/jwtToken");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Coupon = require("../models/couponModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const generateRefreshTkn = require("../config/refreshToken");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
// ================ Function for creating user in db ================
const createUser = asyncHandler(async (req, resp) => {
  const email = req.body.email;
  const findUser = await User.findOne({ email: email});
  if (!findUser) {
    await User.create(req.body);
    resp.send({
      message:"Registration Successfull",
    });
  } else {
    throw new Error("User Already Exists");
  }
});

// ================= Function for logging in user ==================

const loginUser = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshTkn(findUser?.firstname);
    const updateUser = await User.findByIdAndUpdate(findUser?._id, {
      refreshToken: refreshToken,
    });
    resp.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
      secure: true,
      path:"http://localhost:3000/store"
    });


    resp.send({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// ================= Function for logging in user ==================

const loginAdmin = asyncHandler(async (req, resp) => {
  const { email, password } = req.body;
  const findAdmin = await User.findOne({ email: email });
  if (
    findAdmin?.role === "admin" &&
    (await findAdmin?.isPasswordMatched(password))
  ) {
    const refreshToken = generateRefreshTkn(findAdmin?.firstname);
    const updateUser = await User.findByIdAndUpdate(findAdmin?._id, {
      refreshToken: refreshToken,
    });
    resp.cookie("refreshToken", updateUser.refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    resp.send({
      _id: findAdmin?._id,
      firstname: findAdmin?.firstname,
      lastname: findAdmin?.lastname,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials or Not Authorized");
  }
});

//========================== Handle Refresh Token ====================

const handleRefreshTkn = asyncHandler(async (req, resp) => {
  const cookie = req.cookies;
  const refreshToken = cookie?.refreshToken;
  if (!refreshToken) throw new Error("No Token attached");
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("Invalid RefreshToken");
  const token = generateToken(user?._id);
  resp.send({ token });
});


//===================== get all users function ======================

const getAllUsers = asyncHandler(async (req, resp) => {
  try {
    const findUsers = await User.find();
    resp.send(findUsers);
  } catch (error) {
    throw new Error(error);
  }
});

//===================== get single user function =======================

const getUser = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    try {
      const findUser = await User.findById(id);
      resp.send(findUser);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Invalid User id");
  }
});

//==================== delete single user function ========================

const delUser = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      resp.send(deletedUser);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Invalid User id");
  }
});

//==================== update single user function =================

const updateUser = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobile: req.body.mobile,
      },
      { new: true }
    );
    resp.send(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

//================== Block User ======================

const blockUser = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    try {
      const blockedUser = await User.findByIdAndUpdate(
        id,
        {
          Blocked: true,
        },
        { new: true }
      );
      resp.send(blockedUser);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Invalid User id");
  }
});

//=================== Unblock User =================

const unBlockUser = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  if (isValidObjectId(id)) {
    try {
      const unBlockedUser = await User.findByIdAndUpdate(
        id,
        {
          Blocked: false,
        },
        { new: true }
      );
      resp.send(unBlockedUser);
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("Invalid User Id");
  }
});

// ============== Update Password ================

const updatePassword = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  if (isValidObjectId(_id)) {
    const { password } = req.body;
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      user.passwordChangedAt = Date.now();
      const updatedUser = await user.save();
      resp.send(updatedUser);
    } else {
      throw new Error("Please provide password");
    }
  } else {
    throw new Error("Invalid User Id");
  }
});

// ============== Forgot Password ================

const forgotPasswordToken = asyncHandler(async (req, resp) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("The User with this email does not exist");
  const token = await user.createPassResetToken(email);
  user.save();
  resp.send({
    token: token,
  });
});

// ============== Reset Password ================

const resetPassword = asyncHandler(async (req, resp) => {
  let token;
  const { password } = req.body;
  if (req.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        let date = new Date().getTime();
        const user = await User.findOne({
          email: decoded?.email,
          passwordResetExpires: { $gt: date },
        });
        if (!user) throw new Error("User does not exist or token expired");
        if (password) {
          user.password = password;
          user.passwordChangedAt = Date.now();
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          const updatedUser = await user.save();
          resp.send(updatedUser);
        } else {
          throw new Error("Please provide password");
        }
        resp.send({
          message: "Password Has Been Reset Successfully",
          user,
        });
      }
    } catch (error) {
      throw new Error(error);
    }
  } else {
    throw new Error("No Token Attached to Request");
  }
});

// ============== Get Wishlist ================

const getWishlist = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).populate("wishlist");
    const wishlist = user.wishlist
    resp.send(wishlist);
  } catch (error) {
    throw new Error(error);
  }
});

// ============== Add Address ================

const saveAddress = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const { address } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        address: address,
      },
      { new: true }
    );
    resp.send(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

// ============== Add to Cart ================

const addToCart = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const { productId,color,qty,price } = req.body;
  try {

      const total = qty*price;

       await new Cart({
        userId:_id,
        productId,
        price,
        color,
        qty,
        total,
      }).save()

      const cart = await Cart.find({userId:_id}).populate("productId",["title","price","images"]).populate("color","value")

      resp.send({
        message:"Added To Cart",
        cart
      });

  } catch (error) {
    throw new Error(error);
  }
});

// ============== Remove Item From Cart ================

const removeCartItem = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const {id}=req.params

  try {

   await Cart.findOneAndDelete({userId:_id,productId:id},{new:true})

   const cart = await Cart.find({userId:_id}).populate("productId",["title","price","images"]).populate("color","value")

    resp.send({
      message:"Removed Item From Cart",
      cart
    });

  } catch (error) {
    throw new Error(error);
  }
});

// ============== Get User Cart ================

const getCart = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  try {
    const cart = await Cart.find({ userId: _id }).populate("productId",["title","price","images"]).populate("color","value")
    resp.send(cart);
  } catch (error) {
    throw new Error(error);
  }
});
// ============== Update User Cart ================

const updateCart = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const {id}= req.params
  const {qty} = req.body
  try {

    const userCart = await Cart.findOne({userId:_id,productId:id});

    userCart.qty = qty;

    userCart.total = userCart.price*userCart.qty;

    await userCart.save()
  
    const cart = await Cart.find({ userId: _id }).populate(
        "productId",["title","price","images"]
      ).populate("color","value");

      resp.send({
        message:"Cart Item Updated Successfully",
        cart
      })

  } catch (error) {
    throw new Error(error);
  }
});

// ============== Apply Coupon ================

const applyCoupon = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  try {
    const isValidCoupon = await Coupon.findOne({ name: coupon });
    if (!isValidCoupon) throw new Error("Invalid Coupon or Has Expired");
    let userCartTotal = await Cart.findOne({ userId: _id }).select("subTotal");
    const newTotal = (
      userCartTotal.subTotal -
      (userCartTotal.subTotal * isValidCoupon.discount) / 100
    ).toFixed(2);
    const updateCart = await Cart.findOneAndUpdate(
      { userId: _id },
      { subTotal: newTotal },
      { new: true }
    );
    resp.send({updateCart});
  } catch (error) {
    throw new Error(error);
  }
});

// ============== Create Order ================

const createOrder = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  const body = {...req.body}
  try {


    await Order.create({
      user:_id,
      ...body
    })


    for(let i=0;i<body.orderItems.length;i++){
      const product = await Product.findById(body.orderItems[i].product);
      product.qty-=body.orderItems[i].quantity;
      product.sold +=body.orderItems[i].quantity;
      await product.save()
    }

    const order = await Order.find({ user: _id }).populate("orderItems.product",["title","images"]).populate("orderItems.color","value");

    await Cart.deleteMany({userId:_id})

    const cart = await Cart.find({ userId: _id })


    resp.send({
      message:"Order Placed Successfully",
      order,
      cart
    })

  } catch (error) {
    throw new Error(error);
  }
});

// ============= Get Orders =================

const getOrders = asyncHandler(async (req, resp) => {
  const { _id } = req.user;
  try {
    const order = await Order.find({ user: _id }).populate("orderItems.product",["title","images"]).populate("orderItems.color","value");
    resp.send(order);
  } catch (error) {
    throw new Error(error);
  }
});
// ============= Get All Orders =================

const getAllOrders = asyncHandler(async (req, resp) => {
  try {
    const orders = await Order.find().populate("orderItems.product",["title","images"]).populate("orderItems.color","value").populate("user")
    resp.send(orders);
  } catch (error) {
    throw new Error(error);
  }
});
// ============= Update Order Status =================

const updateOrderStatus = asyncHandler(async (req, resp) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    resp.send(updatedOrder);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  getAllUsers,
  getUser,
  delUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshTkn,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
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
};
