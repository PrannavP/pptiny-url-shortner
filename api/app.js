const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// routes
app.use("/api/v1/pptiny/user", require("./routes/userRoutes"));

// redirector
app.use("/pptiny/", require("./routes/UrlRoutes"));

module.exports = app;