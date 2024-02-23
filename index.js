const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes.js");
const helmet = require("helmet");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { app, server } = require("./socket/socket.js");
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use("/v1/uploads", express.static("uploads"));
app.use(helmet());
app.use(cookieParser());
app.use("/v1", routes);

const PORT = process.env.PORT || 3333;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
