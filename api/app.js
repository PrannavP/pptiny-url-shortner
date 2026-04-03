const express = require("express");

const app = express();

// middleware
app.use(express.json());

// routes
app.use("/api/v1/pptiny/user", require("./routes/userRoutes"));

// redirector
app.use("/pptiny/", require("./routes/UrlRoutes"));

module.exports = app;