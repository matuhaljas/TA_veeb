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
    ametidAddPost,
    filmid,
    filmidAdd,
    filmidAddPost,
    kombineeritudAdd,
    kombineeritudAddPost,
    kombineeritudList
} = require("../controllers/eestifilm_Controllers");

router.route("/").get(eestifilm);

router.route("/filmiinimesed").get(filmiinimesed);

router.route("/filmiinimesed_add").get(filmiinimesedAdd);

router.route("/filmiinimesed_add").post(filmiinimesedAddPost);

router.route("/filmiinimesed_ametid").get(ametid);

router.route("/filmiinimesed_ametid_add").get(ametidAdd);

router.route("/filmiinimesed_ametid_add").post(ametidAddPost);

router.route("/filmid").get(filmid)

router.route("/filmid_add").get(filmidAdd);

router.route("/filmid_add").post(filmidAddPost);

router.route("/kombineeritud_add").get(kombineeritudAdd);

router.route("/kombineeritud_add").post(kombineeritudAddPost);

router.route("/kombineeritud").get(kombineeritudList);

module.exports = router;


/*


*/
