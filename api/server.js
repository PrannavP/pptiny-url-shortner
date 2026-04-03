// main  entry point of the api

require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT;

// connect db
connectDB();

// start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});