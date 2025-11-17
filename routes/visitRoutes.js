const express = require("express");
const router = express.Router();

//kontrollerid
const {
	visit
} = require("../controllers/visitsControllers");


router.route("/").get(visit);

module.exports = router;
