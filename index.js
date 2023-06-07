//========== Imports ===========

const express = require("express"); //importing express
const dbConnect = require("./config/dbConnect"); //importing function for db connection
const dotenv = require("dotenv").config(); //dotenv configuration
const cors = require("cors"); //importing cors (package for local server requests)
const authRoute = require("./routes/authRoute"); // Route for user authentication requests
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const brandRoute = require("./routes/brandRoute");
const couponRoute = require("./routes/couponRoute");
const colorRoute = require("./routes/colorRoute");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler"); //MiddleWare

//======================= Port Number On Which server will run =====================

const PORT = process.env.PORT || 4000;

//========================= creating instance of express() ===================

const app = express();

//====================== Function to connect to database ==================

dbConnect();

//========================= The packages that are used by our server ====================
app.use(cors());
app.use(cookieParser());
app.use(express.json());



// ====================== Routes requests to server ======================
app.use("/api/user", authRoute);
app.use("/api/product", productRoute);
app.use("/api/category", categoryRoute);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRoute);
//============================ Middlewares =====================

app.use(notFound);
app.use(errorHandler);

// ==================== Server sends message on successfully listening at PORT ===================
app.listen(PORT, () => {
  console.log(`Server Is Running On PORT ${PORT}`);
});
