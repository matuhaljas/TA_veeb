const express = require("express");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
const mysql = require("mysql2");
const dateEt = require("./src/dateTimeET");
const dbInfo = require("../../vp_2025_config");
const textRef = "public/txt/vanasonad.txt";
const kulastajadRef = "public/txt/visitlog.txt"

//käivitan express.js funktsiooni ja annan nime app
const app = express();

//määran veebilehe renderdamise mootori
app.set("view engine", "ejs");
//määran ühe päris kataloogi avalikult kättesaadavaks
app.use(express.static("public"));
//parsime päringu URL-i, lipp false, kui ainult tekst ja true, kui muid andmeid ka
app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasi ühenduse
const conn = mysql.createConnection({
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
});

app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/timenow", (req, res)=>{
    const weekDayNow = dateEt.weekDay();
    const dateNow = dateEt.fullDate();
    res.render("timenow", {weekDayNow: weekDayNow, dateNow: dateNow})
});

app.get("/vanasonad", (req, res)=>{
    let folkWisdom = [];
    fs.readFile(textRef, "utf-8", (err, data) => {
        if(err) {
            //kui tuleb error siis valjastame lehe aga lihtsalt vanasõnu pole
            res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: ["Ei leidnud ühtegi vanasõna"]});
        }
        else {
            folkWisdom = data.split(";");
            res.render("genericlist", {heading: "Valik Eesti vanasõnu", listData: folkWisdom});
        }
    });
});

app.get("/regvisit", (req, res)=>{
	res.render("reqvisit");
});

app.post("/regvisit", (req, res)=> {
    console.log(req.body);
    //avan teksti faili kirjutamiseks sellisel moel, et kui teda pole, luuakse
    //parameeter "a"
    fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
        if (err) {
            throw(err);
        }
        else {
            //faili senisele sisule lisamine
            fs.appendFile("public/txt/visitlog.txt", req.body.firstnameInput + " " + req.body.lastnameInput + ", " + dateEt.fullDate() + " kell " + dateEt.fullTime() + "; " , (err)=> {
                if (err) {
                    throw(err);
                }
                else {
                    console.log("Salvestatud!")
                    res.render("reqvisit");
                }
            });
        }
    });
});

app.get("/kulastajad", (req, res)=>{
    let kulastajad = [];
    fs.readFile(kulastajadRef, "utf-8", (err, data) => {
        if(err) {
            //kui tuleb error siis valjastame lehe aga lihtsalt vanasõnu pole
            res.render("kulastajad", {heading: "Siin on inimesed, kes on märkinud oma külastuse", listData: ["Keegi pole kirja pannud, et käis mul külas ;("]});
        }
        else {
            kulastajad = data.split("; ");
            res.render("kulastajad", {heading: "Siin on inimesed, kes on märkinud oma külastuse", listData: kulastajad});
        }
    });
});

app.get("/Eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/Eestifilm/filmiinimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person"
    conn.execute(sqlReq, (err, sqlres) => {
        if(err) {
            throw(err);
        }
        else {
            res.render("filmiinimesed", {personList: sqlres});
        }
    });
});

app.get("/Eestifilm/filmiinimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput >= new Date()){
	  res.render("filmiinimesed_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else {
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, req.body.deceasedInput], (err, sqlres)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else {
				res.render("filmiinimesed_add", {notice: "Andmed salvestatud"});
			}
		});
		
	}
});

app.get("/Eestifilm/filmiinimesed_ametid", (req, res)=>{
	let sqlReq = "SELECT * FROM position"
    conn.execute(sqlReq, (err, sqlres) => {
        if(err) {
            throw(err);
        }
        else {
            res.render("filmiinimesed_ametid", {personList: sqlres});
        }
    });
});

app.get("/Eestifilm/filmiinimesed_ametid_add", (req, res)=>{
	res.render("filmiinimesed_ametid_add", {notice: "Ootan sisestust"});
});

app.post("/Eestifilm/filmiinimesed_ametid_add", (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas
	if(!req.body.nameInput || !req.body.positionDescriptionInput){
	  res.render("filmiinimesed_ametid_add", {notice: "Osa andmeid oli puudu või ebakorrektsed"});
	}
	else {
		let sqlReq = "INSERT INTO position (position_name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.nameInput, req.body.positionDescriptionInput], (err, sqlres)=>{
            if(err) {
				res.render("filmiinimesed_ametid_add", {notice: "Andmete salvestamine ebaõnnestus"});
			}
			else {
				res.redirect("filmiinimesed_ametid");
			}
		});
		
	}
});


app.listen(5122);