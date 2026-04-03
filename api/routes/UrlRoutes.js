const express = require("express");
const router = express.Router();

const { shortenUrl, Redirecter } = require("../controllers/urlController");

router.post("/shorten", shortenUrl);

router.get("/:shortenCode", Redirecter);

module.exports = router;