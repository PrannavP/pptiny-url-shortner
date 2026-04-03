const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
    originalUrl:{
        type: String,
        required: true
    },
    shortenedUrl:{
        type: String
    },
    createdBy:{
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Url", UrlSchema);