const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const passport = require("./config/passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const apiRouter = require("./routes");

const app = express();
const PORT = process.env.PORT || 3001;

// MONGOOSE CONNECT
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// CORS MIDDLEWARE
app.use(cors());

// TO PARSE JSON BODIES
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// API ROUTER
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
