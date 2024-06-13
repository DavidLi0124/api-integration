const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

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

// API ROUTER
app.use("/api", apiRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
