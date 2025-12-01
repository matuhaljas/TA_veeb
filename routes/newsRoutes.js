const express = require("express");
const router = express.Router();

//kontrollerid
const {
	newsPage
} = require("../controllers/newsControllers");

router.route("/").get(newsPage);


module.exports = router;
