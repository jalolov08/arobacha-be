const express = require("express");
const mongoose = require("mongoose");
const app = express();
const routes = require("./routes.js");
const helmet = require("helmet");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes.js");
const carRoutes = require("./routes/carRoutes.js");
const motoRoutes = require("./routes/motoRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(helmet());
app.use("/v1", routes);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
