const fs = require("fs").promises;
const textRef = "public/txt/visitlog.txt";
const dateEt = require("../src/dateTimeET");

//@desc Home page for registering a visit
//@route GET /reqvisit
//access public

const visitRegistrationPage = (req, res)=>{
    res.render("reqvisit");
};

//@desc Home page for submiting a visit registration
//@route GET /reqvisit
//access public

const visitRegistrationPagePost = async (req, res)=>{
    const sisend = req.body.firstnameInput + " " + req.body.lastnameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + ";" + "\n";
    let file;
    try {
        file = await fs.open(textRef, "a");
        await file.appendFile(sisend, "utf-8"); 
        console.log("Salvestatud!")
        res.redirect("kulastajad");
    }
     catch(err) {
        console.log("Kahjuks tekkis viga " + err)
    }
    finally {
        if (file) await file.close();
    }
};


module.exports = {
	visitRegistrationPage,
    visitRegistrationPagePost
};