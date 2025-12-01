const express = require("express");
const multer = require("multer");

const router = express.Router();
//seadistame vahevara fotode Ã¼leslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
	newsuploadPage,
	newsuploadPagePost
} = require("../controllers/newsuploadControllers");

router.route("/").get(newsuploadPage);

router.route("/").post(uploader.single("photoInput"), newsuploadPagePost);

module.exports = router;
