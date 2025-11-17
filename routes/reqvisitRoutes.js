const express = require("express");
const router = express.Router();

const {
    visitRegistrationPage,
    visitRegistrationPagePost
} = require ("../controllers/reqvisitsControllers");

router.route("/").get(visitRegistrationPage);
router.route("/").post(visitRegistrationPagePost);

module.exports = router;
