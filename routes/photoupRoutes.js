const express = require("express");
const multer = require("multer");
const loginCheck = require("../src/checkLogin");

const router = express.Router();

router.use(loginCheck.isLogin);

//seadistame vahevara fotode Ã¼leslaadimiseks kindlasse kataloogi
const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
	photouploadPage,
	photouploadPagePost
} = require("../controllers/photouploadControllers");

router.route("/").get(photouploadPage);

router.route("/").post(uploader.single("photoInput"), photouploadPagePost);

module.exports = router;
