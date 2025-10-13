const express = require("express");
const router = express.Router();

//kontrollerid
const {
    eestifilm,
    filmiinimesed,
    filmiinimesedAdd,
    filmiinimesedAddPost,
    ametid,
    ametidAdd,
    ametidAddPost
} = require("../controllers/eestifilm_Controllers");

router.route("/").get(eestifilm);

router.route("/filmiinimesed").get(filmiinimesed);

router.route("/filmiinimesed_add").get(filmiinimesedAdd);

router.route("/filmiinimesed_add").post(filmiinimesedAddPost);

router.route("/filmiinimesed_ametid").get(ametid);

router.route("/filmiinimesed_ametid_add").get(ametidAdd);

router.route("/filmiinimesed_ametid_add").post(ametidAddPost);

module.exports = router;


/*


*/
