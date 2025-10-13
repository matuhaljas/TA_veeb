const express = require("express");
const fs = require("fs");
//päringu lahtiharutaja POST jaoks
const bodyparser = require("body-parser");
//SQL andmebaasi moodul
//kuna kasutame asunc siis impordime msql2/promise mooduli
//const mysql = require("mysql2/promise");
const dateEt = require("./src/dateTimeET");
//const dbInfo = require("../../vp_2025_config");
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

/*dbConf = {
    host: dbInfo.configData.host,
    user: dbInfo.configData.user,
    password: dbInfo.configData.passWord,
    database: dbInfo.configData.dataBase
};*/

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

//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilm_Routes");
app.use("/Eestifilm", eestifilmRouter);


app.listen(5122);