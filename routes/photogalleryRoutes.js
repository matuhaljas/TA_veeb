const express = require("express");
const loginCheck = require("../src/checkLogin");

const router = express.Router();
//kÃµigile mrsruutidele lisan vahevara sisselogimise kontrollimiseks
router.use(loginCheck.isLogin);

//kontrollerid
const {
	photoGallery,
	galleryPage} = require("../controllers/photogalleryControllers");

router.route("/").get(photoGallery);

router.route("/:page").get(galleryPage);

module.exports = router;
