const express = require('express');
const authRoutes = require("./routes/auth.route.js");

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

module.exports = app;