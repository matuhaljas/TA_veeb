const express = require("express");
const router = express.Router();
//seadistame vahevara fotode üleslaadimiseks kindlasse kataloogi
//const uploader = multer({dest: "./public/gallery/orig/"});

//kontrollerid
const {
	photoGallery,
	galleryPage
} = require("../controllers/photogalleryControllers");

router.route("/").get(photoGallery);

router.route("/:page").get(galleryPage);

//router.route("/").post(uploader.single("photoInput"), photouploadPagePost);

module.exports = router;
