const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const path = require("path");

const connectDB = require("./config/database");
const handleError = require("./middlewares/handleError");
//load env variables
dotenv.config({ path: "./config/config.env" });

connectDB();

//import routes
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");
const friendRequestRouter = require("./routes/friendRequest");

const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Set routes
app.use("/api/posts", postRouter);
app.use("/api/auth", authRouter);
app.use("/api/friend-request", friendRequestRouter);
app.use(handleError);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.bold
  )
);
