// Use .env file for local environment variables
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

// DB Config
const db = process.env.MONGO_URI;

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
