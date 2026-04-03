const generateRandomWord = require("../utils/generateRandomWords");
const Url = require("../models/Url");

// create short url
exports.shortenUrl = async (req, res) => {
    try{
        const { originalUrl, createdBy  } = req.body;

        const randomWord = generateRandomWord();

        const url = await Url.create({
            originalUrl,
            shortenedUrl: randomWord,
            createdBy
        });

        res.status(201).json({ message: `http://localhost:6969/pptiny/${randomWord}` });
    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

// redirecter
exports.Redirecter = async (req, res) => {
    try {
        const { shortenCode } = req.params;

        console.log(shortenCode)

        const urlDoc = await Url.findOne({ shortenedUrl: shortenCode });

        if (!urlDoc) {
            return res.status(404).json({ message: "URL not found" });
        }

        console.log(urlDoc);

        // Redirect to original URL
        return res.redirect(urlDoc.originalUrl);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};