const mongoose = require("mongoose");

// modal for storing request ip address for rate limiting purpose
const IPSchema = new mongoose.Schema({
    ipAddress: {
        type: String,
        required: true
    },
    userId: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("IPRequest", IPSchema);