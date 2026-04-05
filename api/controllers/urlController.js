const generateRandomWord = require("../utils/generateRandomWords");
const Url = require("../models/Url");

// create short url
exports.shortenUrl = async (req, res) => {
    try{
        // if production version then return proper shortened url
        let isProductionVersion = process.env.RELEASE_VERSON === "PRODUCTION";

        const baseUrl = isProductionVersion ? process.env.BACKEND_SERVER_URL_PROD : process.env.BACKEND_SERVER_URL_LOCAL;

        const { originalUrl, createdBy  } = req.body;

        const randomWord = generateRandomWord();

        const url = await Url.create({
            originalUrl,
            shortenedUrl: randomWord,
            createdBy
        });

        res.status(200).json({ message: `${baseUrl}/pptiny/${randomWord}` });

    }catch(err){
        res.status(400).json({ message: err.message });
    }
};

// redirecter
exports.Redirecter = async (req, res) => {
    try {
        console.log(req);
        const { shortenCode } = req.params;

        const urlDoc = await Url.findOne({ shortenedUrl: shortenCode });

        if (!urlDoc) {
            return res.status(404).json({ message: "URL not found" });
        }

        // Redirect to original URL
        return res.redirect(urlDoc.originalUrl);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};